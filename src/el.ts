import DomNode, { Style } from "./DomNode";

type EventHandler<EL, EV> = (event: EV, element: EL) => void;

interface Attributes<EL> {
    [name: string]: Style | string | undefined | EventHandler<EL, unknown>;
}

export type Child<EL extends HTMLElement> = Attributes<EL> | DomNode<EL> | string;

const el = <EL extends HTMLElement>(tag: string, ...children: Child<EL>[]) => {
    const domNode = new DomNode<EL>(document.createElement(tag) as EL);
    for (const child of children) {
        if (typeof child === "string") {
            domNode.appendText(child);
        } else if (child instanceof DomNode) {
            domNode.append(child);
        } else {
            for (const [name, value] of Object.entries(child)) {
                if (typeof value === "function") {
                    domNode.on(name, value);
                } else if (name === "style" && typeof value === "object") {
                    domNode.style(value);
                }
            }
        }
    }
    return domNode;
}

export default el;
