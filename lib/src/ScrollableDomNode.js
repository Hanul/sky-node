"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollItemDomNode = void 0;
const DomNode_1 = __importDefault(require("./DomNode"));
class ScrollItemDomNode extends DomNode_1.default {
}
exports.ScrollItemDomNode = ScrollItemDomNode;
class ScrollableDomNode extends DomNode_1.default {
    constructor(domElement, dataSet, options, createChild) {
        super(domElement);
        this.options = options;
        this.createChild = createChild;
        this.dataSet = [];
        this.scrollAreaHeight = 0;
        this.refresh = () => {
        };
        this.calculateSize = () => {
            this.scrollAreaHeight = this.domElement.clientHeight;
            this.refresh();
        };
        this.resizeDebouncer = new Debouncer(100, () => this.calculateSize());
        this.resizeHandler = () => this.resizeDebouncer.run();
        for (const data of dataSet) {
            this.dataSet.push({ data, height: options.baseChildHeight });
        }
        super.append(this.topPaddingNode = new DomNode_1.default(document.createElement(options.childTag)), this.bottomPaddingNode = new DomNode_1.default(document.createElement(options.childTag)));
        this.domElement.style.overflowY = "scroll";
        this.on("scroll", this.refresh);
        window.addEventListener("resize", this.resizeHandler);
    }
    append(data) {
    }
    except(data) {
    }
}
exports.default = ScrollableDomNode;
//# sourceMappingURL=ScrollableDomNode.js.map