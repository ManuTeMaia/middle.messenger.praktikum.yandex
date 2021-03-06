import EventBus from "./EventBus";
import {Indexed} from "./Block";

export interface Action {
	type: string;
	payload?: any;
}

type Reducer<S = Indexed> = (state: S, action: Action) => S;

class Store extends EventBus {
	private state: Indexed = {};
	private readonly reducer: Reducer;

	constructor(reducers: Indexed) {
		super();

		this.reducer = this.combineReducers(reducers);

		this.dispatch({ type: "@@INIT" });
	}

	public dispatch(action: Action): void {
		this.state = this.reducer(this.state, action);

		this.emit("changed");
	}

	public getState(): Indexed {
		return this.state;
	}

	private combineReducers(reducers: Indexed): Reducer {
		return (_state, action: Action) => {
			const newState: Indexed = {};

			Object.entries(reducers).forEach(([key, reducer]) => {
				newState[key] = reducer(this.state[key], action);
			});

			return newState;
		};
	}
}

export default Store;