import { XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import sqlite from './logic/sqlite';
import { createGlobalState } from 'react-hooks-global-state';
import { CustomTooltipContent } from './CustomTooltip';
import { useCallback, useMemo } from 'react';
import { downsample } from './logic/downsample';
import { useAsyncMemo } from './hooks/useAsyncMemo';
import { plural } from './logic/plural';
import { useProjectGlobalState } from './hooks/useProjectGlobalState';
import { CategoricalChartFunc } from 'recharts/types/chart/generateCategoricalChart';
import { viewFunction } from './logic/viewFunction';
import './CallDistribution.css';

const modes = ['callee-vs-frequency', 'function-name-vs-frequency'];
const { useGlobalState } = createGlobalState({
    mode: modes[0],
    data: null as any[] | null,
    isDownsampled: false,
});

type FetchDataResult = { data: any[] | null; isDownsampled: boolean };

type ChartLayout = 'vertical-barchart' | 'horizontal-barchart' | 'none';

type ChartInfo = {
    xLabel: string;
    yLabel: string;
    title: string;
    layout: ChartLayout;
    fetch: () => Promise<FetchDataResult>;
    customTooltip?: any;
    labelFormatter?: (value: any) => string;
};

export default function CallDistribution() {
    let [mode, setMode] = useGlobalState('mode');
    let [projectID] = useProjectGlobalState('projectID');
    const [, setCode] = useProjectGlobalState('code');
    const [, setFilename] = useProjectGlobalState('filename');
    const [, setTab] = useProjectGlobalState('tab');
    const [, setRange] = useProjectGlobalState('range');

    const defaultFetchResult = {
        data: null,
        isDownsampled: false,
    };

    const getInfoForMode = (mode: string): ChartInfo => {
        switch (mode) {
            case 'callee-vs-frequency':
                return {
                    xLabel: 'Function Name',
                    yLabel: 'Times Used',
                    title: 'Function Usage Frequency',
                    layout: 'vertical-barchart',
                    fetch: async () => {
                        let rows = await sqlite.query(
                            `SELECT CallCallee, sum(CallAmount) as NumTimes
                                FROM Call JOIN Function
                                ON CallCallerFunctionID = FunctionID
                                WHERE Function.ProjectID = :ProjectID
                                GROUP BY CallCallee ORDER BY NumTimes DESC, CallCallee ASC
                            `,
                            {
                                ':ProjectID': projectID,
                            }
                        );

                        let rawData = rows.map(row => {
                            return {
                                name: row['CallCallee'],
                                count: row['NumTimes'],
                                jumpName: row['CallCallee'],
                            };
                        });

                        let downsampledData = downsample(rawData, 100);

                        return {
                            data: downsampledData,
                            isDownsampled: downsampledData.length != rawData.length,
                        };
                    },
                };
            case 'function-name-vs-frequency': {
                return {
                    xLabel: 'Number of Overloads',
                    yLabel: 'Number of Functions',
                    title: 'Function Overload Frequency',
                    layout: 'horizontal-barchart',
                    customTooltip: CustomTooltipContent,
                    labelFormatter: value => `Having ${value} Overload${plural(value)}`,
                    fetch: async () => {
                        let rows = await sqlite.query(
                            `SELECT Count, count(*) as Frequency
                                FROM (
                                    SELECT FunctionName, count(*) as Count
                                        FROM Function
                                        WHERE Function.ProjectID = :ProjectID
                                        GROUP BY FunctionName ORDER BY Count DESC, FunctionName ASC
                                ) as SubTable
                                GROUP BY Count`,
                            {
                                ':ProjectID': projectID,
                            }
                        );

                        let results = await Promise.all(
                            rows
                                .map(row => parseInt(row['Count']))
                                .map(count =>
                                    sqlite.query(
                                        `SELECT FunctionName, count(*) as Count
                                            FROM Function
                                            WHERE Function.ProjectID = :ProjectID
                                            GROUP BY FunctionName
                                            HAVING Count = :Count
                                            ORDER BY FunctionName ASC
                                            LIMIT :Limit`,
                                        {
                                            ':Count': count,
                                            ':Limit': 4,
                                            ':ProjectID': projectID,
                                        }
                                    )
                                )
                        );

                        let map = new Map();

                        for (let array of results) {
                            if (array.length == 0) continue;

                            map.set(
                                array[0].Count,
                                array.map(item => item.FunctionName)
                            );
                        }

                        let rawData = rows.map(row => {
                            let topNames = map.get(parseInt(row['Count']));

                            return {
                                name: row['Count'],
                                count: row['Frequency'],
                                topNames,
                                jumpName: topNames && topNames.length > 0 ? topNames[0] : undefined,
                            };
                        });

                        let downsampledData = downsample(rawData, 100);

                        return {
                            data: downsampledData,
                            isDownsampled: rawData.length != downsampledData.length,
                        };
                    },
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

    let { xLabel, yLabel, fetch, layout, customTooltip, labelFormatter } = useMemo(
        () => getInfoForMode(mode),
        [projectID, mode]
    );

    let { data, isDownsampled } = useAsyncMemo(fetch, [projectID, mode]) ?? defaultFetchResult;

    const view: CategoricalChartFunc = useCallback(
        (nextState, event) => {
            let jumpName = nextState?.activePayload
                ? nextState?.activePayload[0]?.payload?.jumpName
                : 0;

            if (jumpName) {
                viewFunction(projectID, jumpName, setCode, setFilename, setTab, setRange);
            }
        },
        [projectID, setCode, setFilename, setTab, setRange]
    );

    let onChartChange = useCallback((node: any) => {
        if (node != null) {
            node.container.oncontextmenu = (e: MouseEvent) => {
                node.handleClick(e);
            };
        }
    }, []);

    const getChart = useCallback(
        (layout: ChartLayout) => {
            switch (layout) {
                case 'none':
                    return <></>;
                case 'vertical-barchart':
                    return (
                        <BarChart
                            width={1000}
                            height={600}
                            data={data ?? []}
                            layout="vertical"
                            className="left-[-100px]"
                            onClick={view}
                            ref={onChartChange}
                        >
                            <XAxis
                                type="number"
                                label={{ value: yLabel, position: 'insideBottom', dy: 0 }}
                                height={48}
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                interval={data ? Math.floor(0.1 * data.length) : 0}
                                label={{ value: xLabel, position: 'insideLeft', dy: 0, angle: -90 }}
                                width={256}
                            />
                            <Tooltip
                                labelClassName="text-black font-mono"
                                content={customTooltip as any}
                                labelFormatter={labelFormatter}
                            />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                    );
                case 'horizontal-barchart':
                    return (
                        <BarChart
                            width={800}
                            height={600}
                            data={data ?? []}
                            onClick={view}
                            ref={onChartChange}
                        >
                            <XAxis
                                dataKey="name"
                                label={{ value: xLabel, position: 'insideBottom', dy: 0 }}
                                height={54}
                                interval={data ? Math.floor(0.1 * data.length) : 0}
                            />
                            <YAxis
                                label={{
                                    value: yLabel,
                                    position: 'insideLeft',
                                    angle: -90,
                                    dx: -2,
                                }}
                            />
                            <Tooltip
                                labelClassName="text-black font-mono"
                                content={customTooltip as any}
                                labelFormatter={labelFormatter}
                            />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                    );
                default:
                    throw new Error('Unknown chart layout kind');
            }
        },
        [onChartChange, data, customTooltip]
    );

    return (
        <div className="absolute w-full h-full">
            <div className="mt-12 w-full">
                <div className="flex justify-center align-center mb-8 mt-[72px]">
                    <div className="custom-select">
                        <select
                            onChange={event => setMode(event.target.value)}
                            value={mode}
                            className="text-[20px] font-mono select-none"
                        >
                            {modes.map(mode => {
                                return (
                                    <option value={mode} key={mode}>
                                        {getInfoForMode(mode).title}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
                <div className="flex justify-center m-0 p-0">
                    {isDownsampled && (
                        <div className="absolute pointer-events-none mt-6">
                            <div className="relative top-[10px]">
                                <p className="text-[#333333]">Data was downsampled</p>
                            </div>
                        </div>
                    )}
                    {data != null && data.length > 0 && (
                        <div className="relative">{getChart(layout)}</div>
                    )}
                </div>
            </div>
        </div>
    );
}
