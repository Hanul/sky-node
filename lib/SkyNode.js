"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventcontainer_1 = __importDefault(require("eventcontainer"));
const skyutil_1 = __importDefault(require("skyutil"));
class SkyNode extends eventcontainer_1.default {
    constructor() {
        super(...arguments);
        this.children = [];
    }
    append(...nodes) {
        for (const node of nodes) {
            if (node !== undefined) {
                node.appendTo(this);
            }
        }
    }
    appendTo(node, index) {
        if (this.parent === node && index !== undefined && this.parent.children.indexOf(this) < index) {
            index -= 1;
        }
        this.exceptFromParent();
        if (index !== undefined && index < node.children.length) {
            node.children.splice(index, 0, this);
        }
        else {
            node.children.push(this);
        }
        this.parent = node;
        return this;
    }
    exceptFromParent() {
        if (this.parent !== undefined) {
            skyutil_1.default.pull(this.parent.children, this);
            this.parent = undefined;
        }
    }
    empty() {
        const copy = [];
        for (const child of this.children) {
            copy.push(child);
        }
        for (const child of copy) {
            child.delete();
        }
        return this;
    }
    checkChild(target) {
        for (const child of this.children) {
            if (child === target || child.checkChild(target) === true) {
                return true;
            }
        }
        return false;
    }
    delete() {
        super.delete();
        this.exceptFromParent();
        this.empty();
        this.children = undefined;
    }
}
exports.default = SkyNode;
//# sourceMappingURL=SkyNode.js.map