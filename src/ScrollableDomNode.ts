import Debouncer from "@hanul/debouncer";
import SkyUtil from "skyutil";
import DomNode from "./DomNode";

export interface ScrollableDomNodeOptions {
    childTag: string;
    baseChildHeight: number;
}

export interface ScrollItemData {
    id: string;
}

export abstract class ScrollItemDomNode<DT extends ScrollItemData, EL extends HTMLElement = HTMLElement> extends DomNode<EL> {
    abstract get data(): DT;
}

export default abstract class ScrollableDomNode<DT extends ScrollItemData, EL extends HTMLElement = HTMLElement> extends DomNode<EL> {

    private topPaddingNode: DomNode;
    private bottomPaddingNode: DomNode;

    private childHeights: { [id: string]: number } = {};
    private scrollAreaHeight = 0;

    constructor(
        domElement: EL,
        private dataSet: DT[],
        private options: ScrollableDomNodeOptions,
        private createChild: (data: DT) => ScrollItemDomNode<DT>,
    ) {
        super(domElement);
        this.append(
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
        let appended = false;

        const first: ScrollItemDomNode<DT> | undefined = this.children.find((c) => c instanceof ScrollItemDomNode) as ScrollItemDomNode<DT>;
        const last: ScrollItemDomNode<DT> | undefined = this.children.reverse().find((c) => c instanceof ScrollItemDomNode) as ScrollItemDomNode<DT>;

        let firstIndex = -1;
        let lastIndex = -1;

        for (const [index, data] of this.dataSet.entries()) {
            if (data === first?.data) { firstIndex = index; }
            if (data === last?.data) { lastIndex = index; }
        }

        for (const [index, data] of this.dataSet.entries()) {
            let childHeight = this.childHeights[data.id];
            if (childHeight === undefined) {
                childHeight = this.options.baseChildHeight;
            }
            if (top + childHeight < startTop) {
                topPadding += childHeight;
            } else if (top > endTop) {
                bottomPadding += childHeight;
            } else {
                if (startIndex === -1) { startIndex = index; }
                if (endIndex < index) { endIndex = index; }

                if (this.children.find((c) => c instanceof ScrollItemDomNode && c.data === data) === undefined) {

                    const child = this.createChild(data);
                    if (lastIndex === -1 || index > lastIndex) {
                        child.appendTo(this);
                        lastIndex = index;
                    } else {
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
                child?.delete();
            }
        }

        if (appended === true) {
            this.bottomPaddingNode.exceptFromParent();
            this.bottomPaddingNode.appendTo(this);
        }

        this.topPaddingNode.domElement.style.height = `${topPadding}px`;
        this.bottomPaddingNode.domElement.style.height = `${bottomPadding}px`;
    };

    private calculateSize = () => {
        this.scrollAreaHeight = this.domElement.clientHeight;
        this.refresh();
    };

    private resizeDebouncer: Debouncer = new Debouncer(100, () => this.calculateSize());
    private resizeHandler = () => this.resizeDebouncer.run();

    public appendData(data: DT, index?: number): void {
        if (index !== undefined && index < this.dataSet.length) {
            SkyUtil.insert(this.dataSet, index, data);
        } else {
            this.dataSet.push(data);
        }
        this.refresh();
    }

    public deleteData(data: DT): void {
        SkyUtil.pull(this.dataSet, data);
        this.refresh();
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
