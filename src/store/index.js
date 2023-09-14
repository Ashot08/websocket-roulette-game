import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import {playerReducer} from "./playerReducer.js";
import {notificationReducer} from "./notificationReducer.js";
import {gamesReducer} from "./gamesReducer.js";
import {popupReducer} from "./popupReducer.js";
import {gameReducer} from "./gameReducer.js";
import {websocketReducer} from "./websocketReducer.js";
import {quizReducer} from "./quizReducer.js";

const reducer = combineReducers({
    player: playerReducer,
    notification: notificationReducer,
    games: gamesReducer,
    popup: popupReducer,
    game: gameReducer,
    websocket: websocketReducer,
    quiz: quizReducer,
});
export const store = createStore(reducer, applyMiddleware(thunk));
