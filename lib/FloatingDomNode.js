"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BodyNode_1 = __importDefault(require("./BodyNode"));
const DomNode_1 = __importDefault(require("./DomNode"));
const Popup_1 = __importDefault(require("./Popup"));
class FloatingDomNode extends DomNode_1.default {
    constructor(position, domElement) {
        super(domElement);
        this.position = position;
        this.style({ left: position.left, top: position.top });
    }
    static findAncestorOf(node) {
        let ancestor = node.parent;
        while (ancestor !== undefined) {
            if (ancestor === BodyNode_1.default || ancestor instanceof FloatingDomNode) {
                return ancestor;
            }
            else if (ancestor instanceof Popup_1.default) {
                return ancestor.content;
            }
            ancestor = ancestor.parent;
        }
    }
    putInsideWindow() {
        this.style({ left: this.position.left, top: this.position.top });
        const rect = this.domElement.getBoundingClientRect();
        if (rect.left + rect.width > window.innerWidth) {
            this.style({ left: window.innerWidth - rect.width });
        }
        if (rect.top + rect.height > window.innerHeight) {
            this.style({ top: window.innerHeight - rect.height });
        }
    }
    appendToAncestorOf(node) {
        const ancestor = FloatingDomNode.findAncestorOf(node);
        if (ancestor !== undefined) {
            return this.appendTo(ancestor);
        }
    }
    appendTo(node, index) {
        const that = super.appendTo(node, index);
        this.putInsideWindow();
        return that;
    }
}
exports.default = FloatingDomNode;
//# sourceMappingURL=FloatingDomNode.js.map