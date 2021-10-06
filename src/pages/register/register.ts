import Block from "../../utils/Block";
import Validator from "../../utils/Validator";
import Router from "../../utils/Router";
import submitEmulator from "../../helpers/formActions";
import InputWrapper from "../../modules/inputs-wrapper/inputs-wrapper";
import Button from "../../components/buttons/submit-button";
import Heading from "../../components/headings/headings";
import Link from "../../components/links/links";
import template from "./register.hbs";
import "./register.pcss";

class RegistrationPage extends Block {
	validator: Validator;
	router: Router;

	constructor() {
		super( {
			events: {
				submit: (e: Event) => submitEmulator(e, "/chats"),
			}
		});
		this.validator = new Validator();
		this.router = new Router();
	}

	validate(input: HTMLInputElement): void {
		return this.validator.validate(input);
	}

	render(): DocumentFragment {
		const heading = new Heading({
			text: "Регистрация"
		});
		const textInputs = [
			{
				label: "E-mail",
				type: "email",
				name: "email",
				placeholder: "email",
				validationType: "email",
				required: true,
				events: {
					blur: (e: Event) => this.validate((e.currentTarget as HTMLInputElement)),
				}
			},
			{
				label: "Логин",
				type: "text",
				name: "login",
				placeholder: "Имя пользователя",
				validationType: "login",
				required: true,
				events: {
					blur: (e: Event) => this.validate((e.currentTarget as HTMLInputElement)),
				}
			},
			{
				label: "Имя",
				type: "text",
				name: "first_name",
				placeholder: "Ваше имя",
				validationType: "name",
				required: true,
				events: {
					blur: (e: Event) => this.validate((e.currentTarget as HTMLInputElement)),
				}
			},
			{
				label: "Фамилия",
				type: "text",
				name: "second_name",
				placeholder: "Ваша фамилия",
				validationType: "name",
				required: true,
				events: {
					blur: (e: Event) => this.validate((e.currentTarget as HTMLInputElement)),
				}
			},
			{
				label: "Телефон",
				type: "tel",
				name: "phone",
				placeholder: "+7 (000)-000-00-00",
				validationType: "phone",
				required: true,
				events: {
					blur: (e: Event) => this.validate((e.currentTarget as HTMLInputElement)),
				}
			},
			{
				label: "Пароль",
				type: "password",
				name: "password",
				placeholder: "***********",
				validationType: "password",
				required: true,
				events: {
					blur: (e: Event) => this.validate((e.currentTarget as HTMLInputElement)),
				}
			},
			{
				label: "Повторите пароль",
				type: "password",
				name: "repeat-password",
				placeholder: "***********",
				validationType: "password",
				required: true,
				events: {
					blur: (e: Event) => this.validate((e.currentTarget as HTMLInputElement)),
				}
			}
		].map(
			(textInput) => new InputWrapper(textInput)
		);
		
        const submit = new Button({
			class: "form--register-submit",
			name: "registration-submit",
			title: "Зарегистрироваться"
		});
		const link = new Link({
			url:"",
			class:"form--register-login-link",
			text:"Уже есть аккаунт",
			events: {
				click: (e: Event) => {
					e.preventDefault();
					this.router.go("/");
					}
				}
		});
		return this.compile(template, {
			heading,
			textInputs,
			submit,
			link
		});
    }
}

export default RegistrationPage;