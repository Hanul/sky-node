"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BodyNode_1 = __importDefault(require("BodyNode"));
const Popup_1 = __importDefault(require("Popup"));
const FloatingDomNode_1 = __importDefault(require("./FloatingDomNode"));
class ClosableFloatingDomNode extends FloatingDomNode_1.default {
    constructor(position, domElement) {
        super(position, domElement);
        this.touchCloseZone = () => {
            this.delete();
        };
        this.onDom("mousedown", (event) => {
            this.deleteChildren(this);
            event.stopPropagation();
        });
    }
    deleteChildren(domNode) {
        for (const child of domNode.children) {
            if (child instanceof ClosableFloatingDomNode) {
                child.delete();
            }
            else {
                this.deleteChildren(child);
            }
        }
    }
    findAncestorOf(node) {
        let ancestor = node.parent;
        while (ancestor !== undefined) {
            if (ancestor === BodyNode_1.default || ancestor instanceof Popup_1.default) {
                return ancestor;
            }
            ancestor = ancestor.parent;
        }
    }
    appendTo(node, index) {
        const that = super.appendTo(node, index);
        if ((node instanceof ClosableFloatingDomNode) !== true) {
            const ancestor = this.findAncestorOf(this);
            if (ancestor !== undefined) {
                this.closeZone = ancestor;
                this.closeZone.onDom("mousedown", this.touchCloseZone);
            }
        }
        return that;
    }
    appendToAncestorOf(node) {
        const ancestor = this.findAncestorOf(node);
        if (ancestor !== undefined) {
            return this.appendTo(ancestor);
        }
    }
    exceptFromParent() {
        if (this.closeZone !== undefined && this.closeZone.deleted !== true) {
            this.closeZone.off("mousedown", this.touchCloseZone);
        }
        super.exceptFromParent();
    }
}
exports.default = ClosableFloatingDomNode;
//# sourceMappingURL=ClosableFloatingDomNode.js.map