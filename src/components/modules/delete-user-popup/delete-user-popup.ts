import Block from "../../../utils/Block";
import ChatController from "../../../controllers/chat";
import {getFormData} from "../../../helpers/formActions";
import {AddUsersData} from "../../../api/chatAPI";
import isEqual from "../../../helpers/isEqual";

export interface ChatUsersPopupProps {
	chatId: number;
	response: {error?: string, success?: string};
}

export class DeleteUserPopup extends Block<ChatUsersPopupProps> {
	constructor(props: ChatUsersPopupProps) {
		super(props);
	}

	protected getStateFromProps(props: ChatUsersPopupProps) {

		this.state = {
			formInputs: {
				label: "Поиск пользователя",
				name: "avatar",
				input: {
					type: "search",
					name: "user",
					class: "search-chat-user-form-input",
					placeholder: "Найти пользователя...",
					}
				},

			popupClose: (e: Event) => {
				e.preventDefault();
				document.querySelector("[data-popup=deleteChatUser]")?.classList.add("hidden");
			},

			chatUserAction: async (e: Event) => {
				e.preventDefault();
				const form = document.querySelector("#deleteChatUser");
				const fields = getFormData(form as HTMLFormElement);
				const users = Object.values(fields);
				const searchData = {chatId: props.chatId, users: users} as AddUsersData;
				await ChatController.deleteUsersFromChat(searchData);
				document.querySelector("[data-popup=deleteChatUser]")?.classList.remove("hidden");
			}
		};
	}

	componentDidMount(props: ChatUsersPopupProps | undefined): typeof props {
		if (props?.chatId) {
		const chatUsers = ChatController.getChatUsers({chatId: props.chatId as number});
		return {chatUsers, ...props} as ChatUsersPopupProps;
		}
	}

	componentDidUpdate(oldProps: ChatUsersPopupProps, newProps: ChatUsersPopupProps) {
		return isEqual(oldProps, newProps);
	}

	static getName(): string {
		return "DeleteUserPopup";
	}

	render(): string {
		//language=hbs
		return `
            <div class="popup hidden" data-popup="deleteChatUser">
                <div class="popup-overlay"></div>
                <div class="popup-wrapper">
                    {{{Button type="button" buttonIcon="ch-close" buttonClass="popup-close" onClick=popupClose}}}
                    <h4>Удалить пользователя</h4>
					<div class="popup-content">
                        <form id="deleteChatUser" action="" class="file-upload-form" enctype="multipart/form-data">
                            {{#each chatUsers}}
                                {{{Checkbox id=this.id name=this.login label=this.first_name}}}
                            {{/each}}
							{{{Button buttonClass="chat-user-actions-submit" name="delete-chat-user" title="Удалить" onClick=chatUserAction}}}
						</form>
                        {{#if response.error }}
                            <div class="input-error">{{response.error}}</div>
                        {{/if}}
                        {{#if response.success }}
                            <div class="input-success">{{response.success}}</div>
                        {{/if}}
					</div>
                </div>
            </div>
		`;
	}
}

