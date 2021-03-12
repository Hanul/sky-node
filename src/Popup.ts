import DomNode from "./DomNode";

export default abstract class Popup<EL extends HTMLElement> extends DomNode<EL> {

    constructor(domElement: EL) {
        super(domElement);
        this.on("mousedown", (event: MouseEvent) => {
            event.stopPropagation();
        });
    }
}
