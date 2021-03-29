"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DomNode_1 = __importDefault(require("./DomNode"));
class FloatingDomNode extends DomNode_1.default {
    constructor(position, domElement) {
        super(domElement);
        this.position = position;
        this.style({ left: position.left, top: position.top });
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
}
exports.default = FloatingDomNode;
//# sourceMappingURL=FloatingDomNode.js.map