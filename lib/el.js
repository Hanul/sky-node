"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DomNode_1 = __importDefault(require("./DomNode"));
const el = (tag, ...children) => {
    const domNode = new DomNode_1.default(document.createElement(tag));
    for (const child of children) {
        if (typeof child === "string") {
            domNode.appendText(child);
        }
        else if (child instanceof DomNode_1.default) {
            domNode.append(child);
        }
        else {
            for (const [name, value] of Object.entries(child)) {
                if (typeof value === "function") {
                    domNode.on(name, value);
                }
                else if (name === "style" && typeof value === "object") {
                    domNode.style(value);
                }
            }
        }
    }
    return domNode;
};
exports.default = el;
//# sourceMappingURL=el.js.map