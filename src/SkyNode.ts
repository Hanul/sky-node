import EventContainer from "eventcontainer";
import SkyUtil from "skyutil";

export default abstract class SkyNode extends EventContainer {

    protected parent: SkyNode | undefined;
    protected children: SkyNode[] = [];

    public append(...nodes: SkyNode[]): void {
        for (const node of nodes) {
            this.children.push(node);
            node.parent = this;
        }
    }

    public appendTo(node: SkyNode, index: number): void {
        if (index < this.children.length) {
            this.children.splice(index, 0, node);
        } else {
            this.children.push(node);
        }
        node.parent = this;
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