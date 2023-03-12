import React, { PureComponent, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, CartesianAxis, BarChart, Bar, Legend } from 'recharts';
import sqlite from './sqlite';
import { createGlobalState } from 'react-hooks-global-state';
import './CallDistribution.scss';

const { useGlobalState } = createGlobalState({ mode: '', data: null as any[] | null });

export default function CallDistribution() {
    let [data, setData] = useGlobalState('data');
    let [mode, setMode] = useGlobalState('mode');

    const modes = ['callee-vs-frequency', 'function-name-vs-frequency'];

    if (mode == '') {
        setMode(modes[0]);
        setData(null);
    }

    const getInfoForMode = (mode: string) => {
        switch (mode) {
            case 'callee-vs-frequency':
                return {
                    xLabel: 'Function Name',
                    yLabel: 'Times Called',
                    title: 'Function Call Frequency',
                    layout: 'vertical-barchart',
                    fetch: async () => {
                        let rows = await sqlite.query(`SELECT CallCallee, sum(CallAmount) as NumTimes FROM Call GROUP BY CallCallee ORDER BY NumTimes DESC, CallCallee ASC`);

                        setData(rows.map((row: any) => {
                            return {
                                name: row['CallCallee'],
                                count: row['NumTimes']
                            };
                        }))
                    }
                };
            case 'function-name-vs-frequency':
                return {
                    xLabel: 'Function Name',
                    yLabel: 'Number of Overloads',
                    title: 'Function Overload Frequency',
                    layout: 'vertical-barchart',
                    fetch: async () => {
                        let rows = await sqlite.query(`SELECT FunctionName, count(*) as Frequency FROM Function GROUP BY FunctionName ORDER BY Frequency DESC, FunctionName ASC`);

                        setData(rows.map((row: any) => {
                            return {
                                name: row['FunctionName'],
                                count: row['Frequency'],
                            };
                        }));
                    }
                };
            default:
                return {
                    xLabel: '',
                    yLabel: '',
                    title: '',
                    layout: 'none',
                    fetch: async () => { },
                };
        }
    };

    const getChart = (layout: string) => {
        switch (layout) {
            case 'none':
                return <div></div>
            case 'vertical-barchart':
                return <BarChart width={800} height={600} data={data as object[]} layout="vertical">
                    <XAxis type="number" label={{ value: yLabel, position: "insideBottom", dy: 0 }} height={48} /> {/* scale="log" domain={[0.9, 'auto']} */}
                    <YAxis dataKey="name" type="category" interval={data ? Math.floor(0.1 * data.length) : 0} label={{ value: xLabel, position: "insideLeft", dy: 0, angle: -90 }} width={128} />
                    <Tooltip labelStyle={{ color: "black", fontFamily: "monospace, sans-serif" }} />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            default:
                throw new Error("Unknown chart layout kind");
        }
    };

    let { xLabel, yLabel, title, fetch, layout } = getInfoForMode(mode);

    if (data == null) {
        fetch();
    }

    return (
        <div style={{ marginTop: "48px", width: "100%" }}>
            <div style={{ "display": "flex", justifyContent: 'center', alignItems: 'center' }}>
                <div className="custom-select">
                    <select onChange={(event) => {
                        setMode(event.target.value);
                        setData(null);
                    }} value={mode} style={{ "fontSize": 20, "fontFamily": "monospace, sans-serif" }}>
                        {modes.map((mode) => {
                            return <option value={mode} key={mode}>{title}</option>
                        })}
                    </select>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", margin: 0, padding: 0 }}>
                <div style={{ position: "relative", left: "-32px" }}>
                    <ResponsiveContainer width={800} height={600}>
                        {getChart(layout)}

                        {/* <BarChart width={600} height={600} data={data as object[]}>
                            <text x={600 / 2} y={20} fill="white" style={{ "fontFamily": "monospace, sans-serif", marginBottom: "64px" }} textAnchor="middle" dominantBaseline="central">
                                <tspan fontSize="28">{title}</tspan>
                            </text>
                            <XAxis dataKey="name" label={{ value: xLabel, position: "insideBottom", dy: 24 }} angle={-90} textAnchor="end" height={128} interval={data ? Math.floor(0.1 * data.length) : 0} />
                            <YAxis label={{ value: yLabel, position: "insideLeft", angle: -90, dx: 10 }} />
                            <Tooltip labelStyle={{ color: "black", fontFamily: "monospace, sans-serif" }} />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart> */}

                        {/* <AreaChart
                        width={600}
                        height={600}
                        data={data ?? []}
                        margin={{
                            top: 48,
                            right: 48,
                            left: 0,
                            bottom: 48,
                        }}
                        >
                            <text x={600 / 2} y={20} fill="white" style={{ "fontFamily": "monospace, sans-serif", marginBottom: "64px" }} textAnchor="middle" dominantBaseline="central">
                                <tspan fontSize="28">{title}</tspan>
                            </text>
                            <XAxis dataKey="name" label={{ value: xLabel, position: "insideBottom", dy: 24 }} />
                            <YAxis domain={['auto', 'auto']} label={{ value: yLabel, position: "insideLeft", angle: -90, dx: 10 }} />
                            <Tooltip labelStyle={{ color: "black", fontFamily: "monospace, sans-serif" }} />
                            <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
                        </AreaChart> */}
                    </ResponsiveContainer>
                </div>
            </div>
        </div >
    );
}
