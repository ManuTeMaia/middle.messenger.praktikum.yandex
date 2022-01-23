import {connect} from "../../../store";
import Block from "../../../utils/Block";
import { SearchResults } from "./search-results";

export default connect((state: any) => ({
	search: state.user.search,
}), SearchResults as typeof Block);