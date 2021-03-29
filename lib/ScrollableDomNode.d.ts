import DomNode from "./DomNode";
export interface ScrollableDomNodeOptions {
    childTag: string;
    baseChildHeight: number;
}
export interface ScrollItemData {
    id: string;
}
export declare abstract class ScrollItemDomNode<DT extends ScrollItemData, EL extends HTMLElement = HTMLElement> extends DomNode<EL> {
    abstract get data(): DT;
}
export default abstract class ScrollableDomNode<DT extends ScrollItemData, EL extends HTMLElement = HTMLElement> extends DomNode<EL> {
    private dataSet;
    private options;
    private createChild;
    private topPaddingNode;
    private bottomPaddingNode;
    private childHeights;
    private scrollAreaHeight;
    constructor(domElement: EL, dataSet: DT[], options: ScrollableDomNodeOptions, createChild: (data: DT) => ScrollItemDomNode<DT>);
    private refresh;
    private calculateSize;
    private resizeDebouncer;
    private resizeHandler;
    appendData(data: DT, index?: number): void;
    deleteData(data: DT): void;
    appendTo(node: DomNode, index?: number): this;
    delete(): void;
}
//# sourceMappingURL=ScrollableDomNode.d.ts.map