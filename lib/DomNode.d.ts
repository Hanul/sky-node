import { EventHandler } from "eventcontainer";
import SkyNode from "./SkyNode";
export declare type Style = {
    [key: string]: string | number;
};
export default class DomNode<T extends HTMLElement> extends SkyNode {
    domElement: T;
    protected children: DomNode<any>[];
    constructor(domElement: T);
    style(style: Style): void;
    on(eventName: string, eventHandler: EventHandler): void;
    off(eventName: string, eventHandler: EventHandler): void;
    append(...nodes: DomNode<any>[]): void;
    appendTo(node: DomNode<any>, index: number): void;
    delete(): void;
}
//# sourceMappingURL=DomNode.d.ts.map