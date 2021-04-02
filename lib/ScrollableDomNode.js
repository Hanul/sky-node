"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollItemDomNode = void 0;
const debouncer_1 = __importDefault(require("@hanul/debouncer"));
const skyutil_1 = __importDefault(require("skyutil"));
const DomNode_1 = __importDefault(require("./DomNode"));
class ScrollItemDomNode extends DomNode_1.default {
}
exports.ScrollItemDomNode = ScrollItemDomNode;
class ScrollableDomNode extends DomNode_1.default {
    constructor(domElement, options, createChild) {
        super(domElement);
        this.options = options;
        this.createChild = createChild;
        this.nodeDataSet = [];
        this.scrollAreaHeight = 0;
        this.refresh = () => {
            var _a, _b, _c;
            const startTop = this.domElement.scrollTop;
            const endTop = this.domElement.scrollTop + this.scrollAreaHeight;
            let topPadding = 0;
            let bottomPadding = 0;
            let startIndex = -1;
            let endIndex = -1;
            let top = 0;
            for (const [index, info] of this.nodeDataSet.entries()) {
                if (top + info.height < startTop) {
                    topPadding += info.height;
                }
                else if (top > endTop) {
                    bottomPadding += info.height;
                }
                else {
                    if (startIndex === -1) {
                        startIndex = index;
                    }
                    if (endIndex < index) {
                        endIndex = index;
                    }
                    if (info.dom === undefined) {
                        info.dom = this.createChild(info.data, index);
                        info.dom.appendTo(this);
                        info.height = info.dom.domElement.getBoundingClientRect().height;
                    }
                }
                top += info.height;
            }
            this.bottomPaddingNode.exceptFromParent();
            for (const [index, info] of this.nodeDataSet.entries()) {
                if (startIndex <= index && index <= endIndex) {
                    (_a = info.dom) === null || _a === void 0 ? void 0 : _a.exceptFromParent();
                    (_b = info.dom) === null || _b === void 0 ? void 0 : _b.appendTo(this);
                }
                else {
                    (_c = info.dom) === null || _c === void 0 ? void 0 : _c.delete();
                    delete info.dom;
                }
            }
            this.topPaddingNode.domElement.style.height = `${topPadding}px`;
            this.bottomPaddingNode.domElement.style.height = `${bottomPadding}px`;
            this.bottomPaddingNode.appendTo(this);
        };
        this.calculateSize = () => {
            this.scrollAreaHeight = this.domElement.clientHeight;
            this.refresh();
        };
        this.resizeDebouncer = new debouncer_1.default(100, () => this.calculateSize());
        this.resizeHandler = () => this.resizeDebouncer.run();
        this.append(this.topPaddingNode = new DomNode_1.default(document.createElement(options.childTag)), this.bottomPaddingNode = new DomNode_1.default(document.createElement(options.childTag)));
        this.domElement.style.overflowY = "scroll";
        this.on("scroll", this.refresh);
        window.addEventListener("resize", this.resizeHandler);
    }
    init(nodeDataSet) {
        for (const data of nodeDataSet) {
            this.nodeDataSet.push({ data, height: this.options.baseChildHeight });
        }
    }
    add(data, index) {
        if (index !== undefined && index < this.nodeDataSet.length) {
            skyutil_1.default.insert(this.nodeDataSet, index, { data, height: this.options.baseChildHeight });
        }
        else {
            this.nodeDataSet.push({ data, height: this.options.baseChildHeight });
        }
        this.refresh();
    }
    findDataIndex(data) {
        return this.nodeDataSet.findIndex((d) => d.data === data);
    }
    remove(data) {
        const index = this.findDataIndex(data);
        if (index !== -1) {
            this.nodeDataSet.splice(index, 1);
            this.refresh();
        }
    }
    move(data, to) {
        var _a;
        const index = this.findDataIndex(data);
        if (index !== -1) {
            (_a = this.nodeDataSet[index].dom) === null || _a === void 0 ? void 0 : _a.delete();
            this.nodeDataSet.splice(index, 1);
            if (index < to) {
                to -= 1;
            }
        }
        if (to !== undefined && to < this.nodeDataSet.length) {
            skyutil_1.default.insert(this.nodeDataSet, to, { data, height: this.options.baseChildHeight });
        }
        else {
            this.nodeDataSet.push({ data, height: this.options.baseChildHeight });
        }
        this.refresh();
    }
    appendTo(node, index) {
        const that = super.appendTo(node, index);
        this.calculateSize();
        return that;
    }
    delete() {
        window.removeEventListener("resize", this.resizeHandler);
        super.delete();
    }
}
exports.default = ScrollableDomNode;
//# sourceMappingURL=ScrollableDomNode.js.map