"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const templates_1 = require("./templates");
const getDefinitions_1 = require("../getDefinitions");
const chalk_1 = require("chalk");
const sortOrder = (arr) => {
    let newArray = [];
    let constructArray = [...arr];
    let counter = 0;
    while (constructArray.length > 0) {
        let o = constructArray[counter];
        let hasDependentInexistientClass = false;
        for (var inp of o.inputs) {
            if (inp.type === "class" && !newArray.find(a => a.name === inp.name)) {
                hasDependentInexistientClass = true;
            }
        }
        if (!hasDependentInexistientClass) {
            newArray = [...newArray, ...constructArray.splice(counter, 1)];
        }
        counter = (counter + 1) % constructArray.length;
    }
    return newArray;
};
exports.parseNode = (extensions) => {
    const { endpointsDefinitions, middlewareDefinitions, allNodes, allLinks } = getDefinitions_1.getDefinitions(extensions);
    console.log(chalk_1.default.greenBright(`Starting generation of data`));
    console.log(chalk_1.default.green("Generating objects"));
    const objects = utils_1.find(allNodes, "object")
        .map(n => ({
        name: n.name,
        inputs: utils_1.getDefinitionInputs(allLinks, allNodes, n)
    }))
        .map(c => templates_1.objectTemplate(c))
        .join("\n");
    console.log(chalk_1.default.green("Objects  generation ended"));
    const sortedClasses = sortOrder(utils_1.find(allNodes, "class").map(n => ({
        name: n.name,
        inputs: utils_1.getDefinitionInputs(allLinks, allNodes, n)
    })));
    console.log(chalk_1.default.redBright("Generating class types"));
    const dataTypes = sortedClasses.map(c => templates_1.classTypeTemplate(c)).join("\n");
    console.log(chalk_1.default.redBright("Class types generation ended"));
    console.log(chalk_1.default.blue("Generating classes"));
    const data = sortedClasses.map(c => templates_1.classTemplate(c)).join("\n");
    const models = sortedClasses.map(c => templates_1.classModelTemplate(c)).join(`,\n`);
    console.log(chalk_1.default.blue("Class generation ended"));
    console.log(chalk_1.default.magentaBright("Generating enums"));
    const enums = utils_1.find(allNodes, "enum")
        .map(n => ({
        name: n.name,
        inputs: utils_1.getDefinitionInputs(allLinks, allNodes, n).map(i => ({
            name: i.name
        }))
    }))
        .map(n => templates_1.enumTemplate(n))
        .join("\n");
    console.log(chalk_1.default.magentaBright("Enum generation ended"));
    return (templates_1.dataTemplate({
        data,
        dataTypes,
        enums,
        models,
        objects
    }) +
        templates_1.joinTemplate(extensions.map(e => {
            const { nodes, name } = e;
            console.log(chalk_1.default.yellow("Generating middlewares"));
            const middlewares = templates_1.middlewareTemplate(utils_1.find(nodes, "middleware")
                .map(n => middlewareDefinitions.find(md => md.id === n.id))
                .map(m => ({
                name: m.name,
                inputs: m.inputs,
                outputs: m.outputs
            })));
            console.log(chalk_1.default.yellow("Middleware generation ended"));
            console.log(chalk_1.default.magenta("Generating endpoints"));
            const endpoints = templates_1.endpointTemplate(utils_1.findEndpoints(nodes)
                .map(n => endpointsDefinitions.find(md => md.id === n.id))
                .map(m => ({
                name: m.name,
                inputs: m.inputs,
                context: m.context,
                outputs: m.outputs,
                middlewares: m.middlewares
            })));
            console.log(chalk_1.default.magenta("Endpoint generation ended"));
            console.log(chalk_1.default.greenBright(`Ended generation of ${name}`));
            return {
                name,
                middlewares,
                endpoints
            };
        })));
};
//# sourceMappingURL=index.js.map