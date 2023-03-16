import React, { useCallback, useLayoutEffect, useState } from 'react';
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
} from 'reactflow';

import { nodes as initialNodes, edges as initialEdges } from './initial-elements';
import CustomNode from './CustomNode';

import 'reactflow/dist/style.css';
import './OverviewFlow.scss';

const nodeTypes = {
    custom: CustomNode,
};

const minimapStyle = {
    height: 120,
    background: "#2f2f2f",
};

const onInit = (reactFlowInstance: any) => console.log('flow loaded:', reactFlowInstance);

const OverviewFlow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = useCallback((params: any) => setEdges((eds: any) => addEdge(params, eds)), []);

    // we are using a bit of a shortcut here to adjust the edge type
    // this could also be done with a custom edge for example
    const edgesWithUpdatedTypes = edges.map((edge: any) => {
        if (edge.sourceHandle) {
            const edgeType = nodes.find((node: any) => node.type === 'custom')?.data.selects[edge.sourceHandle];
            edge.type = edgeType;
        }

        return edge;
    });

    const nodeColor = (node: any) => {
        return node?.style?.background ?? "#FFFFFF";
    };

    return <div style={{ position: "absolute", width: "100%", height: "100%" }}>
        <ReactFlow
            nodes={nodes}
            edges={edgesWithUpdatedTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            fitView
            fitViewOptions={
                {
                    nodes: [
                        { id: 'a0' },
                        { id: 'a1' },
                        { id: 'b0' },
                        { id: 'c0' },
                        { id: 'c1' },
                    ]
                }
            }
            zoomOnDoubleClick={false}
            attributionPosition="top-right"
            nodeTypes={nodeTypes}
            proOptions={{ hideAttribution: true }}
        >
            <MiniMap nodeColor={nodeColor} maskColor="#3a3a3a" nodeBorderRadius={20} style={minimapStyle} zoomable pannable />
            {/* <Controls /> */}
            <Background color="#aaa" gap={16} />
        </ReactFlow >
    </div>;
};

export default OverviewFlow;