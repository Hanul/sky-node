import { EventHandler } from "eventcontainer";
import SkyNode from "./SkyNode";
export declare type Style = {
    [key: string]: string | number;
};
export default class DomNode<EL extends HTMLElement = HTMLElement> extends SkyNode {
    domElement: EL;
    parent: DomNode | undefined;
    children: DomNode[];
    private domEventMap;
    constructor(domElement: EL);
    style(style: Style): void;
    on(eventName: string, eventHandler: EventHandler): void;
    off(eventName: string, eventHandler: EventHandler): void;
    fireEvent(eventName: string, ...params: any[]): Promise<void>;
    appendText(text: string): void;
    appendTo(node: DomNode, index?: number): this;
    exceptFromParent(): void;
    empty(): this;
    delete(): void;
}
//# sourceMappingURL=DomNode.d.ts.map