import { EventHandler } from "eventcontainer";
import SkyNode from "./SkyNode";

export type Style = { [key: string]: string | number };

export default class DomNode<EL extends HTMLElement> extends SkyNode {

    protected children: DomNode<HTMLElement>[] = [];

    constructor(public domElement: EL) {
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

    public appendText(text: string): void {
        this.domElement.append(text);
    }

    public appendTo(node: DomNode<HTMLElement>, index?: number): void {
        super.appendTo(node, index);
        if (index !== undefined && index < node.children.length) {
            node.domElement.insertBefore(this.domElement, node.children[index].domElement);
        } else {
            node.domElement.append(this.domElement);
        }
    }

    public delete(): void {
        this.domElement.remove();
        super.delete();
    }
}