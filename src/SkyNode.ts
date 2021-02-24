import EventContainer from "eventcontainer";
import SkyUtil from "skyutil";

export default abstract class SkyNode extends EventContainer {

    private parent: SkyNode | undefined;
    private children: SkyNode[] = [];

    public add(node: SkyNode, index?: number) {
        //TODO:
    }

    public delete() {
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