import {useEffect, useRef, useState} from 'react';
import {useCookies} from "react-cookie";
import Button from '@mui/material/Button';
import {CircularProgress, Divider, List, ListItem, ListItemIcon, ListItemText, TextField} from "@mui/material";
import ButtonAppBar from "../ButtonAppBar/ButtonAppBar.jsx";
import Notification from "../Notification/Notification.jsx";
import BasicCard from "../Card/BasicCard.jsx";
import Popup from "../Popup/Popup.jsx";
import {redirect, useParams} from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import * as React from "react";
import FaceIcon from '@mui/icons-material/Face';
import Roulette from "../Roulette/Roulette.jsx";

function Game() {
    const socket = useRef();
    const [games, setGames] = useState([]);
    const [game, setGame] = useState(null);
    const [connected, setConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({text: '', status: ''});
    const [player, setPlayer] = useState(null);
    const [playerNameInput, setPlayerNameInput] = useState('');
    const [gameIdInput, setGameIdInput] = useState('');
    const [isOpenNotification, setIsOpenNotification] = useState(false);
    const [popup, setPopup] = useState({onClose: ()=>{}, data: {}, open: false});
    const [cookies, setCookie, removeCookie] = useCookies(['player_name', 'player_id']);
    const [doRoll, setDoRoll] = useState(false);

    const params = useParams();

    useEffect(() => {
        connect();
        if(cookies.player_id) setPlayer({
            id: cookies.player_id,
            name: cookies.player_name ?? 'Без имени',
        });
    }, [])

    useEffect(() => {
        if(connected === true){
            setTimeout(() => {
                socket.current.send(JSON.stringify({
                    action: 'get_game_state',
                    game_id: params.gameId,
                }
                    )
                );
            }, 50)

        }
    }, [connected]);

    function setPlayerData(data){
        setCookie('player_name', data.name, {maxAge: 10000});
        setCookie('player_id', data.id, {maxAge: 10000});
        setPlayer({ id: data.id, name: data.name ?? 'Без имени'});
    }
    function removePlayerData(){
        removeCookie('player_name');
        removeCookie('player_id');
        setPlayer(null);
    }

    const joinGame = async (e) => {
        e.preventDefault();
        socket.current.send(JSON.stringify({action: 'join_player', game_id: params.gameId, player: {...player}}));
    }

    const onRoulettePressSpin = () => {
        socket.current.send(JSON.stringify({action: 'get_game_state', game_id: params.gameId, roll: true}));
    }
    function connect(){

        setIsLoading(true)

        //socket.current = new WebSocket("ws://80.90.189.247:3000/");
        socket.current = new WebSocket("ws://localhost:3000/");

        socket.current.onopen = function(e) {
            setConnected(true);
            setIsLoading(false);
            setNotification({
                text: `[open] Соединение установлено. Отправляем данные на сервер.`,
                status: 'success'
            });
            setIsOpenNotification(true);

        };

        socket.current.onmessage = function message(event) {
            const data = JSON.parse(event.data);
            switch (data.action) {
                case 'onGetGames': {
                    console.log(data.data, "GAMES!")
                    setGames(data.data);
                    break;
                }
                case 'notification': {
                    setNotification({
                        text: data.text,
                        status: 'error'
                    });
                    setIsOpenNotification(true);
                    break;
                }
                case 'onGameCreated': {
                    setPopup({
                        ...popup,
                        open: true,
                        data: {
                            title: data.text,
                            content: '',
                            gameId: data.id
                        }
                    })
                    break;
                }
                case 'onJoinGame': {

                    setPopup({
                        ...popup,
                        open: true,
                        data: {
                            title: data.text,
                            content: '',
                            gameId: data.id
                        }
                    })

                    socket.current.send(JSON.stringify({action: 'get_game_state', game_id: params.gameId}));
                    break;
                }
                case 'onGetGameState': {
                    if(data.status === 'failed') {
                        setPopup({
                            ...popup,
                            open: true,
                            data: {
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
                        })
                    }
                    if(data.status === 'success') {
                        setGame({
                            ...data.state,
                        })
                        setDoRoll(data.state.doRoll);
                    }

                    break;
                }

                default: {return;}
            }

        };
        socket.current.onclose = function(event) {
            if (event.wasClean) {
                setNotification({
                    text: `[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`,
                    status: 'success'
                });
                setIsOpenNotification(true);
            } else {
                setNotification({
                    text: `[close] Соединение прервано`,
                    status: 'error'
                });
                setIsOpenNotification(true);

            }
        };

        socket.current.onerror = function(error) {
            setNotification({
                text: `[error]`,
                status: 'error'
            });
            setIsOpenNotification(true);
        };
    }

    return (
        <>
            <ButtonAppBar
                buttonText={player ? 'Выйти' : 'Войти'}
                buttonHandler={player ? removePlayerData : ()=>{console.log('redirect');} }
                games={games}
            />
            <Notification
                text={notification.text}
                status={notification.status}
                onClose={(event, reason) => {
                    if (reason === 'clickaway') {
                        return;
                    }
                    setIsOpenNotification(false)
                }}
                isOpen={isOpenNotification}
            />

            <Popup onClose={()=>setPopup({...popup, open: false})} data={popup.data} open={popup.open} />

            <main>


                <div className={'gameWrapper'}>

                    {
                        ( game && player && game.players.find(p => p.id === player.id) )

                            ?
                            <>

                                {(game.status === 'finished') && <BasicCard name={'Игра ' + game.id} id={'Завершена'} />}
                                {(game.status === 'created')
                                    &&
                                    <>
                                        <div>
                                            {player && <BasicCard name={''} id={game.players[game.turn].name} />}
                                        </div>
                                        <BasicCard
                                            name={'Игра ' + game.id}
                                            id={`Ожидает, когда наберется ${game.players_count} игроков (сейчас ${game.players.length} из ${game.players_count})`}
                                            content={
                                                <List>{
                                                    (game.players.map((p) => {
                                                    return(
                                                        <ListItem key={p.id} disablePadding>
                                                            <ListItemButton>
                                                                <ListItemIcon>
                                                                    <FaceIcon/>
                                                                </ListItemIcon>
                                                                <ListItemText primary={p.name}/>
                                                            </ListItemButton>
                                                        </ListItem>
                                                    )
                                                    }))}
                                                </List>
                                            }
                                        />
                                    </>
                                }
                                {(game.status === 'in_process') &&
                                    <>
                                        <div>
                                            {player && <BasicCard name={''} id={'Ходит ' + game.players[game.turn].name} />}
                                        </div>

                                        <Roulette game={game} doRoll={game.doRoll ?? false} prizeNumber={game.prizeNumber ?? 0} handleSpinClick={onRoulettePressSpin} />
                                    </>
                                }
                            </>

                            :
                            <>
                                <>
                                    <h1>ИГРА {params.gameId}</h1>
                                    {player && <BasicCard name={player.name} id={'id: ' + player.id} />}
                                </>

                                {(!player)
                                ?
                                <form onSubmit={
                                    (e) => {
                                        e.preventDefault();
                                        setPlayerData({id: Math.random(), name: playerNameInput})
                                    }
                                }>

                                    <TextField
                                        sx={{width: '100%'}}
                                        required={true}
                                        onInput={(e) => setPlayerNameInput(e.target.value)}
                                        id="name-input"
                                        label="Ваше имя"
                                        variant="outlined"
                                        type="text"
                                        name={'name'}
                                        value={playerNameInput}
                                    />
                                    <br/>
                                    <br/>
                                    <Button sx={{width: '100%'}} type="submit" variant="contained">Войти</Button>
                                </form>

                                :

                                <div>
                                    <List component="nav" aria-label="mailbox folders">
                                        <ListItem sx={{justifyContent: 'center'}} divider>
                                            <div>
                                                <h4>Присоединиться к игре</h4>
                                                <form onSubmit={joinGame} action="">

                                                    <div>
                                                        <label htmlFor="">
                                                            <TextField
                                                                onInput={(e) => {
                                                                    setGameIdInput(e.target.value)
                                                                }}
                                                                required={true}
                                                                id={'name-input'}
                                                                label={'Id игры'}
                                                                variant={'outlined'}
                                                                type={'text'}
                                                                name={'game_id'}
                                                                value={params.gameId}
                                                                disabled={true}
                                                            />
                                                        </label>
                                                    </div>
                                                    <Button sx={{my: 2, width: '100%'}} type="submit"
                                                            variant="contained">Присоединиться</Button>
                                                </form>
                                            </div>
                                        </ListItem>
                                    </List>

                                </div>}
                            </>
                    }





                    {/*{connected ?*/}
                    {/*    games.map(g => <div key={g.id}>{g.id} - status: {g.status}</div>)*/}
                    {/*    :*/}
                    {/*    isLoading && <CircularProgress sx={{ m: 2 }} />*/}
                    {/*}*/}
                </div>
            </main>

        </>
    )
}

export default Game
