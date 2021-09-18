import Block from "../../utils/Block";
import template from "./headings.hbs";
import "./headings.pcss";

class Heading extends Block {
    constructor(props:Props) {
        super("div", props);
    }
    render():DocumentFragment {
        return this.compile(template, {...this.props});
    }

}
export default Heading;