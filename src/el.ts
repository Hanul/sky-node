import DomNode, { Style } from "./DomNode";

type EventHandler<EV, EL extends HTMLElement> = (event: EV, domNode: DomNode<EL>) => void;

interface Attributes<EL extends HTMLElement> {
    [name: string]: Style | string | number | boolean | undefined | EventHandler<any, EL>;
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
                } else {
                    (domNode.domElement as any)[name] = value;
                }
            }
        }
    }
    return domNode;
}

export default el;
