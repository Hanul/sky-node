import DomNode from "./DomNode";
export interface Position {
    left: number;
    top: number;
}
export default abstract class FloatingDomNode<EL extends HTMLElement = HTMLElement> extends DomNode<EL> {
    private position;
    static findAncestorOf(node: DomNode): DomNode | undefined;
    constructor(position: Position, domElement: EL | string);
    putInsideWindow(): void;
    appendToAncestorOf(node: DomNode): this | undefined;
    appendTo(node: DomNode, index?: number): this;
}
//# sourceMappingURL=FloatingDomNode.d.ts.map