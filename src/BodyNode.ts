import { DomNode } from ".";

class BodyNode extends DomNode<HTMLBodyElement> {

    constructor() {
        super(document.body as any);
    }
}

export default new BodyNode();
