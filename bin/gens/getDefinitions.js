"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const dedupeByName = (arr, param) => {
    return arr.filter((a, i) => arr.findIndex(ar => ar[param] === a[param]) === i);
};
exports.getDefinitions = (extensions) => {
    let allNodes = extensions
        .map(e => e.nodes)
        .reduce((a, b) => {
        return [...a, ...b];
    }, []);
    let allLinks = extensions
        .map(e => e.links)
        .reduce((a, b) => {
        return [...a, ...b];
    }, []);
    const allDefinitions = allNodes
        .filter(n => n.subType === "definition" || n.type === "endpoint")
        .map(n => ({
        id: n.id,
        name: n.name,
        type: n.type,
        pathMiddlewareNodes: utils_1.getPathNodes(n, allLinks, allNodes),
        inputs: utils_1.getDefinitionInputs(allLinks, allNodes, n),
        outputs: utils_1.getDefinitionOutputs(allLinks, allNodes, n)
    }));
    const middlewareDefinitions = allDefinitions
        .filter(n => n.type === "middleware")
        .map(n => {
        const middlewareClones = n.pathMiddlewareNodes.map(p => allDefinitions.find(a => a.id === p.clone));
        const inputs = dedupeByName([
            ...n.inputs,
            ...middlewareClones
                .map(n => n.inputs)
                .reduce((a, b) => [...a, ...b], [])
        ], "name");
        const outputs = dedupeByName([
            ...n.outputs,
            ...middlewareClones
                .map(n => n.outputs)
                .reduce((a, b) => [...a, ...b], [])
        ], "name");
        return Object.assign({}, n, { inputs,
            outputs, middlewares: dedupeByName(middlewareClones, "name").map(m => m.name) });
    });
    const endpointsDefinitions = allDefinitions
        .filter(n => n.type === "endpoint")
        .map(n => {
        const middlewareClones = n.pathMiddlewareNodes.map(p => middlewareDefinitions.find(a => a.id === p.clone));
        const inputs = dedupeByName([
            ...n.inputs,
            ...middlewareClones
                .map(n => n.inputs)
                .reduce((a, b) => [...a, ...b], [])
        ], "name");
        let context = [];
        let outputs = [...n.outputs];
        context = dedupeByName([
            ...middlewareClones
                .map(n => n.outputs)
                .reduce((a, b) => [...a, ...b], [])
        ], "name");
        return Object.assign({}, n, { inputs,
            outputs,
            context, middlewares: [
                ...new Set(middlewareClones
                    .map(m => [m.name, ...m.middlewares])
                    .reduce((a, b) => [...a, ...b], [])
                    .reverse())
            ] });
    });
    return {
        middlewareDefinitions,
        endpointsDefinitions,
        allNodes,
        allLinks
    };
};
//# sourceMappingURL=getDefinitions.js.map