import { EventHandler } from "eventcontainer";
import SkyUtil from "skyutil";
import SkyNode from "./SkyNode";

export type Style = { [key: string]: string | number | undefined };

export default class DomNode<EL extends HTMLElement = HTMLElement> extends SkyNode {

    public static createElement<EL extends HTMLElement>(tag: string): EL {

        let id: string | undefined;
        const idIndex = tag.indexOf("#");
        if (idIndex !== -1) {
            id = tag.substring(idIndex + 1);
            tag = tag.substring(0, idIndex);

            const cindex = id.indexOf(".");
            if (cindex !== -1) {
                id = id.substring(0, cindex);
                tag += id.substring(cindex);
            }
        }

        let className: string | undefined;
        const classNameIndex = tag.indexOf(".");
        if (classNameIndex !== -1) {
            className = tag.substring(classNameIndex + 1).replace(/\./g, " ");
            tag = tag.substring(0, classNameIndex);
        }

        if (tag === "") {
            tag = "div";
        }

        const element = document.createElement(tag) as EL;
        if (id !== undefined) {
            element.id = id;
        }
        if (className !== undefined) {
            element.className = className;
        }
        return element;
    }

    public parent: DomNode | undefined;
    public children: DomNode[] = [];

    private domEventMap: {
        [eventName: string]: {
            eventHandler: EventHandler,
            domEventHandler: EventHandler,
        }[],
    } = {};

    public domElement: EL;

    constructor(domElement: EL | string) {
        super();
        if (domElement instanceof HTMLElement) {
            this.domElement = domElement;
        } else {
            this.domElement = DomNode.createElement<EL>(domElement);
        }
    }

    public style(style: Style): void {
        for (const [key, value] of Object.entries(style)) {
            if (value === undefined) {
                this.domElement.style.removeProperty(key);
            } else if (
                typeof value === "number" &&
                key !== "zIndex" &&
                key !== "opacity" &&
                key !== "flexGrow" &&
                key !== "flexShrink" &&
                key !== "gridGap" &&
                key !== "order"
            ) {
                (this.domElement.style as any)[key] = `${value}px`;
            } else {
                (this.domElement.style as any)[key] = value;
            }
        }
    }

    public get rect(): DOMRect {
        return this.domElement.getBoundingClientRect();
    }

    public on(eventName: string, eventHandler: EventHandler): void {
        if (`on${eventName}` in this.domElement) {
            if (this.domEventMap[eventName] === undefined) {
                this.domEventMap[eventName] = [];
            }
            const domEventHandler = (event: Event) => eventHandler(event, this);
            this.domEventMap[eventName].push({ eventHandler, domEventHandler });
            this.domElement.addEventListener(eventName, domEventHandler);
        } else {
            super.on(eventName, eventHandler);
        }
    }

    public off(eventName: string, eventHandler: EventHandler): void {
        if (`on${eventName}` in this.domElement) {
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
        } else {
            super.off(eventName, eventHandler);
        }
    }

    public async fireEvent(eventName: string, ...params: any[]): Promise<void> {
        if (`on${eventName}` in this.domElement) {
            this.domElement.dispatchEvent(new Event(eventName));
        } else {
            await super.fireEvent(eventName, ...params);
        }
    }

    public appendText(text: string): void {
        const fragment = new DocumentFragment();
        const strs = text.split("\n");
        for (const [index, str] of strs.entries()) {
            if (index > 0) {
                fragment.append(document.createElement("br"));
            }
            fragment.append(str);
        }
        this.domElement.append(fragment);
    }

    public appendTo(node: DomNode, index?: number): this {
        if (index !== undefined && index < node.children.length) {
            node.domElement.insertBefore(this.domElement, node.children[index].domElement);
        } else {
            node.domElement.append(this.domElement);
        }
        return super.appendTo(node, index);
    }

    public empty(): this {
        super.empty();
        while (this.domElement.firstChild) {
            this.domElement.removeChild(this.domElement.firstChild);
        }
        return this;
    }

    public addClass(className: string): void { this.domElement.classList.add(className); }
    public deleteClass(className: string): void { this.domElement.classList.remove(className); }
    public checkClass(className: string): boolean { return this.domElement.classList.contains(className); }

    public delete(): void {
        this.domElement.remove();
        (this.domEventMap as unknown) = undefined;
        super.delete();
    }
}