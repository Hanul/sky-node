import DomNode from "./DomNode";
import FloatingDomNode, { Position } from "./FloatingDomNode";
export default abstract class ClosableFloatingDomNode<EL extends HTMLElement> extends FloatingDomNode<EL> {
    private closeZone;
    constructor(position: Position, domElement: EL);
    private touchCloseZone;
    appendTo(node: DomNode<HTMLElement>, index?: number): void;
    delete(): void;
}
//# sourceMappingURL=ClosableFloatingDomNode.d.ts.map