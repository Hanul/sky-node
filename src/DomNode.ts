import { EventHandler } from "eventcontainer";
import SkyUtil from "skyutil";
import SkyNode from "./SkyNode";

export type Style = { [key: string]: string | number | undefined };
export type DomEventHandler<ET extends Event, DT extends DomNode> = (event: ET, domNode: DT) => any;

export default class DomNode<EL extends HTMLElement = HTMLElement> extends SkyNode {

    public static createElement<EL extends HTMLElement>(tag: string): EL {

        let id: string | undefined;
        const idIndex = tag.indexOf("#");
        if (idIndex !== -1) {
            id = tag.substring(idIndex + 1);
            tag = tag.substring(0, idIndex);

            const cindex = id.indexOf(".");
            if (cindex !== -1) {
                tag += id.substring(cindex);
                id = id.substring(0, cindex);
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
                key !== "order" &&
                key !== "zoom"
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

    public get innerScrollPosition(): { left: number, top: number } {

        let left = 0;
        let top = 0;

        if (this.domElement !== document.body) {
            let parent = this.domElement.parentNode;
            while (parent !== document.body && parent !== null) {
                if (parent instanceof HTMLElement) {
                    left += parent.scrollLeft;
                    top += parent.scrollTop;
                }
                parent = parent.parentNode;
            }
        }

        return { left, top };
    }

    public onDom<ET extends Event>(eventName: string, eventHandler: DomEventHandler<ET, this>): void {
        if (this.domEventMap[eventName] === undefined) {
            this.domEventMap[eventName] = [];
        }
        const domEventHandler = (event: ET) => eventHandler(event, this);
        this.domEventMap[eventName].push({ eventHandler, domEventHandler });
        this.domElement.addEventListener(eventName, domEventHandler as any);
    }

    public offDom<ET extends Event>(eventName: string, eventHandler: DomEventHandler<ET, this>): void {
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
    }

    public fireDomEvent(eventName: string, ...params: any[]): void {
        this.domElement.dispatchEvent(new Event(eventName));
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

    private checkVisible(): boolean {
        if (this.parent !== undefined) {
            if (this.parent.domElement === document.body) {
                return true;
            } else {
                return this.parent.checkVisible();
            }
        }
        return false;
    }

    private fireVisible() {
        this.fireEvent("visible");
        for (const child of this.children) {
            child.fireVisible();
        }
    }

    public appendTo(node: DomNode, index?: number): this {
        if (index !== undefined && index < node.children.length) {
            node.domElement.insertBefore(this.domElement, node.children[index].domElement);
        } else {
            node.domElement.append(this.domElement);
        }
        const that = super.appendTo(node, index);
        if (this.checkVisible() === true) {
            this.fireVisible();
        }
        return that;
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