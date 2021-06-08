import SkyNode from "./SkyNode";
export declare type Style = {
    [key: string]: string | number | undefined;
};
export declare type DomEventHandler<ET extends Event, DT extends DomNode> = (event: ET, domNode: DT) => any;
export default class DomNode<EL extends HTMLElement = HTMLElement> extends SkyNode {
    static createElement<EL extends HTMLElement>(tag: string): EL;
    parent: DomNode | undefined;
    children: DomNode[];
    private domEventMap;
    domElement: EL;
    constructor(domElement: EL | string);
    style(style: Style): void;
    get rect(): DOMRect;
    get innerScrollPosition(): {
        left: number;
        top: number;
    };
    onDom<ET extends Event>(eventName: string, eventHandler: DomEventHandler<ET, this>): void;
    offDom<ET extends Event>(eventName: string, eventHandler: DomEventHandler<ET, this>): void;
    fireDomEvent(eventName: string, ...params: any[]): void;
    appendText(text: string): void;
    private checkVisible;
    private fireVisible;
    appendTo(node: DomNode, index?: number): this;
    empty(): this;
    addClass(className: string): void;
    deleteClass(className: string): void;
    checkClass(className: string): boolean;
    delete(): void;
}
//# sourceMappingURL=DomNode.d.ts.map