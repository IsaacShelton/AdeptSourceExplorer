import { XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import sqlite from './sqlite';
import { createGlobalState } from 'react-hooks-global-state';
import './CallDistribution.scss';

const { useGlobalState } = createGlobalState({ mode: '', data: null as any[] | null, isDownsampled: false });

import { CustomTooltipContent } from './CustomTooltip';
import { useEffect, useState } from 'react';
import { downsample } from './downsample';

export default function CallDistribution({ useProjectGlobalState }: any) {
    let [data, setData] = useGlobalState('data');
    let [mode, setMode] = useGlobalState('mode');
    let [projectID] = useProjectGlobalState('projectID');
    let [isDownsampled, setIsDownsampled] = useGlobalState('isDownsampled');

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
                        let rows = await sqlite.query(`
                            SELECT CallCallee, sum(CallAmount) as NumTimes
                                FROM Call JOIN Function
                                ON CallCallerFunctionID = FunctionID
                                WHERE Function.ProjectID = :ProjectID
                                GROUP BY CallCallee ORDER BY NumTimes DESC, CallCallee ASC
                        `, {
                            ':ProjectID': projectID,
                        });

                        let rawData = rows.map((row: any) => {
                            return {
                                name: row['CallCallee'],
                                count: row['NumTimes']
                            };
                        });

                        let downsampledData = downsample(rawData, 100);

                        setData(downsampledData);
                        setIsDownsampled(downsampledData.length != rawData.length);
                    }
                };
            case 'function-name-vs-frequency': {
                return {
                    xLabel: 'Number of Overloads',
                    yLabel: 'Number of Functions',
                    title: 'Function Overload Frequency',
                    layout: 'horizontal-barchart',
                    customTooltip: CustomTooltipContent,
                    labelFormatter: (value: any) => `Having ${value} Overload${value > 1 ? 's' : ''}`,
                    fetch: async () => {
                        let rows = await sqlite.query(`
                                SELECT Count, count(*) as Frequency
                                    FROM (
                                        SELECT FunctionName, count(*) as Count
                                            FROM Function
                                            WHERE Function.ProjectID = :ProjectID
                                            GROUP BY FunctionName ORDER BY Count DESC, FunctionName ASC
                                    ) as SubTable
                                    GROUP BY Count
                            `, {
                            ':ProjectID': projectID,
                        });

                        let results: any[] = await Promise.all(rows.map((row: any) => parseInt(row['Count'])).map(
                            (count: any) => sqlite.query(`
                                SELECT FunctionName, count(*) as Count
                                    FROM Function
                                    WHERE Function.ProjectID = :ProjectID
                                    GROUP BY FunctionName
                                    HAVING Count = :Count
                                    ORDER BY FunctionName ASC
                                    LIMIT :Limit
                            `, {
                                ':Count': count,
                                ':Limit': 4,
                                ':ProjectID': projectID,
                            })
                        ));

                        let map = new Map();

                        for (let array of results) {
                            if (array.length == 0) continue;

                            map.set(array[0].Count, array.map((item: any) => item.FunctionName));
                        }

                        let rawData = rows.map((row: any) => {
                            return {
                                name: row['Count'],
                                count: row['Frequency'],
                                topNames: map.get(parseInt(row['Count'])),
                            };
                        });


                        let downsampledData = downsample(rawData, 100);

                        setData(downsampledData);
                        setIsDownsampled(rawData.length != downsampledData.length);
                    }
                };
            }
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

    let { xLabel, yLabel, title, fetch, layout, customTooltip, labelFormatter } = getInfoForMode(mode);

    const getChart = (layout: string) => {
        switch (layout) {
            case 'none':
                return <div></div>
            case 'vertical-barchart':
                return <BarChart width={800} height={600} data={data as object[]} layout="vertical">
                    <XAxis type="number" label={{ value: yLabel, position: "insideBottom", dy: 0 }} height={48} /> {/* scale="log" domain={[0.9, 'auto']} */}
                    <YAxis dataKey="name" type="category" interval={data ? Math.floor(0.1 * data.length) : 0} label={{ value: xLabel, position: "insideLeft", dy: 0, angle: -90 }} width={128} />
                    <Tooltip labelStyle={{ color: "black", fontFamily: "monospace, sans-serif" }} content={customTooltip as any} labelFormatter={labelFormatter} />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            case 'horizontal-barchart':
                return <BarChart width={800} height={600} data={data as object[]}>
                    <XAxis dataKey="name" label={{ value: xLabel, position: "insideBottom", dy: 0 }} height={54} interval={data ? Math.floor(0.1 * data.length) : 0} /> {/*angle={-90} textAnchor="end" height={128} */}
                    <YAxis label={{ value: yLabel, position: "insideLeft", angle: -90, dx: -2 }} />
                    <Tooltip labelStyle={{ color: "black", fontFamily: "monospace, sans-serif" }} content={customTooltip as any} labelFormatter={labelFormatter} />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            default:
                throw new Error("Unknown chart layout kind");
        }
    };

    if (data == null) {
        fetch();
    }

    useEffect(() => {
        fetch();
    }, [projectID]);

    return (
        <div style={{ position: "absolute", width: "100%", height: "100%" }}>
            <div style={{ marginTop: "48px", width: "100%" }}>
                <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                    <div className="custom-select">
                        <select onChange={(event) => {
                            setMode(event.target.value);
                            setData(null);
                        }} value={mode} style={{ fontSize: 20, fontFamily: 'monospace, sans-serif', userSelect: 'none' }}>
                            {modes.map((mode) => {
                                return <option value={mode} key={mode}>{getInfoForMode(mode).title}</option>
                            })}
                        </select>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", margin: 0, padding: 0 }}>
                    {
                        isDownsampled && (
                            <div className='downsampled-message'>
                                <div style={{ position: 'relative', top: 10 }}>
                                    <p style={{ color: '#666666' }}>Data was downsampled</p>
                                </div>
                            </div>
                        )
                    }
                    {
                        data != null && data.length > 0 && (
                            <div style={{ position: "relative", left: "-32px" }}>
                                <ResponsiveContainer width={800} height={600}>
                                    {getChart(layout)}
                                </ResponsiveContainer>
                            </div>
                        )
                    }
                </div>
            </div >
        </div >
    );
}
