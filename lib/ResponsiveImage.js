"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DomNode_1 = __importDefault(require("./DomNode"));
class ResponsiveImage extends DomNode_1.default {
    constructor(tag, src) {
        super(tag);
        this.src = src;
    }
    set src(src) {
        this.domElement.src = src;
        const path = src.substring(0, src.lastIndexOf(".png"));
        this.domElement.srcset = `${path}@2x.png 2x, ${path}@3x.png 3x`;
    }
}
exports.default = ResponsiveImage;
//# sourceMappingURL=ResponsiveImage.js.map