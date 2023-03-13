
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import data from './exampleData.json';

const drag = (simulation: any) => {
    function dragstarted(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event: any, d: any) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
};

export function ConnectionGraph(): any {
    const viewWidth = 1200, viewHeight = 800;

    const root = d3.hierarchy(data);
    const links = root.links();
    const nodes = root.descendants();

    const simulation = d3.forceSimulation(nodes as any)
        .force("link", d3.forceLink(links as any).id((d: any) => d.id).distance(0).strength(0.2))
        .force("charge", d3.forceManyBody().strength(-50))
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

    const node = svg.append("g")
        .attr("fill", "#fff")
        .attr("stroke", "#000")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("fill", d => d.children ? "#FF0000" : "#000")
        .attr("stroke", d => d.children ? "#FFFFFF" : "#fff")
        .attr("r", 3.5)
        .on('mouseover', function (d: any) {
            // d3.select(this).style({ opacity: '0.8' } as any);
            // d3.select("text").style({ opacity: '1.0', color: 'white' } as any);

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
            // d3.select(this).style({ opacity: '0.0', } as any)
            // d3.select("text").style({ opacity: '0.0' } as any);

            // -------------------------

            // d3.selectAll(".mylabel").remove();
        })
        .call(drag(simulation) as any);

    node.append("text")

    const label = svg.append("g")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .style("user-selection", "none")
        .text((d: any) => d.data.value ?? '')
        .attr("fill", '#FFFFFF')
        .style("font-size", 10)
        .style("font-family", "monospace, sans-serif");

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

    // invalidation.then(() => simulation.stop());

    const svgRef = useRef(null);

    useEffect(() => {
        if (svgRef.current) {
            (svgRef.current as any).appendChild(svg.node());
        }
    }, []);

    return <div ref={svgRef} style={{ display: "flex", justifyContent: "center", margin: 0, padding: 0, overflow: "hidden", maxWidth: '100%', maxHeight: '100%' }} />;
    // return <div ref={svgRef} style={{ margin: 0 }} />;
}