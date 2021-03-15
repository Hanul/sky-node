import { EventHandler } from "eventcontainer";
import SkyUtil from "skyutil";
import SkyNode from "./SkyNode";

export type Style = { [key: string]: string | number };

export default class DomNode<EL extends HTMLElement> extends SkyNode {

    public parent: DomNode<HTMLElement> | undefined;
    protected children: DomNode<HTMLElement>[] = [];

    private domEventMap: {
        [eventName: string]: {
            eventHandler: EventHandler,
            domEventHandler: EventHandler,
        }[],
    } = {};

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
        if (this.domEventMap[eventName] === undefined) {
            this.domEventMap[eventName] = [];
        }
        const domEventHandler = (event: Event) => eventHandler(event, this);
        this.domEventMap[eventName].push({ eventHandler, domEventHandler });
        this.domElement.addEventListener(eventName, domEventHandler);
        super.on(eventName, eventHandler);
    }

    public off(eventName: string, eventHandler: EventHandler) {
        const domEvents = this.domEventMap[eventName];
        if (domEvents !== undefined) {
            const domEvent = domEvents.find((de) => de.eventHandler === eventHandler);
            if (domEvent !== undefined) {
                this.domElement.removeEventListener(eventName, domEvent.domEventHandler);
                SkyUtil.pull(domEvents, domEvent);
                if (domEvents.length === 0) {
                    delete this.domEventMap[eventName];
                }
            }
        }
        super.off(eventName, eventHandler);
    }

    public appendText(text: string): void {
        this.domElement.append(text);
    }

    public appendTo(node: DomNode<HTMLElement>, index?: number): this {
        if (index !== undefined && index < node.children.length) {
            node.domElement.insertBefore(this.domElement, node.children[index].domElement);
        } else {
            node.domElement.append(this.domElement);
        }
        super.appendTo(node, index);
        return this;
    }

    public exceptFromParent(): void {
        if (this.parent !== undefined) {
            this.parent.domElement.removeChild(this.domElement);
        }
        super.exceptFromParent();
    }

    public delete(): void {
        (this.domEventMap as unknown) = undefined;
        super.delete();
    }
}