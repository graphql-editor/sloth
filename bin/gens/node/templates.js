"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imports = `import * as sloth from "@slothking-online/node";
import * as tg from "typegoose";
import { ObjectId } from "bson";`;
const map_1 = require("./map");
const s = (n = 2) => new Array(n).fill(" ").join("");
exports.dataTemplate = (props) => {
    let expstring = exports.imports;
    expstring += "\n";
    expstring += "\n";
    expstring += `${props.enums}${props.enums.length ? "\n" : ""}`;
    expstring += `${props.objects}${props.objects.length ? "\n" : ""}`;
    expstring += `${props.dataTypes}${props.dataTypes.length ? "\n" : ""}`;
    expstring += `${props.data}${props.data.length ? "\n" : ""}`;
    expstring += `export const Models = () => ({
${props.models}
})\n\n`;
    return expstring;
};
exports.joinTemplate = (propsArray) => {
    let expstring = "";
    expstring += `const slothking: {`;
    propsArray.map(props => {
        if (props.middlewares || props.endpoints) {
            expstring += `
${s(2)}${props.name}: {
${s(4)}name: string;`;
            if (props.middlewares) {
                expstring += `
${s(4)}middlewares: ${props.middlewares.types};`;
            }
            if (props.endpoints) {
                expstring += `
${s(4)}endpoints: ${props.endpoints.types};`;
            }
            expstring += `
${s(2)}};`;
        }
    });
    expstring += `
} = {`;
    expstring += propsArray
        .map(props => {
        let values = ``;
        if (props.middlewares || props.endpoints) {
            let tempTableEndpointsMiddlewares = [];
            values += `
${s(2)}${props.name}: {`;
            tempTableEndpointsMiddlewares.push(`
${s(4)}name: '${props.name}'`);
            if (props.middlewares) {
                tempTableEndpointsMiddlewares.push(`
${s(4)}middlewares: ${props.middlewares.values}`);
            }
            if (props.endpoints) {
                tempTableEndpointsMiddlewares.push(`
${s(4)}endpoints: ${props.endpoints.values}`);
            }
            if (tempTableEndpointsMiddlewares.length) {
                values += tempTableEndpointsMiddlewares.join(",");
            }
            values += `
${s(2)}}`;
            return values;
        }
    })
        .join(",");
    expstring += "\n";
    expstring += "};";
    expstring += "\n";
    expstring += "export default slothking;";
    return expstring;
};
exports.classTemplate = (c) => `export class ${c.name} extends tg.Typegoose {
${c.inputs.map(i => `${s(2)}${map_1.resolveType(i, "class", "input")};`).join("\n")}
}`;
exports.classModelTemplate = (c) => `${s(2)}${c.name}Model:new ${c.name}().getModelForClass(${c.name})`;
exports.objectTemplate = (c) => `export type ${c.name} = {
${c.inputs
    .map(i => `${s(2)}${i.name}: ${map_1.resolveType(i, "object", "input")};`)
    .join("\n")}
}`;
exports.classTypeTemplate = (c) => `export type ${c.name}Type = {
${c.inputs
    .map(i => `${s(2)}${i.name}: ${map_1.resolveType(i, "object", "input")};`)
    .join("\n")}
}`;
exports.enumTemplate = (c) => `export enum ${c.name}{
${c.inputs.map(i => `${s(2)}${i.name} = "${i.name}"`).join(",\n")}
}`;
exports.middlewareTemplate = (middlewares) => {
    if (!middlewares.length) {
        return {
            types: "{}",
            values: "{}"
        };
    }
    return {
        types: `{
${middlewares
            .map(c => `${s(6)}${c.name}: sloth.SlothkingMiddleware<
${s(8)}{
${c.inputs
            .map(i => `${s(10)}${i.name}: ${map_1.resolveType(i, "middleware", "input")};`)
            .join("\n")}
${s(8)}},
${s(8)}{ 
${c.outputs
            .map(i => `${s(10)}${i.name}: ${map_1.resolveType(i, "middleware", "context")};`)
            .join("\n")}
${s(8)}}
${s(6)}>`)
            .join(";\n")}
${s(4)}}`,
        values: `{
${middlewares
            .map(c => `${s(6)}${c.name}: {
${s(8)}name: "${c.name}"
${s(6)}}`)
            .join(",\n")}
${s(4)}}`
    };
};
exports.endpointTemplate = (endpoints) => {
    if (!endpoints.length) {
        return {
            types: "{}",
            values: "{}"
        };
    }
    return {
        types: `{
${endpoints
            .map(c => {
            let inputs = `${s(8)}{}`;
            let context = `${s(8)}{}`;
            let outputs = `${s(8)}{}`;
            if (c.inputs.length) {
                inputs = `${s(8)}{
${c.inputs
                    .map(i => `${s(10)}${i.name}: ${map_1.resolveType(i, "endpoint", "input")};`)
                    .join("\n")}
${s(8)}}`;
            }
            if (c.context.length) {
                context = `${s(8)}{
${c.context
                    .map(i => `${s(10)}${i.name}: ${map_1.resolveType(i, "endpoint", "context")};`)
                    .join("\n")}
${s(8)}}`;
            }
            if (c.outputs.length) {
                outputs = `${s(8)}{
${c.outputs
                    .map(i => `${s(10)}${i.name}: ${map_1.resolveType(i, "endpoint", "output")};`)
                    .join("\n")}
${s(8)}}`;
            }
            return `${s(6)}${c.name}: sloth.SlothkingEndpoint<
${inputs},
${context},
${outputs}
${s(6)}>;`;
        })
            .join("\n")}
${s(4)}}`,
        values: `{
${endpoints
            .map(c => `${s(6)}${c.name}: {
${s(8)}path: "${c.name}",
${s(8)}middlewares: [${c.middlewares.map(m => `'${m}'`).join(",")}]
${s(6)}}`)
            .join(",\n")}
${s(4)}}`
    };
};
//# sourceMappingURL=templates.js.map