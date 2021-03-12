"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DomNode_1 = __importDefault(require("./DomNode"));
class Popup extends DomNode_1.default {
    constructor(domElement) {
        super(domElement);
        this.on("mousedown", (event) => {
            event.stopPropagation();
        });
    }
}
exports.default = Popup;
//# sourceMappingURL=Popup.js.map