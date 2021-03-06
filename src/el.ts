import DomNode from "./DomNode";

const el = <EL extends HTMLElement>(tag: string, ...children: DomNode<HTMLElement>[]) => {

    let id: string | undefined;
    const idIndex = tag.indexOf("#");
    if (idIndex !== -1) {
        id = tag.substring(idIndex + 1);
        tag = tag.substring(0, idIndex);

        const cindex = id.indexOf(".");
        if (cindex !== -1) {
            id = id.substring(0, cindex);
            tag += id.substring(cindex);
        }
    }

    let className: string | undefined;
    const classNameIndex = tag.indexOf(".");
    if (classNameIndex !== -1) {
        className = tag.substring(classNameIndex + 1).replace(/\./g, " ");
        tag = tag.substring(0, classNameIndex);
    }

    if (tag === "") {
        tag = "div";
    }

    const element: EL = document.createElement(tag) as EL;
    if (id !== undefined) {
        element.id = id;
    }
    if (className !== undefined) {
        element.className = className;
    }

    const domNode = new DomNode<EL>(element);
    domNode.append(...children);
    return domNode;
}

export default el;
