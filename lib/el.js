"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DomNode_1 = __importDefault(require("./DomNode"));
const el = (tag, ...children) => {
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
    const domNode = new DomNode_1.default(element);
    for (const child of children) {
        if (typeof child === "string") {
            element.append(child);
        }
        else {
            domNode.append(child);
        }
    }
    return domNode;
};
exports.default = el;
//# sourceMappingURL=el.js.map