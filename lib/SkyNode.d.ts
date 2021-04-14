import EventContainer from "eventcontainer";
export default abstract class SkyNode extends EventContainer {
    parent: SkyNode | undefined;
    protected children: SkyNode[];
    append(...nodes: (SkyNode | undefined)[]): void;
    appendTo(node: SkyNode, index?: number): this;
    except(...nodes: SkyNode[]): void;
    exceptFromParent(): this;
    empty(): this;
    delete(): void;
}
//# sourceMappingURL=SkyNode.d.ts.map