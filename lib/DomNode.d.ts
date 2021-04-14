import { EventHandler } from "eventcontainer";
import SkyNode from "./SkyNode";
export declare type Style = {
    [key: string]: string | number | undefined;
};
export default class DomNode<EL extends HTMLElement = HTMLElement> extends SkyNode {
    static createElement<EL extends HTMLElement>(tag: string): EL;
    parent: DomNode | undefined;
    children: DomNode[];
    private domEventMap;
    domElement: EL;
    constructor(domElement: EL | string);
    style(style: Style): void;
    get rect(): DOMRect;
    on(eventName: string, eventHandler: EventHandler): void;
    off(eventName: string, eventHandler: EventHandler): void;
    fireEvent(eventName: string, ...params: any[]): Promise<void>;
    appendText(text: string): void;
    appendTo(node: DomNode, index?: number): this;
    empty(): this;
    addClass(className: string): void;
    deleteClass(className: string): void;
    checkClass(className: string): boolean;
    delete(): void;
}
//# sourceMappingURL=DomNode.d.ts.map