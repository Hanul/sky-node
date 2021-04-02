import DomNode from "./DomNode";
export interface ScrollableDomNodeOptions {
    childTag: string;
    baseChildHeight: number;
}
export declare abstract class ScrollItemDomNode<NDT, EL extends HTMLElement = HTMLElement> extends DomNode<EL> {
    abstract get nodeData(): NDT;
}
export default abstract class ScrollableDomNode<NDT, EL extends HTMLElement = HTMLElement> extends DomNode<EL> {
    private options;
    private createChild;
    private topPaddingNode;
    private bottomPaddingNode;
    private nodeDataSet;
    private scrollAreaHeight;
    constructor(domElement: EL, options: ScrollableDomNodeOptions, createChild: (nodeData: NDT, index: number) => ScrollItemDomNode<NDT>);
    init(nodeDataSet: NDT[]): void;
    private refresh;
    private calculateSize;
    private resizeDebouncer;
    private resizeHandler;
    add(data: NDT, index?: number): void;
    findDataIndex(data: NDT): number;
    remove(data: NDT): void;
    move(data: NDT, to: number): void;
    appendTo(node: DomNode, index?: number): this;
    delete(): void;
}
//# sourceMappingURL=ScrollableDomNode.d.ts.map