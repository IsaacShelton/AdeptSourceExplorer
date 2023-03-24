
import * as d3 from 'd3';
import path from 'path';
import { useEffect, useMemo, useRef } from 'react';
import { createGlobalState } from 'react-hooks-global-state';
import { useAsyncMemo } from './hooks/useAsyncMemo';
import { plural } from './plural';
import sqlite from './sqlite';

type FetchDataResult = { data: any[] | null };

type ConnectionGraphInfo = {
    title: string,
    unit: string,
    fetch: () => Promise<FetchDataResult>,
}

const modes = ['functions-per-file', 'composites-per-file'];
const { useGlobalState } = createGlobalState({ mode: modes[0], data: null as object | null, hoveredData: {}, hoveredActive: false });

const defaultFetchResult = {
    data: null,
};

export function ConnectionGraph({ useProjectGlobalState }: any) {
    const viewWidth = 1200, viewHeight = 800;

    let [mode, setMode] = useGlobalState('mode');
    let [hoveredData, setHoveredData]: any | null = useGlobalState('hoveredData');
    let [hoveredActive, setHoveredActive] = useGlobalState('hoveredActive');
    let [projectID] = useProjectGlobalState('projectID');

    const svgRef = useRef(null);

    const drag = (simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) => {
        function dragStarted(event: any, d: any) {
            if (!event.active) simulation.alphaTarget(0.7).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(this: any, event: any, d: any) {
            d.fx = event.x;
            d.fy = event.y;

            let items: any[] = d3.select(this).data();
            let data = items.length > 0 ? items[0].data : null;
            setHoveredData(data);
            setHoveredActive(true);
        }

        function dragEnded(event: any, d: any) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded);
    };

    const getInfoForMode = (mode: string): ConnectionGraphInfo => {
        switch (mode) {
            case 'functions-per-file':
                return {
                    title: 'Functions per File',
                    unit: 'Function',
                    fetch: async () => {
                        let rows: any[] = await sqlite.query(`
                            SELECT FunctionName, FunctionSourceObject
                                FROM Function
                                WHERE Function.ProjectID = :ProjectID
                                GROUP BY FunctionName, FunctionSourceObject
                        `, {
                            ':ProjectID': projectID
                        });

                        let map: Map<string, Set<string>> = new Map();

                        for (let { FunctionName, FunctionSourceObject } of rows) {
                            if (!map.has(FunctionSourceObject)) {
                                map.set(FunctionSourceObject, new Set());
                            }

                            map.get(FunctionSourceObject)?.add(FunctionName);
                        }

                        let newData: any = { children: [] };

                        for (let [key, funcs] of map) {
                            newData.children.push({
                                name: path.basename(key),
                                filename: key,
                                children: Array.from(funcs).map((x: string) => { return { functionName: x } }),
                            });
                        }

                        // Pre-calculations
                        newData.radius = 8;
                        newData.color = '#00000000';
                        newData.charge = -100;
                        for (let node of newData.children) {
                            node.radius = 15;
                            node.color = '#00000000';
                            node.charge = -200;

                            for (let child of node.children) {
                                child.radius = 3.5;
                                child.color = '#8884d8';
                                child.charge = -10;
                            }
                        }

                        return { data: newData };
                    }
                };
            case 'composites-per-file':
                return {
                    title: 'Composites per File',
                    unit: 'Composite',
                    fetch: async () => {
                        let rows: any[] = await sqlite.query(`
                            SELECT CompositeName, CompositeSourceObject
                                FROM Composite
                                WHERE Composite.ProjectID = :ProjectID
                                GROUP BY CompositeName, CompositeSourceObject
                        `, {
                            ':ProjectID': projectID
                        });

                        let map: Map<string, Set<string>> = new Map();

                        for (let { CompositeName, CompositeSourceObject } of rows) {
                            if (!map.has(CompositeSourceObject)) {
                                map.set(CompositeSourceObject, new Set());
                            }

                            map.get(CompositeSourceObject)?.add(CompositeName);
                        }

                        let newData: any = { children: [] };

                        for (let [key, funcs] of map) {
                            newData.children.push({
                                name: path.basename(key),
                                filename: key,
                                children: Array.from(funcs).map((x: string) => { return { compositeName: x } }),
                            });
                        }

                        // Pre-calculations
                        newData.radius = 8;
                        newData.color = '#00000000';
                        newData.charge = -100;
                        for (let node of newData.children) {
                            node.radius = 15;
                            node.color = '#00000000';
                            node.charge = -100;

                            for (let child of node.children) {
                                child.radius = 3.5;
                                child.color = '#8884d8';
                                child.charge = -10;
                            }
                        }

                        return { data: newData };
                    }
                };
            default:
                return {
                    title: 'None',
                    unit: '',
                    fetch: async () => {
                        return defaultFetchResult;
                    },
                };
        }
    };

    let { fetch, unit } = useMemo(() => getInfoForMode(mode), [projectID, mode]);
    let { data } = useAsyncMemo(fetch, [projectID, mode]) ?? defaultFetchResult;

    useEffect(() => {
        const root = d3.hierarchy(data ?? {});
        const links = root.links();
        const nodes = root.descendants();

        const simulation = d3.forceSimulation(nodes as any)
            .force("link", d3.forceLink(links as any).id((d: any) => d.id).distance(0).strength(0.3))
            .force("charge", d3.forceManyBody().strength((d: any) => d.data.charge))
            .force("x", d3.forceX())
            .force("y", d3.forceY());

        const svg = d3.create("svg")
            .attr("viewBox", [-viewWidth / 2, -viewHeight / 2, viewWidth, viewHeight])

        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line");

        const label = svg.append("g")
            .selectAll("text")
            .data(nodes.filter((d: any) => d?.data?.name != null))
            .join("text")
            .style("user-selection", "none")
            .text((d: any) => d.data.name)
            .attr("fill", '#FFFFFF')
            .attr("text-anchor", "middle")
            .style("font-size", 10)
            .classed("font-mono", true);

        const node = svg.append("g")
            .attr("fill", "#fff")
            .attr("stroke", "#000")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("fill", (d: any) => d.data.color)
            .attr("stroke", (d: any) => d.data.color)
            .attr("r", (d: any) => d.data.radius)
            .on('mouseover', function (d: any) {
                let items: any[] = d3.select(this).data();
                let data = items.length > 0 ? items[0].data : null;
                if (data != null && data?.filename) {
                    setHoveredData(data);
                    setHoveredActive(true);
                }
            })
            .on('mouseout', function (d) {
                setHoveredActive(false);
            })
            .call(drag(simulation) as any);

        simulation.on("tick", () => {
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);

            node
                .attr("cx", (d: any) => d.x)
                .attr("cy", (d: any) => d.y);

            label
                .attr("x", (d: any) => d.x)
                .attr("y", (d: any) => d.y);
        });

        if (svgRef.current) {
            let div = svgRef.current as HTMLElement;

            while (div.firstChild) {
                div.removeChild(div.firstChild);
            }

            div.appendChild(svg.node() as Node);
        }

        return () => {
            simulation.stop();
        }
    }, [data]);

    return <>
        <div className='absolute w-full flex justify-center align-center mt-16'>
            <div className="custom-select">
                <select onChange={(event) => setMode(event.target.value)} value={mode} className='text-[20px] font-mono rounded-[50px] select-none p-2 pr-4'>
                    {modes.map((mode) => {
                        return <option value={mode} key={mode}>{getInfoForMode(mode).title}</option>
                    })}
                </select>
            </div>
        </div>
        <div className='absolute w-full h-full'>
            <span>
                <div ref={svgRef} className='flex justify-center m-0 p-0 overflow-hidden max-w-full max-h-full' />
                <div className='text-white bottom-0 fixed select-none bg-[#1C1C1C] w-full min-h-8'>
                    <span className='transition-opacity duration 500' style={{ opacity: hoveredActive ? 1 : 0 }} >
                        <span className='font-mono text-[#888888] pl-[10px]'>
                            {hoveredData?.filename && (path.dirname(hoveredData.filename) + path.sep)}
                        </span>
                        <span className='font-mono text-[#CCCCCC]'>
                            {hoveredData?.filename && path.basename(hoveredData.filename)}
                        </span>
                        <span className='font-mono text-[#888888] pr-[10px] float-right'>
                            {hoveredData?.children && (hoveredData.children.length.toString() + ' ' + unit + plural(hoveredData.children))}
                        </span>
                    </span>
                </div>
            </span>
        </div>
    </>;
}