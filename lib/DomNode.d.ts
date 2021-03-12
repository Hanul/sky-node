import { EventHandler } from "eventcontainer";
import SkyNode from "./SkyNode";
export declare type Style = {
    [key: string]: string | number;
};
export default class DomNode<EL extends HTMLElement> extends SkyNode {
    domElement: EL;
    protected children: DomNode<HTMLElement>[];
    constructor(domElement: EL);
    style(style: Style): void;
    on(eventName: string, eventHandler: EventHandler): void;
    off(eventName: string, eventHandler: EventHandler): void;
    appendText(text: string): void;
    appendTo(node: DomNode<HTMLElement>, index?: number): void;
    delete(): void;
}
//# sourceMappingURL=DomNode.d.ts.map