"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.find = (nodes, type) => {
    return nodes.filter(n => n.type === type && n.subType === "definition");
};
exports.findEndpoints = (nodes) => {
    return nodes.filter(n => n.type === "endpoint");
};
exports.getPath = (node, links, nodes) => {
    const nextLink = function* (nodeId) {
        yield nodeId;
        const link = links.find((l) => l.to.nodeId === nodeId &&
            nodes.find(n => n.id === l.from.nodeId).type === "middleware");
        if (link) {
            yield* nextLink(link.from.nodeId);
        }
    };
    const firstLink = nextLink(node.id);
    let all = [...firstLink];
    all = all.filter(a => a !== node.id);
    return all;
};
exports.getPathNodes = (node, links, nodes) => {
    let p = exports.getPath(node, links, nodes)
        .map(p => {
        const n = nodes.find(n => n.id === p);
        if (n.clone) {
            return [
                n,
                ...exports.getPathNodes(nodes.find(nn => nn.id === n.clone), links, nodes)
            ];
        }
        return [n];
    })
        .reduce((a, b) => [...a, ...b], []);
    return p;
};
exports.nodeOrRef = (node, nodes) => {
    if (!node.clone) {
        return node;
    }
    return nodes.find(n => n.id === node.clone);
};
exports.getDefinitionPoints = (links, nodes, n, io, array = false) => links
    .filter(l => l[io === "input" ? "to" : "from"].nodeId === n.id)
    .map(l => nodes.find(n => n.id === l[io !== "input" ? "to" : "from"].nodeId && n.subType === io))
    .filter(n => n)
    .map(l => l.type === "array"
    ? exports.getDefinitionPoints(links, nodes, l, io, true)
    : [{ name: l.name, type: l.type, array }])
    .reduce((a, b) => [...a, ...b], [])
    .map(n => ({
    name: n.name,
    type: n.type,
    array: array || n.array
}));
exports.getDefinitionInputs = (links, nodes, n) => exports.getDefinitionPoints(links, nodes, n, "input");
exports.getDefinitionOutputs = (links, nodes, n) => exports.getDefinitionPoints(links, nodes, n, "output");
//# sourceMappingURL=utils.js.map