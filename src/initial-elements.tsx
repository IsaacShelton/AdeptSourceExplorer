import React from 'react';
import { MarkerType, Position } from 'reactflow';
import NameIconWrapper from './NameIconWrapper';

function createNode({ nodeId, nodeType, name, kind, numOverloads, x, y }: any): any {
    let background, icon;

    switch (kind) {
        case "function":
            background = '#FF9900';
            icon = kind;
            break;
        case "composite":
            background = '#6699ff';
            icon = kind;
            break;
        case "enum":
            background = '#ff6699';
            icon = kind;
            break;
        default:
            background = '#FFFFFF';
    }

    return {
        id: nodeId,
        type: nodeType,
        data: {
            label: (<NameIconWrapper name={name} icon={icon} count={numOverloads} />),
        },
        style: {
            background,
            borderRadius: '20px',
        },
        position: { x, y },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        draggable: false,
    };
}

export const nodes = [
    createNode({ nodeId: 'a0', nodeType: 'input', name: 'caller1', kind: 'function', numOverloads: 3, x: 0, y: -200 }),
    createNode({ nodeId: 'a1', nodeType: 'input', name: 'caller2', kind: 'function', numOverloads: 1, x: 0, y: -200 + 60 }),
    createNode({ nodeId: 'd0', nodeType: 'input', name: 'thing', kind: 'composite', numOverloads: 1, x: 0, y: 0 }),
    createNode({ nodeId: 'd1', nodeType: 'input', name: 'Color', kind: 'enum', numOverloads: 1, x: 0, y: 60 }),
    {
        id: 'b0',
        data: {
            label: (<NameIconWrapper name="main" count="2" />),
        },
        style: {
            background: '#FF9900',
            borderRadius: '20px',
        },
        position: { x: 400, y: -200 + 60 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        draggable: false,
    },
    {
        id: 'c0',
        type: 'output',
        data: {
            label: (<NameIconWrapper name="getPlayerName" count="0" />),
        },
        style: {
            background: '#FF9900',
            borderRadius: '20px',
        },
        position: { x: 800, y: -200 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        draggable: false,
    },
    {
        id: 'c1',
        type: 'output',
        data: {
            label: (<NameIconWrapper name="toString" count="13" />),
        },
        style: {
            background: '#FF9900',
            borderRadius: '20px',
        },
        position: { x: 800, y: -200 + 60 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        draggable: false,
    },


    {
        id: '1',
        type: 'input',
        data: {
            label: 'Input Node',
        },
        position: { x: 250, y: 1000 + 0 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
    },
    {
        id: '2',
        data: {
            label: 'Default Node',
        },
        position: { x: 100, y: 1000 + 100 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
    },
    {
        id: '3',
        type: 'output',
        data: {
            label: 'Output Node',
        },
        position: { x: 400, y: 1000 + 100 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
    },
    {
        id: '4',
        type: 'custom',
        position: { x: 100, y: 1000 + 200 },
        data: {
            selects: {
                'handle-0': 'smoothstep',
                'handle-1': 'smoothstep',
            },
        },
    },
    {
        id: '5',
        type: 'output',
        data: {
            label: 'custom style',
        },
        className: 'circle',
        style: {
            background: '#2B6CB0',
            color: 'white',
        },
        position: { x: 400, y: 1000 + 200 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
    },
    {
        id: '6',
        type: 'output',
        style: {
            background: '#63B3ED',
            color: 'white',
            width: 100,
        },
        data: {
            label: 'Node',
        },
        position: { x: 400, y: 1000 + 325 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
    },
    {
        id: '7',
        type: 'default',
        className: 'annotation',
        data: {
            label: (
                <>
                    On the bottom left you see the <strong>Controls</strong> and the bottom right the{' '}
                    <strong>MiniMap</strong>. This is also just a node 🥳
                </>
            ),
        },
        draggable: false,
        selectable: false,
        position: { x: 150, y: 1000 + 400 },
    },
];

export const edges = [
    { id: 'e1-2', source: '1', target: '2', label: 'this is an edge label' },
    { id: 'e1-3', source: '1', target: '3', animated: true },
    { id: 'ae1', source: 'a0', target: 'b0', animated: true },
    { id: 'ae2', source: 'a1', target: 'b0', animated: true },
    { id: 'ae1c', source: 'b0', target: 'c0', animated: true },
    { id: 'ae2c', source: 'b0', target: 'c1', animated: true },
    {
        id: 'e4-5',
        source: '4',
        target: '5',
        type: 'smoothstep',
        sourceHandle: 'handle-0',
        data: {
            selectIndex: 0,
        },
        markerEnd: {
            type: MarkerType.ArrowClosed,
        },
    },
    {
        id: 'e4-6',
        source: '4',
        target: '6',
        type: 'smoothstep',
        sourceHandle: 'handle-1',
        data: {
            selectIndex: 1,
        },
        markerEnd: {
            type: MarkerType.ArrowClosed,
        },
    },
];