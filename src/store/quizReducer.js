const defaultState = {
    quiz: {
        showQuestion: false,
        questionNumber: 1,
        result: '',
    },
}

const SHOW_QUESTION = "SHOW_QUESTION";
const HIDE_QUESTION = "HIDE_QUESTION";
const SET_RESULT = "SET_RESULT";

export const quizReducer = (state = defaultState, action) => {

    switch (action.type) {
        case SHOW_QUESTION:
            return {...state, quiz: {...state.quiz, questionNumber: action.payload, showQuestion: true}}
        case HIDE_QUESTION:
            return {...state, quiz: {...state.quiz, showQuestion: false}}
        case SET_RESULT:
            return {...state, quiz: {...state.quiz, result: action.payload}}
        default:
            return state;
    }
}

export const showQuestionAction = (payload = 1) => ({type: SHOW_QUESTION, payload});
export const hideQuestionAction = (payload) => ({type: HIDE_QUESTION, payload});
export const showQuestionResult = (payload) => ({type: SHOW_QUESTION, payload});


