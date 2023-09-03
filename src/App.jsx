import {useEffect, useRef, useState} from 'react';
import './App.css';
import {useCookies} from "react-cookie";
import Button from '@mui/material/Button';
import {CircularProgress, Divider, List, ListItem, ListItemText, TextField} from "@mui/material";
import ButtonAppBar from "./components/ButtonAppBar/ButtonAppBar.jsx";
import Notification from "./components/Notification/Notification.jsx";
import BasicCard from "./components/Card/BasicCard.jsx";

function App() {
    const socket = useRef();
    const [games, setGames] = useState([]);
    const [connected, setConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({text: '', status: ''});
    const [player, setPlayer] = useState(null);
    const [playerNameInput, setPlayerNameInput] = useState('');
    const [gameIdInput, setGameIdInput] = useState('');
    const [isOpenNotification, setIsOpenNotification] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['player_name', 'player_id']);


    useEffect(() =>  {
        connect();
        if(cookies.player_id) setPlayer({
            id: cookies.player_id,
            name: cookies.player_name ?? 'Без имени',
        });
    }, [])

    function setPlayerData(data){
        setCookie('player_name', data.name, {maxAge: 10});
        setCookie('player_id', data.id, {maxAge: 10});
        setPlayer({ id: data.id, name: data.name ?? 'Без имени'});
    }

    function removePlayerData(){
        setPlayer(null);
        removeCookie('player_name');
        removeCookie('player_id');
    }

    const createGame = async (e) => {
        e.preventDefault();
        socket.current.send(JSON.stringify({action: 'create_game', game: {status: 'created', players: [player], players_count: 3}}));
    }

    const joinGame = async (e) => {
        e.preventDefault();
        socket.current.send(JSON.stringify({action: 'join_player', game_id: gameIdInput, player: {...player}}));
    }

    function connect(){

        setIsLoading(true)

        socket.current = new WebSocket("ws://localhost:3000/");

        socket.current.onopen = function(e) {
            setConnected(true);
            setIsLoading(false);
            alert("[open] Соединение установлено");
            alert("Отправляем данные на сервер");
        };

        socket.current.onmessage = function message(event) {
            const data = JSON.parse(event.data);
            switch (data.action) {
                case 'notification': {
                    setNotification({
                        text: data.text,
                        status: 'error'
                    });
                    setIsOpenNotification(true);
                }
            }
            console.log(event.data)
        };
        socket.current.onclose = function(event) {
            if (event.wasClean) {
                alert(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
            } else {
                // например, сервер убил процесс или сеть недоступна
                // обычно в этом случае event.code 1006
                alert('[close] Соединение прервано');
            }
        };

        socket.current.onerror = function(error) {
            alert(`[error]`);
        };
    }

  return (
    <>
        <ButtonAppBar
            buttonText={player ? 'Выйти' : 'Войти'}
            buttonHandler={player ? removePlayerData : ()=>{} }
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
        <main>

            <div>



                {player && <BasicCard name={player.name} id={player.id} />}

                {!player
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
                        <Button sx={{ width: '100%' }} type="submit" variant="contained">Создать</Button>
                    </form>
                    :

                    <div>
                        <List component="nav" aria-label="mailbox folders">
                            <ListItem>
                                <div>
                                    <TextField
                                        onInput={(e) => setPlayerNameInput(e.target.value)}
                                        id="name-input"
                                        label="Добро пожаловать"
                                        variant="outlined"
                                        type="text"
                                        name={'name'}
                                        placeholder={'Добро пожаловать'}
                                        value={playerNameInput}
                                        disabled={true}
                                    />
                                    <form onSubmit={createGame} action="">
                                        <Button sx={{ my: 2, width: '100%', textAlign: 'center' }} type="submit" variant="contained">Новая игра</Button>
                                    </form>
                                </div>
                            </ListItem>
                            <Divider />
                            <ListItem divider>
                                <div>
                                    <h4>Присоединиться к игре</h4>
                                    <form onSubmit={joinGame} action="">

                                        <div>
                                            <label htmlFor="">
                                                <TextField
                                                    onInput={(e) => { setGameIdInput(e.target.value) }}
                                                    required={true}
                                                    id={'name-input'}
                                                    label={'Id игры'}
                                                    variant={'outlined'}
                                                    type={'text'}
                                                    name={'game_id'}
                                                />
                                            </label>
                                        </div>
                                        <Button sx={{ my: 2, width: '100%' }} type="submit" variant="contained">Присоединиться</Button>
                                    </form>
                                </div>
                            </ListItem>
                        </List>


                    </div>

                }

                {connected ?
                    games.map(g => <div key={g.id}>{g.id} - status: {g.status}</div>)
                    :
                    isLoading ? <CircularProgress sx={{ m: 2 }} /> : <button onClick={connect}>connect</button>
                }
            </div>
        </main>

    </>
  )
}

export default App
