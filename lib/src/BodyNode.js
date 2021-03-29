"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DomNode_1 = __importDefault(require("./DomNode"));
class BodyNode extends DomNode_1.default {
    constructor() {
        super(document.body);
    }
}
exports.default = new BodyNode();
//# sourceMappingURL=BodyNode.js.map