import { API_URL } from "../common/global-consts";

export enum Method {
	Get = "Get",
	Post = "Post",
	Put = "Put",
	Patch = "Patch",
	Delete = "Delete"
}

type Options = {
	method: Method;
	data?: any;
	isFormData?: boolean;
};

class HTTPTransport {
	protected endpoint: string;
	static API_URL: string = API_URL;

	constructor(endpoint: string) {
		this.endpoint = `${HTTPTransport.API_URL}${endpoint}`;
	}

	public get<Response>(path = "/"): Promise<Response> {
		return this.request<Response>(this.endpoint + path);
	}

	public post<Response = void>(path: string, data?: unknown): Promise<Response> {
		return this.request<Response>(this.endpoint + path, {
			method: Method.Post,
			data,
		});
	}

	public put<Response = void>(path: string, data: unknown, isFormData = false): Promise<Response> {
		return this.request<Response>(this.endpoint + path, {
			method: Method.Put,
			data,
			isFormData
		});
	}

	public patch<Response = void>(path: string, data: unknown): Promise<Response> {
		return this.request<Response>(this.endpoint + path, {
			method: Method.Patch,
			data,
		});
	}

	public delete<Response>(path: string, data: unknown): Promise<Response> {
		return this.request<Response>(this.endpoint + path, {
			method: Method.Delete,
			data,
		});
	}

	private request<Response>(url: string, options: Options = {method: Method.Get}): Promise<Response> {
		const {method, data, isFormData} = options;

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open(method, url);

			xhr.onreadystatechange = () => {

				if (xhr.readyState === XMLHttpRequest.DONE) {
					if (xhr.status < 400) {
						resolve(xhr.response);
					} else {
						reject(xhr.response);
					}
				}
			};

			xhr.onabort = () => reject({reason: "abort"});
			xhr.onerror = () => reject({reason: "network error404"});
			xhr.ontimeout = () => reject({reason: "timeout"});
			if(!isFormData) {
				xhr.setRequestHeader("Content-Type", "application/json");
			}
			xhr.withCredentials = true;
			xhr.responseType = "json";

			if (method === Method.Get || !data) {
				xhr.send();
			} else {
				if (isFormData) {
					xhr.send(data);
				} else {
					xhr.send(JSON.stringify(data));
				}
			}
		});
	}
}

export default HTTPTransport;