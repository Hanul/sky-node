import { EventHandler } from "eventcontainer";
import SkyNode from "./SkyNode";
export default class DomNode<T extends HTMLElement> extends SkyNode {
    protected domElement: T;
    protected children: DomNode<any>[];
    constructor(domElement: T);
    append(...nodes: DomNode<any>[]): void;
    appendTo(node: DomNode<any>, index: number): void;
    on(eventName: string, eventHandler: EventHandler): void;
    off(eventName: string, eventHandler: EventHandler): void;
    delete(): void;
}
//# sourceMappingURL=DomNode.d.ts.map