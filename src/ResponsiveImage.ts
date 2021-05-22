import DomNode from "./DomNode";

export default class ResponsiveImage extends DomNode<HTMLImageElement> {

    constructor(tag: string, src: string) {
        super(tag);
        this.src = src;
    }

    public set src(src: string) {
        this.domElement.src = src;
        const path = src.substring(0, src.lastIndexOf(".png"));
        this.domElement.srcset = `${path}@2x.png 2x, ${path}@3x.png 3x`;
    }
}
