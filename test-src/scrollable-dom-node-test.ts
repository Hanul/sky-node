import BodyNode from "../src/BodyNode";
import ScrollableDomNode, { ScrollItemDomNode } from "../src/ScrollableDomNode";

type DT = {
    id: string;
    name: string;
};

const dataSet: DT[] = [];
for (let i = 0; i < 100; i += 1) {
    dataSet.push({
        id: `id-${i}`,
        name: `Test ${i}`,
    });
}

class TestItem extends ScrollItemDomNode<DT> {
    public get data() { return this._data; }
    constructor(private _data: DT) {
        super(document.createElement("div"));
        this.appendText(_data.name);
    }
}

class TestNode extends ScrollableDomNode<DT> {
    constructor() {
        super(
            document.createElement("div"),
            dataSet,
            { childTag: "div", baseChildHeight: 24 },
            (data) => new TestItem(data) ,
        );
        this.style({
            position: "absolute",
            width: "100%",
            height: "100%",
        });
    }
}

BodyNode.append(new TestNode());
