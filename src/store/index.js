import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import {playerReducer} from "./playerReducer.js";
import {notificationReducer} from "./notificationReducer.js";
import {gamesReducer} from "./gamesReducer.js";
import {popupReducer} from "./popupReducer.js";
import {gameReducer} from "./gameReducer.js";

const reducer = combineReducers({
    player: playerReducer,
    notification: notificationReducer,
    games: gamesReducer,
    popup: popupReducer,
    game: gameReducer,
});
export const store = createStore(reducer, applyMiddleware(thunk));