import DomNode from "./DomNode";

export interface Position {
    left: number;
    top: number;
}

export default abstract class FloatingDomNode<EL extends HTMLElement> extends DomNode<EL> {

    constructor(private position: Position, domElement: EL) {
        super(domElement);
        this.style({ left: position.left, top: position.top });
    }

    public putInsideWindow() {
        this.style({ left: this.position.left, top: this.position.top });
        const rect = this.domElement.getBoundingClientRect();
        if (rect.left + rect.width > window.innerWidth) {
            this.style({ left: window.innerWidth - rect.width });
        }
        if (rect.top + rect.height > window.innerHeight) {
            this.style({ top: window.innerHeight - rect.height });
        }
    }
}
