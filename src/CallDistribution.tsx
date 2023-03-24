
import { XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import sqlite from './sqlite';
import { createGlobalState } from 'react-hooks-global-state';
import './CallDistribution.scss';

const modes = ['callee-vs-frequency', 'function-name-vs-frequency'];
const { useGlobalState } = createGlobalState({ mode: modes[0], data: null as any[] | null, isDownsampled: false });

import { CustomTooltipContent } from './CustomTooltip';
import { useMemo } from 'react';
import { downsample } from './downsample';
import { useAsyncMemo } from './hooks/useAsyncMemo';
import { plural } from './plural';

type FetchDataResult = { data: any[] | null, isDownsampled: boolean }

type ChartLayout = 'vertical-barchart' | 'horizontal-barchart' | 'none';

type ChartInfo = {
    xLabel: string,
    yLabel: string,
    title: string,
    layout: ChartLayout,
    fetch: () => Promise<FetchDataResult>,
    customTooltip?: any;
    labelFormatter?: (value: any) => string;
}

export default function CallDistribution({ useProjectGlobalState }: any) {
    let [mode, setMode] = useGlobalState('mode');
    let [projectID] = useProjectGlobalState('projectID');

    const defaultFetchResult = {
        data: null,
        isDownsampled: false,
    };

    const getInfoForMode = (mode: string): ChartInfo => {
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

                        return {
                            data: downsampledData,
                            isDownsampled: downsampledData.length != rawData.length,
                        };
                    }
                };
            case 'function-name-vs-frequency': {
                return {
                    xLabel: 'Number of Overloads',
                    yLabel: 'Number of Functions',
                    title: 'Function Overload Frequency',
                    layout: 'horizontal-barchart',
                    customTooltip: CustomTooltipContent,
                    labelFormatter: (value: any) => `Having ${value} Overload${plural(value)}`,
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

                        return {
                            data: downsampledData,
                            isDownsampled: rawData.length != downsampledData.length,
                        };
                    }
                };
            }
            default:
                return {
                    xLabel: '',
                    yLabel: '',
                    title: '',
                    layout: 'none',
                    fetch: async () => {
                        return defaultFetchResult;
                    },
                };
        }
    };

    let { xLabel, yLabel, fetch, layout, customTooltip, labelFormatter } = useMemo(() => getInfoForMode(mode), [projectID, mode]);
    let { data, isDownsampled } = useAsyncMemo(fetch, [projectID, mode]) ?? defaultFetchResult;

    const getChart = (layout: ChartLayout) => {
        switch (layout) {
            case 'none':
                return <></>
            case 'vertical-barchart':
                return <BarChart width={800} height={600} data={data ?? []} layout="vertical">
                    <XAxis type="number" label={{ value: yLabel, position: "insideBottom", dy: 0 }} height={48} />
                    <YAxis dataKey="name" type="category" interval={data ? Math.floor(0.1 * data.length) : 0} label={{ value: xLabel, position: "insideLeft", dy: 0, angle: -90 }} width={128} />
                    <Tooltip labelClassName='text-black font-mono' content={customTooltip as any} labelFormatter={labelFormatter} />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            case 'horizontal-barchart':
                return <BarChart width={800} height={600} data={data ?? []}>
                    <XAxis dataKey="name" label={{ value: xLabel, position: "insideBottom", dy: 0 }} height={54} interval={data ? Math.floor(0.1 * data.length) : 0} />
                    <YAxis label={{ value: yLabel, position: "insideLeft", angle: -90, dx: -2 }} />
                    <Tooltip labelClassName='text-black font-mono' content={customTooltip as any} labelFormatter={labelFormatter} />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            default:
                throw new Error("Unknown chart layout kind");
        }
    };

    return <div className='absolute w-full h-full'>
        <div className='mt-[48px] w-full'>
            <div className='flex justify-center align-center mb-6 mt-16'>
                <div className="custom-select">
                    <select onChange={(event) => setMode(event.target.value)} value={mode} className='text-[20px] font-mono select-none'>
                        {modes.map((mode) => {
                            return <option value={mode} key={mode}>{getInfoForMode(mode).title}</option>
                        })}
                    </select>
                </div>
            </div>
            <div className='flex justify-center m-0 p-0'>
                {
                    isDownsampled && (
                        <div className='downsampled-message'>
                            <div className='relative top-[10px]'>
                                <p className='text-[#333333]'>Data was downsampled</p>
                            </div>
                        </div>
                    )
                }
                {
                    data != null && data.length > 0 && (
                        <div className='relative left-[-32px]'>
                            <ResponsiveContainer width={800} height={600}>
                                {getChart(layout)}
                            </ResponsiveContainer>
                        </div>
                    )
                }
            </div>
        </div>
    </div >;
}
