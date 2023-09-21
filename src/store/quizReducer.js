const defaultState = {
    quiz: {
        showQuestion: false,
        questionNumber: 1,
        result: '',
        answersStat: [],
    },
}

const SHOW_QUESTION = "SHOW_QUESTION";
const HIDE_QUESTION = "HIDE_QUESTION";
const SET_RESULT = "SET_RESULT";
const ADD_ANSWERS_STAT = "ADD_ANSWERS_STAT";
const CLEAR_ANSWERS_STAT = "CLEAR_ANSWERS_STAT";

export const quizReducer = (state = defaultState, action) => {

    switch (action.type) {
        case SHOW_QUESTION:
            return {...state, quiz: {...state.quiz, questionNumber: action.payload, showQuestion: true}}
        case HIDE_QUESTION:
            return {...state, quiz: {...state.quiz, showQuestion: false}}
        case SET_RESULT:
            return {...state, quiz: {...state.quiz, result: action.payload}}
        case ADD_ANSWERS_STAT:
            return {...state, quiz: {...state.quiz, answersStat: [...state.quiz.answersStat, action.payload]}}
        case CLEAR_ANSWERS_STAT:
            return {...state, quiz: {...state.quiz, answersStat: []}}
        default:
            return state;
    }
}

export const showQuestionAction = (payload = 1) => ({type: SHOW_QUESTION, payload});
export const hideQuestionAction = (payload) => ({type: HIDE_QUESTION, payload});
export const showQuestionResult = (payload) => ({type: SHOW_QUESTION, payload});
export const setAnswersStat = (payload) => ({type: ADD_ANSWERS_STAT, payload});
export const clearAnswersStat = (payload) => ({type: CLEAR_ANSWERS_STAT, payload});


