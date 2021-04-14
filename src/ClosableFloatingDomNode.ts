import BodyNode from "./BodyNode";
import DomNode from "./DomNode";
import FloatingDomNode, { Position } from "./FloatingDomNode";
import Popup from "./Popup";
import SkyNode from "./SkyNode";

export default abstract class ClosableFloatingDomNode<EL extends HTMLElement = HTMLElement> extends FloatingDomNode<EL> {

    private closeZone: SkyNode | undefined;

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
        this.on("mousedown", (event: MouseEvent) => {
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
            // 부모를 타고 검색하여 Body 혹은 Popup를 찾아, 그것을 클릭하면 닫히도록
            let ancestor: SkyNode | undefined = this.parent;
            while (ancestor !== undefined) {
                if (ancestor === BodyNode || ancestor instanceof Popup) {
                    this.closeZone = ancestor;
                    this.closeZone.on("mousedown", this.touchCloseZone);
                    break;
                }
                ancestor = ancestor.parent;
            }
        }
        return that;
    }

    public exceptFromParent(): this {
        const that = super.exceptFromParent();
        if (this.closeZone !== undefined && this.closeZone.deleted !== true) {
            this.closeZone.off("mousedown", this.touchCloseZone);
        }
        return that;
    }
}