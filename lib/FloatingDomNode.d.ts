import DomNode from "./DomNode";
export interface Position {
    left: number;
    top: number;
}
export default abstract class FloatingDomNode<EL extends HTMLElement> extends DomNode<EL> {
    private position;
    constructor(position: Position, domElement: EL);
    putInsideWindow(): void;
}
//# sourceMappingURL=FloatingDomNode.d.ts.map