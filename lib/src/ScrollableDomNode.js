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
    constructor(domElement, dataSet, options, createChild) {
        super(domElement);
        this.dataSet = dataSet;
        this.options = options;
        this.createChild = createChild;
        this.childHeights = {};
        this.scrollAreaHeight = 0;
        this.refresh = () => {
            const startTop = this.domElement.scrollTop;
            const endTop = this.domElement.scrollTop + this.scrollAreaHeight;
            let topPadding = 0;
            let bottomPadding = 0;
            let startIndex = -1;
            let endIndex = -1;
            let top = 0;
            let appended = false;
            const first = this.children.find((c) => c instanceof ScrollItemDomNode);
            const last = this.children.reverse().find((c) => c instanceof ScrollItemDomNode);
            let firstIndex = -1;
            let lastIndex = -1;
            for (const [index, data] of this.dataSet.entries()) {
                if (data === (first === null || first === void 0 ? void 0 : first.data)) {
                    firstIndex = index;
                }
                if (data === (last === null || last === void 0 ? void 0 : last.data)) {
                    lastIndex = index;
                }
            }
            for (const [index, data] of this.dataSet.entries()) {
                let childHeight = this.childHeights[data.id];
                if (childHeight === undefined) {
                    childHeight = this.options.baseChildHeight;
                }
                if (top + childHeight < startTop) {
                    topPadding += childHeight;
                }
                else if (top > endTop) {
                    bottomPadding += childHeight;
                }
                else {
                    if (startIndex === -1) {
                        startIndex = index;
                    }
                    if (endIndex < index) {
                        endIndex = index;
                    }
                    if (this.children.find((c) => c instanceof ScrollItemDomNode && c.data === data) === undefined) {
                        const child = this.createChild(data);
                        if (lastIndex === -1 || index > lastIndex) {
                            child.appendTo(this);
                            lastIndex = index;
                        }
                        else {
                            child.appendTo(this, 1);
                        }
                        childHeight = child.domElement.getBoundingClientRect().height;
                        this.childHeights[data.id] = childHeight;
                        appended = true;
                    }
                }
                top += childHeight;
            }
            for (const [index, data] of this.dataSet.entries()) {
                if (index < startIndex || index > endIndex) {
                    const child = this.children.find((c) => c instanceof ScrollItemDomNode && c.data === data);
                    child === null || child === void 0 ? void 0 : child.delete();
                }
            }
            if (appended === true) {
                this.bottomPaddingNode.exceptFromParent();
                this.bottomPaddingNode.appendTo(this);
            }
            this.topPaddingNode.domElement.style.height = `${topPadding}px`;
            this.bottomPaddingNode.domElement.style.height = `${bottomPadding}px`;
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
    appendData(data, index) {
        if (index !== undefined && index < this.dataSet.length) {
            skyutil_1.default.insert(this.dataSet, index, data);
        }
        else {
            this.dataSet.push(data);
        }
        this.refresh();
    }
    deleteData(data) {
        skyutil_1.default.pull(this.dataSet, data);
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