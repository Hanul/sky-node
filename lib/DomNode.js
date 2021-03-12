"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SkyNode_1 = __importDefault(require("./SkyNode"));
class DomNode extends SkyNode_1.default {
    constructor(domElement) {
        super();
        this.domElement = domElement;
        this.children = [];
    }
    style(style) {
        for (const [key, value] of Object.entries(style)) {
            if (typeof value === "number" && key !== "zIndex" && key !== "opacity") {
                this.domElement.style[key] = `${value}px`;
            }
            else {
                this.domElement.style[key] = value;
            }
        }
    }
    on(eventName, eventHandler) {
        this.domElement.addEventListener(eventName, eventHandler);
        super.on(eventName, eventHandler);
    }
    off(eventName, eventHandler) {
        this.domElement.removeEventListener(eventName, eventHandler);
        super.off(eventName, eventHandler);
    }
    appendText(text) {
        this.domElement.append(text);
    }
    appendTo(node, index) {
        super.appendTo(node, index);
        if (index !== undefined && index < node.children.length) {
            node.domElement.insertBefore(this.domElement, node.children[index].domElement);
        }
        else {
            node.domElement.append(this.domElement);
        }
    }
    delete() {
        this.domElement.remove();
        super.delete();
    }
}
exports.default = DomNode;
//# sourceMappingURL=DomNode.js.map