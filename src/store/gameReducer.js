const defaultState = {
    game: null,
}

const SET_GAME = "SET_GAME";
const OFF_ROLL = "OFF_ROLL";

export const gameReducer = (state = defaultState, action) => {

    switch (action.type) {
        case SET_GAME:
            return {...state, game: action.payload}
        case OFF_ROLL:
            return {...state, game: {...state.game, doRoll: false}}
        default:
            return state;
    }
}

export const setGameAction = (payload) => ({type: SET_GAME, payload});
export const offRollAction = (payload) => ({type: OFF_ROLL, payload});


