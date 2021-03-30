import DomNode from "./DomNode";
export interface ScrollableDomNodeOptions {
    childTag: string;
    baseChildHeight: number;
}
export declare abstract class ScrollItemDomNode<DT, EL extends HTMLElement = HTMLElement> extends DomNode<EL> {
    abstract get data(): DT;
}
export default abstract class ScrollableDomNode<DT, EL extends HTMLElement = HTMLElement> extends DomNode<EL> {
    private options;
    private createChild;
    private topPaddingNode;
    private bottomPaddingNode;
    private dataSet;
    private scrollAreaHeight;
    constructor(domElement: EL, dataSet: DT[], options: ScrollableDomNodeOptions, createChild: (data: DT) => ScrollItemDomNode<DT>);
    private refresh;
    private calculateSize;
    private resizeDebouncer;
    private resizeHandler;
    add(data: DT, index?: number): void;
    remove(data: DT): void;
    appendTo(node: DomNode, index?: number): this;
    delete(): void;
}
//# sourceMappingURL=ScrollableDomNode.d.ts.map