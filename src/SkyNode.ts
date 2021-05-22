import EventContainer from "eventcontainer";
import SkyUtil from "skyutil";

export default abstract class SkyNode extends EventContainer {

    public parent: SkyNode | undefined;
    protected children: SkyNode[] = [];

    public append(...nodes: (SkyNode | undefined)[]): void {
        for (const node of nodes) {
            if (node !== undefined) {
                node.appendTo(this);
            }
        }
    }

    public appendTo(node: SkyNode, index?: number): this {
        if (this.parent === node && index !== undefined && this.parent.children.indexOf(this) < index) {
            index -= 1;
        }
        this.exceptFromParent();
        if (index !== undefined && index < node.children.length) {
            node.children.splice(index, 0, this);
        } else {
            node.children.push(this);
        }
        this.parent = node;
        return this;
    }

    protected exceptFromParent(): void {
        if (this.parent !== undefined) {
            SkyUtil.pull(this.parent.children, this);
            this.parent = undefined;
        }
    }

    public empty(): this {
        for (const child of this.children) {
            child.delete();
        }
        return this;
    }

    public checkChild(target: SkyNode): boolean {
        for (const child of this.children) {
            if (child === target || child.checkChild(target) === true) {
                return true;
            }
        }
        return false;
    }

    public delete(): void {
        super.delete();
        this.exceptFromParent();
        this.empty();
        (this.children as unknown) = undefined;
    }
}