import BodyNode from "./BodyNode";
import DomNode from "./DomNode";
import Popup from "./Popup";

export interface Position {
    left: number;
    top: number;
}

export default abstract class FloatingDomNode<EL extends HTMLElement = HTMLElement> extends DomNode<EL> {

    public static findAncestorOf(node: DomNode): DomNode | undefined {
        let ancestor: DomNode | undefined = node.parent;
        while (ancestor !== undefined) {
            if (ancestor === BodyNode || ancestor instanceof FloatingDomNode) {
                return ancestor;
            } else if (ancestor instanceof Popup) {
                return ancestor.content;
            }
            ancestor = ancestor.parent;
        }
    }

    constructor(private position: Position, domElement: EL | string) {
        super(domElement);
        this.style({ left: position.left, top: position.top });
    }

    public putInsideWindow(): void {
        this.style({ left: this.position.left, top: this.position.top });
        const rect = this.domElement.getBoundingClientRect();
        if (rect.left + rect.width > window.innerWidth) {
            this.style({ left: window.innerWidth - rect.width });
        }
        if (rect.top + rect.height > window.innerHeight) {
            this.style({ top: window.innerHeight - rect.height });
        }
    }

    public appendToAncestorOf(node: DomNode): this | undefined {
        const ancestor: DomNode | undefined = FloatingDomNode.findAncestorOf(node);
        if (ancestor !== undefined) {
            return this.appendTo(ancestor);
        }
    }

    public appendTo(node: DomNode, index?: number): this {
        const that = super.appendTo(node, index);
        this.putInsideWindow();
        return that;
    }
}
