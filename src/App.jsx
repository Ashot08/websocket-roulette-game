import './App.css';
import StartPage from "./components/StartPage/StartPage.jsx";
import {Route, Routes, useParams} from "react-router-dom";
import Game from "./components/Game/Game.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef} from "react";
import {getCookie} from "./utils/cookies.js";
import {setPlayerAction} from "./store/playerReducer.js";
import Notification from "./components/Notification/Notification.jsx";
import {hideNotificationAction, showNotificationAction} from "./store/notificationReducer.js";
import ButtonAppBar from "./components/ButtonAppBar/ButtonAppBar.jsx";
import {logout} from "./asyncActions/player.js";
import Popup from "./components/Popup/Popup.jsx";
import {hidePopupAction, showPopupAction} from "./store/popupReducer.js";
import {setGamesAction} from "./store/gamesReducer.js";
import {ListItem} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import * as React from "react";
import {setGameAction} from "./store/gameReducer.js";
import {connectAction, disconnectAction} from "./store/websocketReducer.js";

function App() {
    const socket = useRef();
    const dispatch = useDispatch();
    const player = useSelector(state => state.player.player);
    const notification = useSelector(state => state.notification.notification);
    const popup = useSelector(state => state.popup.popup);
    const games = useSelector(state => state.games.games);

    useEffect(() => {
        if(player) connect();
    }, [player]);

    useEffect(() => {
        if (!player && getCookie('player_id')) {

            const id = getCookie('player_id');
            const name = getCookie('player_name') ?? 'Без имени';

            dispatch(setPlayerAction({
                id,
                name,
            }))
        }

    }, []);


    function connect(){
        //socket.current = new WebSocket("ws://80.90.189.247:3000/");
        socket.current = new WebSocket("ws://localhost:3000/");

        socket.current.onopen = function(e) {

            dispatch(showNotificationAction({
                text: `[open] Соединение установлено. Отправляем данные на сервер.`,
                status: 'success'
            }));
            dispatch(connectAction());
        };

        socket.current.onmessage = function message(event) {
            const data = JSON.parse(event.data);
            switch (data.action) {
                case 'onGetGames': {
                    dispatch(setGamesAction(data.data));
                    break;
                }
                case 'notification': {
                    dispatch(showNotificationAction({
                        text: data.text,
                        status: 'error'
                    }));
                    break;
                }
                case 'onGameCreated': {
                    dispatch(showPopupAction({
                            title: data.text,
                            content: '',
                            gameId: data.id
                        }
                    ));
                    break;
                }
                case 'onJoinGame': {
                    if(data.status === 'success') {
                        console.log('JOIN')
                        socket.current.send(JSON.stringify({action: 'get_game_state', game_id: data.id}));
                    }
                    break;
                }
                case 'onGetGameState': {
                    if(data.status === 'failed') {
                        dispatch(showPopupAction({
                            title: data.text,
                            content: <ListItem disableGutters>
                                <ListItemButton sx={{justifyContent: 'center'}}
                                                autoFocus
                                >
                                    <a href="/">
                                        Создать новую игру
                                    </a>
                                </ListItemButton>
                            </ListItem>,
                            gameId: data.id
                            }
                        ));
                    }
                    if(data.status === 'success') {
                        dispatch(setGameAction({
                            ...data.state,
                            doRoll: data.doRoll,
                            nextTurn: data.nextTurn,
                            quizTimer: data.quizTimer,
                        }))
                    }

                    break;
                }

                default: {return;}
            }
        };
        socket.current.onclose = function(event) {
            if (event.wasClean) {
                dispatch(showNotificationAction({
                    text: `[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`,
                    status: 'success'
                }));
            } else {
                dispatch(showNotificationAction({
                    text: `[close] Соединение прервано`,
                    status: 'error'
                }));

            }
            dispatch(disconnectAction());
        };

        socket.current.onerror = function(error) {
            dispatch(showNotificationAction({
                text: `[error]`,
                status: 'error'
            }));
        };
    }

    return (
        <>
            <ButtonAppBar
                buttonText={player ? 'Выйти' : 'Войти'}
                buttonHandler={player ? () => dispatch(logout()) : ()=>{} }
                games={games}
            />
            <Notification
                text={notification?.text}
                status={notification?.status}
                onClose={(event, reason) => {
                    if (reason === 'clickaway') {
                        return;
                    }
                    dispatch(hideNotificationAction())
                }}
                isOpen={!!notification}
            />

            <Popup onClose={()=>dispatch(hidePopupAction())} data={popup} open={!!popup} />



            <Routes>
                <Route path='/' element={<StartPage socket={socket} />}/>
                <Route path='/game/:gameId?' element={<Game socket={socket} />} action={({params}) => {
                }}/>
            </Routes>
        </>
    )
}

export default App
