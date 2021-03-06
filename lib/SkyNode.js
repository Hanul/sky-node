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
            this.children.push(node);
            node.parent = this;
        }
    }
    appendTo(node, index) {
        if (index < this.children.length) {
            this.children.splice(index, 0, node);
        }
        else {
            this.children.push(node);
        }
        node.parent = this;
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