const defaultState = {
    game: null,
}

const SET_GAME = "SET_GAME";

export const gameReducer = (state = defaultState, action) => {

    switch (action.type) {
        case SET_GAME:
            return {...state, game: action.payload}
        default:
            return state;
    }
}

export const setGameAction = (payload) => ({type: SET_GAME, payload});


