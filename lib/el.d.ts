import DomNode, { Style } from "./DomNode";
declare type EventHandler<EL, EV> = (event: EV, element: EL) => void;
interface Attributes<EL> {
    [name: string]: Style | string | undefined | EventHandler<EL, unknown>;
}
export declare type Child<EL extends HTMLElement> = Attributes<EL> | DomNode<EL> | string;
declare const el: <EL extends HTMLElement>(tag: string, ...children: Child<EL>[]) => DomNode<EL>;
export default el;
//# sourceMappingURL=el.d.ts.map