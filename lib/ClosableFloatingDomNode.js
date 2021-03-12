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
            for (const child of this.children) {
                if (child instanceof ClosableFloatingDomNode) {
                    child.delete();
                }
            }
            event.stopPropagation();
        });
    }
    appendTo(node, index) {
        super.appendTo(node, index);
        if ((node instanceof ClosableFloatingDomNode) !== true) {
            let ancestor = this.parent;
            while (ancestor !== undefined) {
                if (ancestor === BodyNode_1.default || ancestor instanceof Popup_1.default) {
                    this.closeZone = ancestor;
                    this.closeZone.on("mousedown", this.touchCloseZone);
                }
                ancestor = ancestor.parent;
            }
        }
    }
    delete() {
        if (this.closeZone !== undefined && this.closeZone.deleted !== true) {
            this.closeZone.off("mousedown", this.touchCloseZone);
        }
        super.delete();
    }
}
exports.default = ClosableFloatingDomNode;
//# sourceMappingURL=ClosableFloatingDomNode.js.map