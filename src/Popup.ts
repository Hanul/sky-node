import BodyNode from "./BodyNode";
import DomNode from "./DomNode";

export default abstract class Popup<EL extends HTMLElement = HTMLElement> extends DomNode<EL> {

    public abstract content: DomNode | undefined;

    constructor(domElement: EL | string) {
        super(domElement);
        this.on("mousedown", (event: MouseEvent) => {
            event.stopPropagation();
        });
        BodyNode.append(this);
    }
}
