"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveType = (i, requester, io) => {
    const arrayAddon = i.array ? "[]" : "";
    const context = {
        default: `${i.type}${arrayAddon}`,
        class: `tg.InstanceType<${i.name}>${arrayAddon}`,
        enum: `${i.name}${arrayAddon}`
    };
    const input = {
        default: `${i.type}${arrayAddon}`,
        class: `${i.name}Type${arrayAddon}`,
        enum: `${i.name}${arrayAddon}`,
        object: `${i.name}${arrayAddon}`
    };
    const output = Object.assign({}, input, { class: `tg.InstanceType<${i.name}>${arrayAddon}` });
    const transform = {
        object: {
            input: Object.assign({}, input, { class: `string${arrayAddon}` })
        },
        class: {
            input: {
                string: i.array
                    ? `@tg.arrayProp({items: String}) ${i.name}: ${i.type}${arrayAddon}`
                    : `@tg.prop() ${i.name}: ${i.type}`,
                number: i.array
                    ? `@tg.arrayProp({items: Number}) ${i.name}: ${i.type}${arrayAddon}`
                    : `@tg.prop() ${i.name}: ${i.type}`,
                default: i.array
                    ? `@tg.arrayProp({items:${i.type}}) ${i.name}: ${i.type}${arrayAddon}`
                    : `@tg.prop() ${i.name}: ${i.type}`,
                enum: i.array
                    ? `@tg.arrayProp({enum:${i.name},items:string}) ${i.name}: ${i.name}${arrayAddon}`
                    : `@tg.prop({enum:${i.name}}) ${i.name}: ${i.name}`,
                class: i.array
                    ? `@tg.arrayProp({itemsRef:${i.name}}) ${i.name}: ${i.name}${arrayAddon} | ObjectId${arrayAddon}`
                    : `@tg.prop({ref:${i.name}}) ${i.name}: ${i.name} | ObjectId`,
                object: i.array
                    ? `@tg.arrayProp({items:${i.name}}) ${i.name}: ${i.name}${arrayAddon}`
                    : `@tg.prop() ${i.name}: ${i.name}`
            }
        },
        middleware: {
            input,
            context
        },
        endpoint: {
            input,
            context,
            output
        }
    };
    let fn = transform[requester][io];
    if (!fn) {
        throw new Error(`Unsupported configuration in file.\n${io} is not supported in ${requester}`);
    }
    let func = fn[i.type];
    if (!func) {
        func = fn.default;
    }
    return func;
};
//# sourceMappingURL=map.js.map