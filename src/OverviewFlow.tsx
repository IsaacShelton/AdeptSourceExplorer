import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
    addEdge,
    MiniMap,
    Background,
    useNodesState,
    useEdgesState,
    Position,
    Node,
    Edge,
    OnConnect,
    Connection,
    NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import FlowNodeLabel, { FlowNodeLabelIcon } from './components/FlowNodeLabel';
import sqlite from './logic/sqlite';
import { useProjectGlobalState } from './useProjectGlobalState';

const OverviewFlow = () => {
    // Create nodes

    let [projectID] = useProjectGlobalState('projectID');
    let [name, setName] = useState('main');

    useEffect(() => {
        (async () => {
            let numOverloadsTable: any[] = await sqlite.query(
                `SELECT FunctionName, count(*) AS NumOverloads FROM Function WHERE ProjectID = :ProjectID GROUP BY FunctionName`,
                {
                    ':ProjectID': projectID,
                }
            );
            let overloads: Map<string, number> = new Map();

            for (let row of numOverloadsTable) {
                overloads.set(row['FunctionName'], parseInt(row['NumOverloads']));
            }

            let callersTable: any[] = await sqlite.query(
                `SELECT FunctionName, sum(CallAmount) as NumCalls, count(*) as NumCallingOverloads
                    FROM Function JOIN (
                        SELECT CallCallerFunctionID, CallAmount
                            FROM Call
                            WHERE CallCallee = :MainFunctionName
                    ) AS Callers
                    ON CallCallerFunctionID = FunctionID
                    WHERE Function.ProjectID = :ProjectID
                    GROUP BY FunctionName
                `,
                {
                    ':MainFunctionName': name,
                    ':ProjectID': projectID,
                }
            );

            let calleesTable: any[] = await sqlite.query(
                `SELECT DISTINCT CallCallee AS FunctionName
                    FROM Call JOIN (
                        SELECT FunctionID AS MainFunctionID
                            FROM Function
                            WHERE FunctionName = :MainFunctionName AND Function.ProjectID = :ProjectID
                    ) AS MainFunctions
                    ON Call.CallCallerFunctionID = MainFunctionID
                `,
                {
                    ':MainFunctionName': name,
                    ':ProjectID': projectID,
                }
            );

            let main: any[] = [{ kind: 'function', name, numOverloads: overloads.get(name) }];

            let inputs: any[] = callersTable.map((row: any) => {
                return {
                    kind: 'function',
                    name: row['FunctionName'],
                    numOverloads: overloads.get(row['FunctionName']),
                };
            });

            let outputs: any[] = calleesTable.map((row: any) => {
                return {
                    kind: 'function',
                    name: row['FunctionName'],
                    numOverloads: overloads.get(row['FunctionName']),
                };
            });

            inputs = inputs.map((input: any) => {
                return { ...input, nodeId: 'i-' + input.name, nodeType: 'input' };
            });
            main = main.map((node: any) => {
                return { ...node, nodeId: 'm-' + node.name, nodeType: undefined, x: 0, y: 0 };
            });
            outputs = outputs.map((output: any) => {
                return { ...output, nodeId: 'o-' + output.name, nodeType: 'output' };
            });

            if (inputs.length > 0) {
                let totalHeight = inputs.reduce((acc, item) => acc + getHeightEstimate(item), 0);
                let x = -400;
                let y = -totalHeight / 2;

                for (let input of inputs) {
                    input.x = x;
                    input.y = y;
                    y += getHeightEstimate(input);
                }
            }

            if (outputs.length > 0) {
                let totalHeight = outputs.reduce((acc, item) => acc + getHeightEstimate(item), 0);
                let x = 400;
                let y = -totalHeight / 2;

                for (let output of outputs) {
                    output.x = x;
                    output.y = y;
                    y += getHeightEstimate(output);
                }
            }

            let initialNodes: Node[] = [...inputs, ...main, ...outputs].map(createNode);

            // Create edges

            let mainId = main[0].nodeId;

            let initialEdges = [
                ...inputs.map((input: any) => {
                    return {
                        id: input.nodeId + '--' + mainId,
                        source: input.nodeId,
                        target: mainId,
                        animated: true,
                        selected: false,
                    };
                }),
                ...outputs.map((output: any) => {
                    return {
                        id: mainId + '--' + output.nodeId,
                        source: mainId,
                        target: output.nodeId,
                        animated: true,
                        selected: false,
                    };
                }),
            ];

            setNodes(initialNodes);
            setEdges(initialEdges);
        })();
    }, [name]);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const onConnect: OnConnect = useCallback((connection: Connection) => {
        setEdges((existingEdges: Edge[]) => addEdge(connection, existingEdges));
    }, []);

    const getNodeColor = useCallback((node: any) => {
        return node?.style?.background ?? '#FFFFFF';
    }, []);

    const onClickElement: NodeMouseHandler = useCallback((event, element) => {
        if (element?.data?.name != null) {
            setName(element?.data?.name);
        }
    }, []);

    return (
        <div className="absolute flex m-0 p-0 w-full h-full justify-center">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onClickElement}
                elementsSelectable={false}
                edgesFocusable={false}
                nodesConnectable={false}
                fitView
                zoomOnDoubleClick={false}
                attributionPosition="top-right"
                proOptions={{ hideAttribution: true }}
            >
                <MiniMap
                    nodeColor={getNodeColor}
                    maskColor="#3a3a3aBB"
                    nodeBorderRadius={20}
                    style={{ height: 120, background: '#2f2f2f' }}
                    zoomable
                    pannable
                />
                {/* <Controls /> */}
                <Background color="#aaa" gap={16} />
            </ReactFlow>
        </div>
    );
};

function createNode({
    nodeId,
    nodeType,
    name,
    kind,
    numOverloads,
    x,
    y,
    usedOverloads,
}: any): Node {
    let background;
    let icon: FlowNodeLabelIcon;

    switch (kind) {
        case 'function':
            background = '#FF9900';
            icon = kind;
            break;
        case 'composite':
            background = '#6699ff';
            icon = kind;
            break;
        case 'enum':
            background = '#ff6699';
            icon = kind;
            break;
        default:
            background = '#FFFFFF';
            icon = 'function';
    }

    return {
        id: nodeId,
        type: nodeType,
        data: {
            label: (
                <FlowNodeLabel
                    name={name}
                    icon={icon}
                    count={numOverloads}
                    usedOverloads={usedOverloads}
                />
            ),
            name,
        },
        style: {
            background,
            borderRadius: '20px',
            width: 'auto',
            minWidth: '150px',
            cursor: 'pointer',
        },
        position: { x, y },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        draggable: false,
    };
}

const getHeightEstimate = (node: any) => {
    return node.numOverloads > 1 ? 64 : 44;
};

export default OverviewFlow;
