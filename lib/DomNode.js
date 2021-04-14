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
        this.children = [];
        this.domEventMap = {};
        if (domElement instanceof HTMLElement) {
            this.domElement = domElement;
        }
        else {
            this.domElement = DomNode.createElement(domElement);
        }
    }
    static createElement(tag) {
        let id;
        const idIndex = tag.indexOf("#");
        if (idIndex !== -1) {
            id = tag.substring(idIndex + 1);
            tag = tag.substring(0, idIndex);
            const cindex = id.indexOf(".");
            if (cindex !== -1) {
                id = id.substring(0, cindex);
                tag += id.substring(cindex);
            }
        }
        let className;
        const classNameIndex = tag.indexOf(".");
        if (classNameIndex !== -1) {
            className = tag.substring(classNameIndex + 1).replace(/\./g, " ");
            tag = tag.substring(0, classNameIndex);
        }
        if (tag === "") {
            tag = "div";
        }
        const element = document.createElement(tag);
        if (id !== undefined) {
            element.id = id;
        }
        if (className !== undefined) {
            element.className = className;
        }
        return element;
    }
    style(style) {
        for (const [key, value] of Object.entries(style)) {
            if (typeof value === "number" &&
                key !== "zIndex" &&
                key !== "opacity" &&
                key !== "flexGrow" &&
                key !== "flexShrink" &&
                key !== "gridGap" &&
                key !== "order") {
                this.domElement.style[key] = `${value}px`;
            }
            else {
                this.domElement.style[key] = value;
            }
        }
    }
    get rect() {
        return this.domElement.getBoundingClientRect();
    }
    on(eventName, eventHandler) {
        if (`on${eventName}` in this.domElement) {
            if (this.domEventMap[eventName] === undefined) {
                this.domEventMap[eventName] = [];
            }
            const domEventHandler = (event) => eventHandler(event, this);
            this.domEventMap[eventName].push({ eventHandler, domEventHandler });
            this.domElement.addEventListener(eventName, domEventHandler);
        }
        else {
            super.on(eventName, eventHandler);
        }
    }
    off(eventName, eventHandler) {
        if (`on${eventName}` in this.domElement) {
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
        }
        else {
            super.off(eventName, eventHandler);
        }
    }
    async fireEvent(eventName, ...params) {
        if (`on${eventName}` in this.domElement) {
            this.domElement.dispatchEvent(new Event(eventName));
        }
        else {
            await super.fireEvent(eventName, ...params);
        }
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
        return super.appendTo(node, index);
    }
    exceptFromParent() {
        if (this.parent !== undefined) {
            this.parent.domElement.removeChild(this.domElement);
        }
        return super.exceptFromParent();
    }
    empty() {
        super.empty();
        while (this.domElement.firstChild) {
            this.domElement.removeChild(this.domElement.firstChild);
        }
        return this;
    }
    delete() {
        this.domEventMap = undefined;
        super.delete();
    }
}
exports.default = DomNode;
//# sourceMappingURL=DomNode.js.map