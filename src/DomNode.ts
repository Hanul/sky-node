import SkyNode from "./SkyNode";

export default abstract class DomNode extends SkyNode {

    private domElement: HTMLElement | undefined;

    public delete() {
        this.domElement?.remove();
        super.delete();
    }
}