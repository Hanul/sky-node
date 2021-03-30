import Debouncer from "@hanul/debouncer";
import SkyUtil from "skyutil";
import DomNode from "./DomNode";

export interface ScrollableDomNodeOptions {
    childTag: string;
    baseChildHeight: number;
}

export abstract class ScrollItemDomNode<NDT, EL extends HTMLElement = HTMLElement> extends DomNode<EL> {
    abstract get nodeData(): NDT;
}

export default abstract class ScrollableDomNode<NDT, EL extends HTMLElement = HTMLElement> extends DomNode<EL> {

    private topPaddingNode: DomNode;
    private bottomPaddingNode: DomNode;

    private nodeDataSet: { data: NDT, height: number, dom?: DomNode }[] = [];
    private scrollAreaHeight = 0;

    constructor(
        domElement: EL,
        private options: ScrollableDomNodeOptions,
        private createChild: (nodeData: NDT) => ScrollItemDomNode<NDT>,
    ) {
        super(domElement);
        super.append(
            this.topPaddingNode = new DomNode(document.createElement(options.childTag)),
            this.bottomPaddingNode = new DomNode(document.createElement(options.childTag)),
        );
        this.domElement.style.overflowY = "scroll";
        this.on("scroll", this.refresh);
        window.addEventListener("resize", this.resizeHandler);
    }

    public init(nodeDataSet: NDT[]): void {
        for (const data of nodeDataSet) {
            this.nodeDataSet.push({ data, height: this.options.baseChildHeight });
        }
    }

    private refresh = () => {
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
            } else if (top > endTop) {
                bottomPadding += info.height;
            } else {
                if (startIndex === -1) { startIndex = index; }
                if (endIndex < index) { endIndex = index; }
                if (info.dom === undefined) {
                    info.dom = this.createChild(info.data);
                    info.dom.appendTo(this);
                    info.height = info.dom.domElement.getBoundingClientRect().height;
                }
            }
            top += info.height;
        }

        this.bottomPaddingNode.exceptFromParent();

        for (const [index, info] of this.nodeDataSet.entries()) {
            if (startIndex <= index && index <= endIndex) {
                info.dom?.exceptFromParent();
                info.dom?.appendTo(this);
            } else {
                info.dom?.delete(); delete info.dom;
            }
        }

        this.topPaddingNode.domElement.style.height = `${topPadding}px`;
        this.bottomPaddingNode.domElement.style.height = `${bottomPadding}px`;
        this.bottomPaddingNode.appendTo(this);
    };

    private calculateSize = () => {
        this.scrollAreaHeight = this.domElement.clientHeight;
        this.refresh();
    };

    private resizeDebouncer: Debouncer = new Debouncer(100, () => this.calculateSize());
    private resizeHandler = () => this.resizeDebouncer.run();

    public add(data: NDT, index?: number): void {
        if (index !== undefined && index < this.nodeDataSet.length) {
            SkyUtil.insert(this.nodeDataSet, index, { data, height: this.options.baseChildHeight });
        } else {
            this.nodeDataSet.push({ data, height: this.options.baseChildHeight });
        }
        this.refresh();
    }

    public remove(data: NDT): void {
        const index = this.nodeDataSet.findIndex((d) => d.data === data);
        if (index !== -1) {
            this.nodeDataSet.splice(index, 1);
            this.refresh();
        }
    }

    public appendTo(node: DomNode, index?: number): this {
        const that = super.appendTo(node, index);
        this.calculateSize();
        return that;
    }

    public delete(): void {
        window.removeEventListener("resize", this.resizeHandler);
        super.delete();
    }
}
