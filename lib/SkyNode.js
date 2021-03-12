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
            node.appendTo(this);
        }
    }
    appendTo(node, index) {
        if (index !== undefined && index < node.children.length) {
            node.children.splice(index, 0, this);
        }
        else {
            node.children.push(this);
        }
        this.parent = node;
    }
    delete() {
        super.delete();
        if (this.parent !== undefined) {
            skyutil_1.default.pull(this.parent.children, this);
        }
        for (const child of this.children) {
            child.delete();
        }
        this.children = undefined;
    }
}
exports.default = SkyNode;
//# sourceMappingURL=SkyNode.js.map