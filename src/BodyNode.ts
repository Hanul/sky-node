import DomNode from "./DomNode";

class BodyNode extends DomNode<HTMLBodyElement> {

    constructor() {
        super(document.body as any);
    }
}

export default new BodyNode();
