import DomNode from "./DomNode";
import FloatingDomNode, { Position } from "./FloatingDomNode";
export default abstract class ClosableFloatingDomNode<EL extends HTMLElement = HTMLElement> extends FloatingDomNode<EL> {
    private closeZone;
    private deleteChildren;
    constructor(position: Position, domElement: EL | string);
    private touchCloseZone;
    private findAncestorOf;
    appendTo(node: DomNode, index?: number): this;
    appendToAncestorOf(node: DomNode): this | undefined;
    protected exceptFromParent(): void;
}
//# sourceMappingURL=ClosableFloatingDomNode.d.ts.map