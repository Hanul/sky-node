import DomNode from "./DomNode";
export default abstract class Popup<EL extends HTMLElement = HTMLElement> extends DomNode<EL> {
    abstract content: DomNode | undefined;
    constructor(domElement: EL | string);
}
//# sourceMappingURL=Popup.d.ts.map