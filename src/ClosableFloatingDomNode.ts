import DomNode from "./DomNode";
import FloatingDomNode, { Position } from "./FloatingDomNode";

export default abstract class ClosableFloatingDomNode<EL extends HTMLElement = HTMLElement> extends FloatingDomNode<EL> {

    private closeZone: DomNode | undefined;

    private deleteChildren(domNode: DomNode) {
        for (const child of domNode.children) {
            if (child instanceof ClosableFloatingDomNode) {
                child.delete();
            } else {
                this.deleteChildren(child);
            }
        }
    }

    constructor(position: Position, domElement: EL | string) {
        super(position, domElement);
        this.onDom("mousedown", (event: MouseEvent) => {
            this.deleteChildren(this);
            event.stopPropagation();
        });
    }

    private touchCloseZone = () => {
        this.delete();
    };

    public appendTo(node: DomNode, index?: number): this {
        const that = super.appendTo(node, index);
        if ((node instanceof ClosableFloatingDomNode) !== true) {
            const ancestor: DomNode | undefined = this.findAncestorOf(this);
            if (ancestor !== undefined) {
                this.closeZone = ancestor;
                this.closeZone.onDom("mousedown", this.touchCloseZone);
            }
        }
        return that;
    }

    protected exceptFromParent(): void {
        if (this.closeZone !== undefined && this.closeZone.deleted !== true) {
            this.closeZone.offDom("mousedown", this.touchCloseZone);
        }
        super.exceptFromParent();
    }
}
