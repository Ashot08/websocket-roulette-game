const defaultState = {
    notification: null,
}

const SHOW_NOTIFICATION = "SET_NOTIFICATION";
const HIDE_NOTIFICATION = "REMOVE_NOTIFICATION";


export const notificationReducer = (state = defaultState, action) => {

    switch (action.type) {
        case SHOW_NOTIFICATION:
            return {...state, notification: action.payload}
        case HIDE_NOTIFICATION:
            return {...state, notification: null}
        default:
            return state;
    }
}

export const showNotificationAction = (payload) => ({type: SHOW_NOTIFICATION, payload});
export const hideNotificationAction = (payload) => ({type: HIDE_NOTIFICATION, payload});

