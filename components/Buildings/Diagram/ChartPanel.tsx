import { Button, Stack, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    TimeScale,
    TimeSeriesScale,
    Point
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ChartDataset, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useEffect, useRef, useState } from "react";
import { IDiagramNode } from "../../../models/IDiagramNode";
import { useLazyGetHistoricDataQuery, useLazyGetPredictionDataQuery } from "../../../features/api/apiSlice";
import zoomPlugin from 'chartjs-plugin-zoom';
import autocolors from 'chartjs-plugin-autocolors';
import { isSingle, extractAllUniqueInputs, extractUniqueInputs, groupByToMap } from "../../../helpers/ExpressionHelper";
import { downloadBlob, generateCsv } from "../../../helpers/CsvHelper";
import { evaluate } from "mathjs";
import { IBuilding } from "../../../models/IBuilding";

ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    TimeSeriesScale,
    Tooltip,
    Legend,
    zoomPlugin,
    autocolors
);

export type IChartPanelProps = {
    selectedBuilding: IBuilding;
    selectedNodes: IDiagramNode[];
}

export default function ChartPanel({ selectedBuilding, selectedNodes }: IChartPanelProps) {
    const [chartData, setChartData] = useState<{ nodeId: string, dataset: ChartDataset<'line'> }[]>([]);

    const [triggerHistoricQuery] = useLazyGetHistoricDataQuery();
    const [triggerPredictionQuery] = useLazyGetPredictionDataQuery();

    const [fromDate, setFromDate] = useState<Date | null>(new Date(new Date().getTime() - 3600000 * 24 * 7));
    const [toDate, setToDate] = useState<Date | null>(new Date(new Date().getTime() + 3600000 * 24));

    const options: ChartOptions<'line'> = {
        responsive: true,
        scales: {
            x: {
                type: "timeseries",
                time: {
                    unit: "day"
                }
            }
        },
        plugins: {
            legend: {
                position: 'bottom' as const
            },
            autocolors: {
                mode: "dataset"
            },
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true
                    },
                    pinch: {
                        enabled: true
                    },
                    drag: {
                        enabled: true
                    },
                    mode: 'x'
                }
            }
        }
    };

    const generateChartOptions = () => {
        const chartOptions: ChartOptions<'line'> = { ...options };

        let left = true;
        selectedNodes.forEach(node => {
            if (chartOptions.scales![node.units] === undefined) {
                chartOptions.scales![node.units] = {
                    type: 'linear',
                    position: left ? 'left' : 'right',
                    ticks: {
                        callback: (value) => {
                            return `${value} ${node.units}`;
                        }
                    }
                }

                left = !left;
            }
        });

        return chartOptions;
    }

    const generateChartData = (history: Map<string, { x: number, y: number }[]>, predictions: Map<string, { x: number, y: number }[]>) => {
        const chartData: { nodeId: string, dataset: ChartDataset<'line'> }[] = [];

        selectedNodes.forEach(node => {
            if (!isSingle(node.expression)) {
                const exprDataset = generateExpressionData(node, history);

                if (exprDataset !== null) {
                    chartData.push(exprDataset);
                }
            } else {
                if (history.get(node.expression)) {
                    chartData.push({
                        nodeId: node.id,
                        dataset: {
                            yAxisID: node.units,
                            label: `${node.name} [${node.units}]`,
                            data: history.get(node.expression) ?? [],
                        }
                    });
                }

                if (predictions.get(node.expression)) {
                    chartData.push({
                        nodeId: node.id,
                        dataset: {
                            yAxisID: node.units,
                            label: `${node.name}(Predicción) [${node.units}]`,
                            data: predictions.get(node.expression) ?? []
                        }
                    });
                }
            }
        });

        return chartData;
    };

    const generateExpressionData = (node: IDiagramNode, history: Map<string, { x: number, y: number }[]>) => {
        const expressionInputs = extractUniqueInputs(node.expression);

        let expressionHistoryEntries: { variable: string, date: number, value: number }[] = [];

        history.forEach((values, key) => {
            if (expressionInputs.includes(key)) {
                expressionHistoryEntries = expressionHistoryEntries.concat(
                    values.map((v) => {
                        return { date: v.x, value: v.y, variable: key };
                    })
                )
            }
        });

        const groupedExpressionHistory = groupByToMap(expressionHistoryEntries, (entry) => entry.date)

        const chartDataPoints: Point[] = [];

        groupedExpressionHistory.forEach((value, key) => {
            if (value.length === expressionInputs.length) {
                let expressionToResolve = node.expression;

                value.forEach(dataEntry => {
                    expressionToResolve = expressionToResolve.replaceAll(dataEntry.variable, dataEntry.value.toString())
                });

                try {
                    const resolvedValue = evaluate(expressionToResolve);

                    if (resolvedValue !== null && resolvedValue !== undefined && resolvedValue !== "") {
                        chartDataPoints.push({
                            x: key,
                            y: resolvedValue
                        })
                    }
                } catch (e) {
                    console.log("Error evaluating expression: " + e);
                }
            }
        });

        if (chartDataPoints.length > 0) {
            return {
                nodeId: node.id,
                dataset: {
                    yAxisID: node.units,
                    label: `${node.name}(Expresión) [${node.units}]`,
                    data: chartDataPoints
                }
            }
        }

        return null;
    };

    useEffect(() => {
        let isSubscribed = true;

        const fetchAllData = async () => {
            if (selectedNodes.length > 0) {
                const uniqueInputs = extractAllUniqueInputs(selectedNodes);

                const allHistoricData: Map<string, { x: number, y: number }[]> = new Map();
                const allPredictionData: Map<string, { x: number, y: number }[]> = new Map();

                const promises = [];
                for (const input of uniqueInputs) {
                    // eslint-disable-next-line no-async-promise-executor
                    promises.push(new Promise(async (resolve) => {
                        const historicResult = await triggerHistoricQuery({
                            buildingId: selectedBuilding.id,
                            neighborhoodId: selectedBuilding.neighborhoodId,
                            systemId: input.split(":")[0].replaceAll("{", ""),
                            dataId: input.split(":")[1].replaceAll("}", ""),
                            fromDate: fromDate?.getTime(),
                            toDate: toDate?.getTime()
                        }).unwrap();

                        if (historicResult.length > 0) {
                            allHistoricData.set(input, historicResult.map(data => {
                                return { x: data.date, y: data.value }
                            }).sort((a, b) => a.x - b.x));
                        }

                        const predictionResult = await triggerPredictionQuery({
                            buildingId: selectedBuilding.id,
                            neighborhoodId: selectedBuilding.neighborhoodId,
                            systemId: input.split(":")[0].replaceAll("{", ""),
                            dataId: input.split(":")[1].replaceAll("}", ""),
                            fromDate: fromDate?.getTime(),
                            toDate: toDate?.getTime()
                        }).unwrap();

                        if (predictionResult.length > 0) {
                            allPredictionData.set(input, predictionResult.map(data => {
                                return { x: data.date, y: data.value }
                            }).sort((a, b) => a.x - b.x));
                        }
                        resolve(null);
                    }));
                }
                await Promise.all(promises);

                if (isSubscribed) {
                    setChartData(generateChartData(allHistoricData, allPredictionData));
                }
            } else {
                if (isSubscribed) {
                    setChartData([]);
                }
            }
        }

        fetchAllData();

        return () => { isSubscribed = false };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNodes, fromDate, toDate]);

    const chartRef = useRef<ChartJS<"line", number[], string>>(null);

    const handleResetZoom = () => {
        if (chartRef && chartRef.current) {
            chartRef.current.resetZoom();
        }
    };

    return (
        <Stack direction="column" width='100%' padding={2} spacing={1} sx={{ minHeight: '100%' }}>
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" spacing={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Desde"
                            value={fromDate}
                            onChange={(newValue) => {
                                setFromDate(newValue);
                            }}
                            slotProps={{ textField: { size: 'small' } }}
                        />
                        <DatePicker
                            label="Hasta"
                            value={toDate}
                            onChange={(newValue) => {
                                setToDate(newValue);
                            }}
                            slotProps={{ textField: { size: 'small' } }}
                        />
                    </LocalizationProvider>
                </Stack>

                <Button variant="contained"
                    disabled={(selectedNodes.length === 0) || chartData?.length <= 0}
                    onClick={() => { downloadBlob(generateCsv(selectedNodes, chartData), 'datosExportados.csv', 'data:text/csv;charset=utf-16;') }}
                >
                    Exportar
                </Button>
            </Stack>

            {(selectedNodes.length > 0 && chartData?.length > 0) ?
                <>
                    <Button variant="contained" onClick={handleResetZoom} sx={{ width: 150 }}>Reset Zoom</Button>
                    <Line
                        ref={chartRef}
                        options={generateChartOptions()}
                        data={{ datasets: chartData.map(x => x.dataset) }}
                    />
                </>
                :
                <Stack width='100%' height='30vh' alignItems="center" justifyContent="center">
                    <Typography>Sin datos históricos para las fechas seleccionadas</Typography>
                </Stack>
            }
        </Stack >
    );
}