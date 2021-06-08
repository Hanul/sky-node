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
    init(dataSet: NDT[]): void;
    private scrollStack;
    private refresh;
    calculateSize: () => void;
    private resizeDebouncer;
    private resizeHandler;
    add(data: NDT, index?: number): void;
    findDataIndex(data: NDT): number;
    remove(data: NDT): void;
    move(data: NDT, to: number): void;
    delete(): void;
}
//# sourceMappingURL=ScrollableDomNode.d.ts.map