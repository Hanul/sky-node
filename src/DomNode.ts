import { EventHandler } from "eventcontainer";
import SkyNode from "./SkyNode";

export type Style = { [key: string]: string | number };

export default class DomNode<T extends HTMLElement> extends SkyNode {

    protected children: DomNode<any>[] = [];

    constructor(public domElement: T) {
        super();
    }

    public style(style: Style) {
        for (const [key, value] of Object.entries(style)) {
            if (typeof value === "number" && key !== "zIndex" && key !== "opacity") {
                (this.domElement.style as any)[key] = `${value}px`;
            } else {
                (this.domElement.style as any)[key] = value;
            }
        }
    }

    public on(eventName: string, eventHandler: EventHandler) {
        this.domElement.addEventListener(eventName, eventHandler);
        super.on(eventName, eventHandler);
    }

    public off(eventName: string, eventHandler: EventHandler) {
        this.domElement.removeEventListener(eventName, eventHandler);
        super.off(eventName, eventHandler);
    }

    public append(...nodes: DomNode<any>[]): void {
        super.append(...nodes);
        if (nodes.length === 1) {
            this.domElement.append(nodes[0].domElement);
        } else {
            const fragment = new DocumentFragment();
            for (const node of nodes) {
                fragment.append(node.domElement);
            }
            this.domElement.append(fragment);
        }
    }

    public appendTo(node: DomNode<any>, index: number): void {
        super.appendTo(node, index);
        if (index < this.children.length) {
            this.domElement.insertBefore(node.domElement, this.children[index].domElement);
        } else {
            this.domElement.append(node.domElement);
        }
    }

    public delete(): void {
        this.domElement.remove();
        super.delete();
    }
}