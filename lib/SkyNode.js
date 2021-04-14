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
        for (const child of this.children) {
            child.delete();
        }
        return this;
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