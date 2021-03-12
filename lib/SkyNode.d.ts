import EventContainer from "eventcontainer";
export default abstract class SkyNode extends EventContainer {
    parent: SkyNode | undefined;
    protected children: SkyNode[];
    append(...nodes: SkyNode[]): void;
    appendTo(node: SkyNode, index?: number): void;
    delete(): void;
}
//# sourceMappingURL=SkyNode.d.ts.map