"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skyutil_1 = __importDefault(require("skyutil"));
const SkyNode_1 = __importDefault(require("./SkyNode"));
class DomNode extends SkyNode_1.default {
    constructor(domElement) {
        super();
        this.domElement = domElement;
        this.children = [];
        this.domEventMap = {};
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
        if (this.domEventMap[eventName] === undefined) {
            this.domEventMap[eventName] = [];
        }
        const domEventHandler = (event) => eventHandler(event, this);
        this.domEventMap[eventName].push({ eventHandler, domEventHandler });
        this.domElement.addEventListener(eventName, domEventHandler);
        super.on(eventName, eventHandler);
    }
    off(eventName, eventHandler) {
        const domEvents = this.domEventMap[eventName];
        if (domEvents !== undefined) {
            const domEvent = domEvents.find((de) => de.eventHandler === eventHandler);
            if (domEvent !== undefined) {
                this.domElement.removeEventListener(eventName, domEvent.domEventHandler);
                skyutil_1.default.pull(domEvents, domEvent);
                if (domEvents.length === 0) {
                    delete this.domEventMap[eventName];
                }
            }
        }
        super.off(eventName, eventHandler);
    }
    async fireEvent(eventName, ...params) {
        this.domElement.dispatchEvent(new Event(eventName));
        return super.fireEvent(eventName, ...params);
    }
    appendText(text) {
        this.domElement.append(text);
    }
    appendTo(node, index) {
        if (index !== undefined && index < node.children.length) {
            node.domElement.insertBefore(this.domElement, node.children[index].domElement);
        }
        else {
            node.domElement.append(this.domElement);
        }
        super.appendTo(node, index);
        return this;
    }
    exceptFromParent() {
        if (this.parent !== undefined) {
            this.parent.domElement.removeChild(this.domElement);
        }
        super.exceptFromParent();
    }
    delete() {
        this.domEventMap = undefined;
        super.delete();
    }
}
exports.default = DomNode;
//# sourceMappingURL=DomNode.js.map