import { parse } from "mathjs";
import { ISystem } from "../models/ISystem";
import { IDiagramNode } from "../models/IDiagramNode";

export const isSingle = (expression: string): boolean => {
    const inputs = extractInputs(expression);
    return inputs === null ||
        inputs === undefined ||
        inputs.length === 0 ||
        (inputs.length === 1 && inputs[0] === expression);
}

export const extractInputs = (expression: string): string[] => {
    const regExp = new RegExp("{[^{}]+:[^{}]+(?=})}", "gi");
    return expression.match(regExp) || [];
}

export const extractUniqueInputs = (expression: string): string[] => {
    return [...new Set(extractInputs(expression))];
}

export const extractAllUniqueInputs = (nodes: IDiagramNode[]): string[] => {
    let allInputs: string[] = [];
    nodes.forEach(node => {
        allInputs = allInputs.concat(extractInputs(node.expression));
    });

    return [...new Set(allInputs)];
}

export const groupByToMap = <T, Q>(array: T[], predicate: (value: T, index: number, array: T[]) => Q) => {
    return array.reduce((map, value, index, array) => {
        const key = predicate(value, index, array);

        map.get(key)?.push(value) ?? map.set(key, [value]);

        return map;
    }, new Map<Q, T[]>());
};

export const validateExpression = (expression: string, systems: ISystem[]): boolean => {
    try {
        parse(expression.replaceAll(new RegExp("{[^{}]+:[^{}]+(?=})}", "gi"), "X"));

        extractUniqueInputs(expression).forEach(input => {
            const splitInput = input.replace("{", "").replace("}", "").split(":");

            if (systems.find(c => c.id === splitInput[0] && (c.dataInputs.find(di => di.id === splitInput[1]) !== undefined)) === undefined) {
                throw new Error("Falta sistema o input");
            }
        })

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}