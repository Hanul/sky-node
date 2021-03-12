import EventContainer from "eventcontainer";
import SkyUtil from "skyutil";

export default abstract class SkyNode extends EventContainer {

    public parent: SkyNode | undefined;
    protected children: SkyNode[] = [];

    public append(...nodes: SkyNode[]): void {
        for (const node of nodes) {
            node.appendTo(this);
        }
    }

    public appendTo(node: SkyNode, index?: number): void {
        if (index !== undefined && index < node.children.length) {
            node.children.splice(index, 0, this);
        } else {
            node.children.push(this);
        }
        this.parent = node;
    }

    public delete(): void {
        super.delete();
        if (this.parent !== undefined) {
            SkyUtil.pull(this.parent.children, this);
        }
        for (const child of this.children) {
            child.delete();
        }
        (this.children as unknown) = undefined;
    }
}