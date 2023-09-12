import {logoutPlayerAction, setPlayerAction} from "../store/playerReducer.js";
import {deleteCookie, setCookie} from "../utils/cookies.js";



export const login = (player) => {
    return (dispatch) => {
            setCookie('player_name', player.name, {'max-age': 10000});
            setCookie('player_id', player.id, {'max-age': 10000});
            dispatch(setPlayerAction({ id: player.id, name: player.name ?? 'Без имени'}));
    }
}

export const logout = () => {
    return (dispatch) => {
        deleteCookie('player_name');
        deleteCookie('player_id');
        dispatch(logoutPlayerAction());
    };
}

