const defaultState = {
    websocket: {
        isConnect: false
    },
}

const CONNECT = "CONNECT";
const DISCONNECT = "DISCONNECT";

export const websocketReducer = (state = defaultState, action) => {

    switch (action.type) {
        case CONNECT:
            return {...state, websocket: {...state.websocket, isConnect: true}}
        case DISCONNECT:
            return {...state, websocket: {...state.websocket, isConnect: false}}
        default:
            return state;
    }
}

export const connectAction = (payload) => ({type: CONNECT, payload});
export const disconnectAction = (payload) => ({type: DISCONNECT, payload});


