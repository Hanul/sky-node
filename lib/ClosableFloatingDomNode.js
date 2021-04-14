"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BodyNode_1 = __importDefault(require("./BodyNode"));
const FloatingDomNode_1 = __importDefault(require("./FloatingDomNode"));
const Popup_1 = __importDefault(require("./Popup"));
class ClosableFloatingDomNode extends FloatingDomNode_1.default {
    constructor(position, domElement) {
        super(position, domElement);
        this.touchCloseZone = () => {
            this.delete();
        };
        this.on("mousedown", (event) => {
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
    appendTo(node, index) {
        const that = super.appendTo(node, index);
        if ((node instanceof ClosableFloatingDomNode) !== true) {
            let ancestor = this.parent;
            while (ancestor !== undefined) {
                if (ancestor === BodyNode_1.default || ancestor instanceof Popup_1.default) {
                    this.closeZone = ancestor;
                    this.closeZone.on("mousedown", this.touchCloseZone);
                    break;
                }
                ancestor = ancestor.parent;
            }
        }
        return that;
    }
    exceptFromParent() {
        const that = super.exceptFromParent();
        if (this.closeZone !== undefined && this.closeZone.deleted !== true) {
            this.closeZone.off("mousedown", this.touchCloseZone);
        }
        return that;
    }
}
exports.default = ClosableFloatingDomNode;
//# sourceMappingURL=ClosableFloatingDomNode.js.map