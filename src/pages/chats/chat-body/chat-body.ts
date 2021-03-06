import Block from "../../../utils/Block";
import Validator from "../../../utils/Validator";
import Router from "../../../utils/Router";
import ChatWS, {MessageResponse} from "../../../api/chatWS";
import ChatController from "../../../controllers/chat";
import {isArray} from "../../../helpers/isArray";
import isEqual from "../../../helpers/isEqual";
import {UserData} from "../../../api/authAPI";
import {DeleteChatData} from "../../../api/chatAPI";
import {ChatProps} from "../../../components/modules/chat-list/chat-list";
import {InputWrapperType} from "../../../components/modules/input-wrapper/input-wrapper";
import "./chat-body.pcss";

interface ChatBodyProps {
	chat: ChatProps;
	user: UserData;
	messages: [];
	avatarSrc: string;
	formInputs: Partial<InputWrapperType>;
	onChatOptions: (e: Event) => void;
	onAddUser: (e: Event) => void;
	onDeleteUser: (e: Event) => void;
	onDeleteChat: (e: Event) => void;
	onMessageSend: (e: Event) => void;
	setAvatar: (e: Event) => void;
}

export class ChatBodyPage extends Block<ChatBodyProps> {

	constructor(props: ChatBodyProps) {
		super(props);
	}

	validator = new Validator();
	router = new Router();
	ws = new ChatWS();

	protected getStateFromProps(props: ChatBodyProps): void {
		const onBlur = (e: Event) => {
			this.validator.validate(<HTMLInputElement>e.currentTarget);
		};

		this.state = {
			avatarSrc: props.chat.avatar!==null ? `https://ya-praktikum.tech/api/v2/resources${props.chat.avatar}` : "/assets/noimage.png",
			formInputs:
				{
					name: "message",
					input:
						{
							inputName: "message",
							type: "text",
							placeholder: "Пишите...",
							inputClass: "message-input-form-input",
							validationType: "notnull",
							required: true,
							onChange: onBlur
						}
				},
			onChatOptions: (e: Event) => {
				e.preventDefault();
				document.querySelector(".chat-options")?.classList.toggle("hidden");
			},
			onAddUser: (e: Event) => {
				e.preventDefault();
				document.querySelector("[data-popup=addChatUser]")?.classList.toggle("hidden");
			},
			onDeleteUser: (e: Event) => {
				e.preventDefault();
				document.querySelector("[data-popup=deleteChatUser]")?.classList.toggle("hidden");
			},

			onDeleteChat: async (e: Event) => {
				e.preventDefault();
				const delConfirm = confirm("Вы действительно хотите удалить этот чат?");
				if (delConfirm) {
					const chatId = { chatId: props.chat.id } as DeleteChatData;
					this.router.go("/chats");
					await ChatController.deleteChat(chatId);
				}
			},

			onMessageSend: (e: Event) => {
				e.preventDefault();
				const newMessage = (this.refs.message.querySelector("input") as HTMLInputElement).value;
				if(newMessage) {
					this.ws.sendMessage(newMessage);
					this.onNewMassage(props);
					(this.refs.message.querySelector("input") as HTMLInputElement).value = "";

				}

			},

			setAvatar: (e: Event) => {
				e.preventDefault();
				const uploadChatAvatar = this.refs.uploadChatAvatar;
				uploadChatAvatar.classList.remove("hidden");
			}
		};
	}

	async componentDidMount(props: ChatBodyProps): Promise<void>  {
		await ChatController.setChat(props.chat.id);
		await this.onChatSetup(props);
	}

	componentDidUpdate(oldProps: ChatBodyProps, newProps: ChatBodyProps): boolean {
		return isEqual(oldProps, newProps);
	}

	onMessage = (response: MessageResponse): void => {
		ChatController.addMessage(response.content);
		const totalMessages = isArray(response.content) ? response.content.length : 1;
		this.ws?.increaseOffsetBy(totalMessages);
	}

	async onChatSetup(props: ChatBodyProps): Promise<void> {
		const response = await ChatController.getToken({ chatId: props.chat.id });
		if (response?.token) {
			this.ws.shutdown();
			const path = `/${props.user.id}/${props.chat.id}/${response.token}`;
			this.ws.setup(path, this.onMessage);
		}
	}

	async onNewMassage(props: ChatBodyProps): Promise<void> {
		const response = await ChatController.getToken({ chatId: props.chat.id });
		if (response?.token) {
			this.ws.shutdown();
			const path = `/${props.user.id}/${props.chat.id}/${response.token}`;
			this.ws.onceMessage(path, this.onMessage);
		}
	}

	render(): string {
		// language=hbs
		return `
		<div class="main--page-chat-body-wrap">
   			 <div class="main--page-chat-body-header">
		        <div class="main--page-chat-body-header-chatname">
			        {{{AvatarPopup popUpName="uploadChatAvatar" popUpTitle="Загрузить аватар" chatId=chat.id ref="uploadChatAvatar"}}}
		            {{{Avatar imageSrc=avatarSrc imageTitle=chat.title onClick=setAvatar}}}
		            {{{Heading text=chat.title}}}
		        </div>
               {{{Button type="button" buttonClass="main--page-chat-options" buttonIcon="ch-more" name="chat-options" title="" onClick=onChatOptions ref="menuButton"}}}
                 <div class="context-menu-wrapper chat-options hidden">
                     {{{Button type="button" buttonClass="main--page-user-add aslink" buttonIcon="ch-user-add" name="add-user" title="Добавить пользователя" onClick=onAddUser}}}
                     {{{Button type="button" buttonClass="main--page-user-add aslink" buttonIcon="ch-user-delete" name="delete-user" title="Удалить пользователя" onClick=onDeleteUser}}}
                     {{{Button type="button" buttonClass="main--page-delete-chat aslink" buttonIcon="ch-trash" name="delete-chat" title="Удалить чат" onClick=onDeleteChat}}}
                 </div>
                 {{{AddUserPopup chatId=chat.id  ref="addChatUser"}}}
                 {{{DeleteUserPopup chatId=chat.id ref="deleteChatUser"}}}
             </div>
			{{{Messages chatId=chat.id ref="messagesWrap"}}}
		    <div class="main--page-chat-body-footer">
		        <i class="ch-attach" title="Заглушка"></i>
		        <form action="" class="create-new-message-form" id="chatMessageForm">
		            {{{InputWrapper label=formInputs.label name=formInputs.name input=formInputs.input ref="message" }}}
		            {{{Button buttonClass="main--page-chat-send" buttonIcon="ch-send" name="send-submit" title="" onClick=onMessageSend}}}
		        </form>
		    </div>
		</div>
		`;
	}
}