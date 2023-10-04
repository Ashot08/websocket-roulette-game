const defaultState = {
    game: null,
}

const SET_GAME = "SET_GAME";
const OFF_ROLL = "OFF_ROLL";
const OFF_QUIZ_TIMER = "OFF_QUIZ_TIMER";

export const gameReducer = (state = defaultState, action) => {

    switch (action.type) {
        case SET_GAME:
            return {...state, game: action.payload}
        case OFF_ROLL:
            return {...state, game: {...state.game, doRoll: false}}
        case OFF_QUIZ_TIMER:
            return {...state, game: {...state.game, quizTimer: false}}
        default:
            return state;
    }
}

export const setGameAction = (payload) => ({type: SET_GAME, payload});
export const offRollAction = (payload) => ({type: OFF_ROLL, payload});
export const offQuizTimerAction = (payload) => ({type: OFF_QUIZ_TIMER, payload});


