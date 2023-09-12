const defaultState = {
    games: [],
}

const SET_GAMES = "SET_GAMES";

export const gamesReducer = (state = defaultState, action) => {

    switch (action.type) {
        case SET_GAMES:
            return {...state, games: action.payload}
        default:
            return state;
    }
}

export const setGamesAction = (payload) => ({type: SET_GAMES, payload});


