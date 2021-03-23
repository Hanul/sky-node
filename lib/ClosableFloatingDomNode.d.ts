import DomNode from "./DomNode";
import FloatingDomNode, { Position } from "./FloatingDomNode";
export default abstract class ClosableFloatingDomNode<EL extends HTMLElement = HTMLElement> extends FloatingDomNode<EL> {
    private closeZone;
    private deleteChildren;
    constructor(position: Position, domElement: EL);
    private touchCloseZone;
    appendTo(node: DomNode, index?: number): this;
    exceptFromParent(): void;
}
//# sourceMappingURL=ClosableFloatingDomNode.d.ts.map