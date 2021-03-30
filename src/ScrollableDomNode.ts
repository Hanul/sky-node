import SkyUtil from "skyutil";
import Debouncer from "../../debouncer/Debouncer";
import DomNode from "./DomNode";

export interface ScrollableDomNodeOptions {
    childTag: string;
    baseChildHeight: number;
}

export abstract class ScrollItemDomNode<DT, EL extends HTMLElement = HTMLElement> extends DomNode<EL> {
    abstract get data(): DT;
}

export default abstract class ScrollableDomNode<DT, EL extends HTMLElement = HTMLElement> extends DomNode<EL> {

    private topPaddingNode: DomNode;
    private bottomPaddingNode: DomNode;

    private dataSet: { data: DT, height: number, dom?: DomNode }[] = [];
    private scrollAreaHeight = 0;

    constructor(
        domElement: EL,
        dataSet: DT[],
        private options: ScrollableDomNodeOptions,
        private createChild: (data: DT) => ScrollItemDomNode<DT>,
    ) {
        super(domElement);
        for (const data of dataSet) {
            this.dataSet.push({ data, height: options.baseChildHeight });
        }
        super.append(
            this.topPaddingNode = new DomNode(document.createElement(options.childTag)),
            this.bottomPaddingNode = new DomNode(document.createElement(options.childTag)),
        );
        this.domElement.style.overflowY = "scroll";
        this.on("scroll", this.refresh);
        window.addEventListener("resize", this.resizeHandler);
    }

    private refresh = () => {
        const startTop = this.domElement.scrollTop;
        const endTop = this.domElement.scrollTop + this.scrollAreaHeight;

        let topPadding = 0;
        let bottomPadding = 0;

        let startIndex = -1;
        let endIndex = -1;

        let top = 0;
        for (const [index, info] of this.dataSet.entries()) {
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

        for (const [index, info] of this.dataSet.entries()) {
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

    public add(data: DT, index?: number): void {
        if (index !== undefined && index < this.dataSet.length) {
            SkyUtil.insert(this.dataSet, index, { data, height: this.options.baseChildHeight });
        } else {
            this.dataSet.push({ data, height: this.options.baseChildHeight });
        }
        this.refresh();
    }

    public remove(data: DT): void {
        const index = this.dataSet.findIndex((d) => d.data === data);
        if (index !== -1) {
            this.dataSet.splice(index, 1);
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
