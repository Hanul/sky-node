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
        private createChild: (nodeData: NDT, index: number) => ScrollItemDomNode<NDT>,
    ) {
        super(domElement);
        this.append(
            this.topPaddingNode = new DomNode(document.createElement(options.childTag)),
            this.bottomPaddingNode = new DomNode(document.createElement(options.childTag)),
        );
        this.domElement.style.overflowY = "scroll";
        this.on("visible", () => this.calculateSize());
        this.on("scroll", () => this.refresh());
        window.addEventListener("resize", this.resizeHandler);
    }

    public init(dataSet: NDT[]): void {
        for (const nodeData of this.nodeDataSet) {
            nodeData.dom?.delete();
        }
        this.nodeDataSet = [];
        for (const data of dataSet) {
            this.nodeDataSet.push({ data, height: this.options.baseChildHeight });
        }
    }

    private scrollStack: { top: number, length: number }[] = [];

    private refresh = () => {

        const scrollTop = this.domElement.scrollTop;
        if (this.scrollAreaHeight === 0 || (
            this.scrollStack.length === 2 &&
            this.scrollStack[0].top === scrollTop &&
            this.scrollStack[1].length === this.nodeDataSet.length
        )) {
            return;
        }

        this.scrollStack.push({ top: scrollTop, length: this.nodeDataSet.length });
        if (this.scrollStack.length > 2) {
            this.scrollStack.splice(0, 1);
        }

        const startTop = scrollTop;
        const endTop = scrollTop + this.scrollAreaHeight;

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
                    info.dom = this.createChild(info.data, index);
                    info.dom.appendTo(this);
                    info.height = info.dom.rect.height;
                }
            }
            top += info.height;
        }

        for (const [index, info] of this.nodeDataSet.entries()) {
            if (startIndex <= index && index <= endIndex) {
                info.dom?.appendTo(this);
            } else {
                info.dom?.delete(); delete info.dom;
            }
        }

        this.topPaddingNode.domElement.style.height = `${topPadding}px`;
        this.bottomPaddingNode.domElement.style.height = `${bottomPadding}px`;
        this.bottomPaddingNode.appendTo(this);
    };

    public calculateSize = () => {
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

    public findDataIndex(data: NDT): number {
        return this.nodeDataSet.findIndex((d) => d.data === data);
    }

    public remove(data: NDT): void {
        const index = this.findDataIndex(data);
        if (index !== -1) {
            this.nodeDataSet[index].dom?.delete();
            this.nodeDataSet.splice(index, 1);
            this.refresh();
        }
    }

    public move(data: NDT, to: number): void {
        const index = this.findDataIndex(data);
        if (index !== -1) {
            this.nodeDataSet[index].dom?.delete();
            this.nodeDataSet.splice(index, 1);
            if (index < to) { to -= 1; }
        }
        if (to !== undefined && to < this.nodeDataSet.length) {
            SkyUtil.insert(this.nodeDataSet, to, { data, height: this.options.baseChildHeight });
        } else {
            this.nodeDataSet.push({ data, height: this.options.baseChildHeight });
        }
        this.refresh();
    }

    public delete(): void {
        window.removeEventListener("resize", this.resizeHandler);
        super.delete();
    }
}
