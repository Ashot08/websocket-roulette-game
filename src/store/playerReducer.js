const defaultState = {
    player: null,
}

const SET_PLAYER = "SET_PLAYER";
const LOGOUT_PLAYER = "LOGOUT_PLAYER";


export const playerReducer = (state = defaultState, action) => {

    switch (action.type) {
        case SET_PLAYER:
            return {...state, player: action.payload}
        case LOGOUT_PLAYER:
            return {...state, player: null}
        default:
            return state;
    }
}

export const setPlayerAction = (payload) => ({type: SET_PLAYER, payload});
export const logoutPlayerAction = (payload) => ({type: LOGOUT_PLAYER, payload});

