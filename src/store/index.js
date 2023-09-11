import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import {playerReducer} from "./playerReducer.js";

const reducer = combineReducers({
    player: playerReducer,
});
export const store = createStore(reducer, applyMiddleware(thunk));
