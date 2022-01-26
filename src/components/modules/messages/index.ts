import {connect} from "../../../store";
import {Messages} from "./messages";
import Block from "../../../utils/Block";

export default connect((state: any) => ({
	chat: state.chats.chat,
	user: state.user.profile,
	chatUsers: state.chats.chatUsers,
}), Messages as typeof Block);