import { ChartDataset, Point } from "chart.js";
import { IDiagramNode } from "../models/IDiagramNode";
import { isSingle } from "./ExpressionHelper";

export const downloadBlob = (content: BlobPart, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);

    const pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', filename);
    pom.click();
};

export const generateCsv = (nodes: IDiagramNode[], entries: { nodeId: string, dataset: ChartDataset<'line'> }[]) => {
    if (entries.length > 0) {
        const utcOffset = -(new Date().getTimezoneOffset() / 60);
        return [`Identificador / Expresión;Nombre;Fecha (UTC ${utcOffset >= 0 ? ("+" + utcOffset) : utcOffset});Valor`].concat(
            entries.flatMap(entry => entry.dataset.data.map(rowData => {
                const node = nodes.find(x => x.id === entry.nodeId);
                if (isSingle(node!.expression)) {
                    return `${node!.expression.replace("{", "").replace("}", "")};${entry.dataset.label};${new Date((rowData as Point).x).toLocaleString()};${(rowData as Point).y.toFixed(3).toString()}`
                } else {
                    return `${node!.expression};${entry.dataset.label};${new Date((rowData as Point).x).toLocaleString()};${(rowData as Point).y.toFixed(3).toString()}`
                }
            }))
        ).join('\n');
    } else {
        throw new Error("No data to export");
    }
};