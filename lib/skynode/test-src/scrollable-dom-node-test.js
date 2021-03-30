"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BodyNode_1 = __importDefault(require("../src/BodyNode"));
const ScrollableDomNode_1 = __importStar(require("../src/ScrollableDomNode"));
const dataSet = [];
for (let i = 0; i < 100; i += 1) {
    dataSet.push({
        id: `id-${i}`,
        name: `Test ${i}`,
    });
}
class TestItem extends ScrollableDomNode_1.ScrollItemDomNode {
    constructor(_data) {
        super(document.createElement("div"));
        this._data = _data;
        this.appendText(_data.name);
    }
    get data() { return this._data; }
}
class TestNode extends ScrollableDomNode_1.default {
    constructor() {
        super(document.createElement("div"), dataSet, { childTag: "div", baseChildHeight: 24 }, (data) => new TestItem(data));
        this.style({
            position: "absolute",
            width: "100%",
            height: "100%",
        });
    }
}
BodyNode_1.default.append(new TestNode());
//# sourceMappingURL=scrollable-dom-node-test.js.map