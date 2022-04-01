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
                tag += id.substring(cindex);
                id = id.substring(0, cindex);
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
            if (value === undefined) {
                this.domElement.style.removeProperty(key);
            }
            else if (typeof value === "number" &&
                key !== "zIndex" &&
                key !== "opacity" &&
                key !== "flexGrow" &&
                key !== "flexShrink" &&
                key !== "gridGap" &&
                key !== "order" &&
                key !== "zoom") {
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
    get innerScrollPosition() {
        let left = 0;
        let top = 0;
        if (this.domElement !== document.body) {
            let parent = this.domElement.parentNode;
            while (parent !== document.body && parent !== null) {
                if (parent instanceof HTMLElement) {
                    left += parent.scrollLeft;
                    top += parent.scrollTop;
                }
                parent = parent.parentNode;
            }
        }
        return { left, top };
    }
    onDom(eventName, eventHandler) {
        if (this.domEventMap[eventName] === undefined) {
            this.domEventMap[eventName] = [];
        }
        const domEventHandler = (event) => eventHandler(event, this);
        this.domEventMap[eventName].push({ eventHandler, domEventHandler });
        this.domElement.addEventListener(eventName, domEventHandler);
    }
    offDom(eventName, eventHandler) {
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
    fireDomEvent(eventName, ...params) {
        this.domElement.dispatchEvent(new Event(eventName));
    }
    appendText(text) {
        const fragment = new DocumentFragment();
        const strs = text.split("\n");
        for (const [index, str] of strs.entries()) {
            if (index > 0) {
                fragment.append(document.createElement("br"));
            }
            fragment.append(str);
        }
        this.domElement.append(fragment);
    }
    checkVisible() {
        if (this.parent !== undefined) {
            if (this.parent.domElement === document.body) {
                return true;
            }
            else {
                return this.parent.checkVisible();
            }
        }
        return false;
    }
    fireVisible() {
        this.fireEvent("visible");
        for (const child of this.children) {
            child.fireVisible();
        }
    }
    appendTo(node, index) {
        if (index !== undefined && index < node.children.length) {
            node.domElement.insertBefore(this.domElement, node.children[index].domElement);
        }
        else {
            node.domElement.append(this.domElement);
        }
        const that = super.appendTo(node, index);
        if (this.checkVisible() === true) {
            this.fireVisible();
        }
        return that;
    }
    empty() {
        super.empty();
        while (this.domElement.firstChild) {
            this.domElement.removeChild(this.domElement.firstChild);
        }
        return this;
    }
    addClass(className) { this.domElement.classList.add(className); }
    deleteClass(className) { this.domElement.classList.remove(className); }
    checkClass(className) { return this.domElement.classList.contains(className); }
    delete() {
        this.domElement.remove();
        this.domEventMap = undefined;
        super.delete();
    }
}
exports.default = DomNode;
//# sourceMappingURL=DomNode.js.map