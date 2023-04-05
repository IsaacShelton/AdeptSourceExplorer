import { useCallback, useEffect, useRef, useState } from 'react';
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
import { useProjectGlobalState } from './hooks/useProjectGlobalState';
import { viewFile } from './logic/viewFile';

const OverviewFlow = () => {
    // Create nodes

    const [projectID] = useProjectGlobalState('projectID');
    const [, setCode] = useProjectGlobalState('code');
    const [, setTab] = useProjectGlobalState('tab');
    const [, setRange] = useProjectGlobalState('range');
    const [name, setName] = useProjectGlobalState('function');

    let functionNameRef = useRef<HTMLInputElement>(null);

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

            let main: any[] = [
                {
                    kind: 'function',
                    name,
                    numOverloads: overloads.get(name),
                },
            ];

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

            if (functionNameRef.current != null) {
                functionNameRef.current.value = name;
            }
        })();
    }, [name, functionNameRef]);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const onConnect: OnConnect = useCallback((connection: Connection) => {
        setEdges((existingEdges: Edge[]) => addEdge(connection, existingEdges));
    }, []);

    const getNodeColor = useCallback((node: any) => {
        return node?.style?.background ?? '#FFFFFF';
    }, []);

    const onClickElement: NodeMouseHandler = useCallback((event, element) => {
        if (element?.data?.name == null) return;

        setName(element.data.name);
    }, []);

    const onRightClickElement: NodeMouseHandler = useCallback(
        (event, element) => {
            if (element?.data?.name == null) return;

            sqlite
                .query(
                    `SELECT FunctionDefinition, FunctionSourceObject, FunctionSourceIndex, FunctionEndIndex, FunctionEndStride FROM Function WHERE ProjectID = :ProjectID AND FunctionName = :FunctionName ORDER BY FunctionID ASC`,
                    {
                        ':ProjectID': projectID,
                        ':FunctionName': element.data.name,
                    }
                )
                .then(rows => {
                    if (rows.length > 0) {
                        let beginning = rows[0]['FunctionSourceIndex'];
                        let end = rows[0]['FunctionEndIndex'] + rows[0]['FunctionEndStride'];

                        viewFile(
                            rows[0]['FunctionSourceObject'],
                            setCode,
                            setTab,
                            setRange,
                            beginning,
                            end
                        );
                    }
                });
        },
        [projectID, setCode, setTab, setRange]
    );

    const goto = useCallback(() => {
        if (functionNameRef.current == null) return;

        setName(functionNameRef.current.value);
    }, [functionNameRef]);

    return (
        <>
            <div className="absolute flex m-0 p-0 w-full h-full justify-center">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onClickElement}
                    onNodeContextMenu={onRightClickElement}
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
                    <Background color="#aaa" gap={16} />
                </ReactFlow>
            </div>
            <div className="w-full h-10 bg-[#202020] absolute mt-10">
                <div className="flex justify-left">
                    <input
                        type="text"
                        className="mt-1 bg-[#101010] w-96 outline-none decoration-transparent font-mono px-2 mx-4 py-1 text-[#404040] focus:text-[#707070] selection:bg-[#303030]"
                        ref={functionNameRef}
                    />
                    <button className="bg-[#303030] px-4 mt-1 rounded-lg" onClick={goto}>
                        Go to
                    </button>
                </div>
            </div>
        </>
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
