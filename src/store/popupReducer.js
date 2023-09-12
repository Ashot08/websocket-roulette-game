const defaultState = {
    popup: null,
}

const SHOW_POPUP = "SHOW_POPUP";
const HIDE_POPUP = "HIDE_POPUP";

export const popupReducer = (state = defaultState, action) => {

    switch (action.type) {
        case SHOW_POPUP:
            return {...state, popup: action.payload}
        case HIDE_POPUP:
            return {...state, popup: null}
        default:
            return state;
    }
}

export const showPopupAction = (payload) => ({type: SHOW_POPUP, payload});
export const hidePopupAction = (payload) => ({type: HIDE_POPUP, payload});


