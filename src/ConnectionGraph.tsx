
import * as d3 from 'd3';
import path from 'path';
import { useEffect, useRef } from 'react';
import { createGlobalState } from 'react-hooks-global-state';
import sqlite from './sqlite';

const drag = (simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) => {
    function dragStarted(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event: any, d: any) {
        d.fx = event.x;
        d.fy = event.y;
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

const { useGlobalState } = createGlobalState({ mode: '', data: null as object | null });

export function ConnectionGraph() {
    const viewWidth = 1200, viewHeight = 800;

    let [data, setData] = useGlobalState('data');
    let [mode, setMode] = useGlobalState('mode');

    const modes = ['functions-per-file'];

    if (mode == '') {
        setMode(modes[0]);
        setData(null);
    }

    if (data == null) {
        let rows = sqlite.query(`SELECT FunctionName, FunctionSourceObject FROM Function GROUP BY FunctionName, FunctionSourceObject`).then((rows: any[]) => {
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
                    children: Array.from(funcs).map((x: string) => { return { functionName: x } }),
                });
            }

            console.log(newData);

            setData(newData);
        });
    }

    const svgRef = useRef(null);

    useEffect(() => {
        const root = d3.hierarchy(data ?? {});
        const links = root.links();
        const nodes = root.descendants();

        const simulation = d3.forceSimulation(nodes as any)
            .force("link", d3.forceLink(links as any).id((d: any) => d.id).distance(0).strength(1))
            .force("charge", d3.forceManyBody().strength((d: any) => d?.data?.functionName ? -50 : -1000))
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
            .data(nodes)
            .join("text")
            .style("user-selection", "none")
            .text((d: any) => d.data.name ?? d.data.functionName)
            .attr("fill", '#FFFFFF')
            .attr("text-anchor", "middle")
            .style("font-size", 10)
            .style("font-family", "monospace, sans-serif")
            .style("opacity", (d: any) => d.data.name ? 1 : 0)

        const node = svg.append("g")
            .attr("fill", "#fff")
            .attr("stroke", "#000")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("fill", d => d.children ? "#8884d800" : "#8884d8")
            .attr("stroke", d => d.children ? "#8884d800" : "#8884d8")
            .attr("r", (d: any) => d.data.functionName ? 3.5 : 10)
            .on('mouseover', function (d: any) {
                label.style({ opacity: '1.0', color: 'white' } as any);
                // d.style("opacity", 1);
                // d3.select(this).style("opacity", 1);
                // console.log(d3.select(this));

                // -------------------------

                // d3.select(d.parentNode).append("text")//appending it to path's parent which is the g(group) DOM
                //     .attr("transform", function () {
                //         return "rotate(" + 0 + ")";
                //     })
                //     .attr("dx", "6") // margin
                //     .attr("dy", ".35em") // vertical-align
                //     .attr("class", "mylabel")//adding a label class
                //     .text(function () {
                //         return d.name;
                //     });
            })
            .on('mouseout', function (d) {
                // d3.select(this).style("opacity", 0);
                label.style({ opacity: '0.0' } as any);

                // -------------------------

                // d3.selectAll(".mylabel").remove();
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
    }, [data]);

    // invalidation.then(() => simulation.stop());

    return <span>
        <div style={{ position: 'absolute', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 48 }}>
            <div className="custom-select">
                <select onChange={(event) => {
                    setMode(event.target.value);
                    setData(null);
                }} value={mode} style={{ fontSize: 20, fontFamily: 'monospace, sans-serif', borderRadius: '50px', userSelect: 'none' }}>
                    {modes.map((mode) => {
                        return <option value={mode} key={mode}>{mode}</option>
                    })}
                </select>
            </div>
        </div>
        <div ref={svgRef} style={{ display: "flex", justifyContent: "center", margin: 0, padding: 0, overflow: "hidden", maxWidth: '100%', maxHeight: '100%' }} />
    </span>;
}