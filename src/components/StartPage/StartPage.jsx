import {useEffect, useRef, useState} from 'react';
import {useCookies} from "react-cookie";
import Button from '@mui/material/Button';
import {
    CircularProgress,
    Divider, FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import ButtonAppBar from "../ButtonAppBar/ButtonAppBar.jsx";
import Notification from "../Notification/Notification.jsx";
import BasicCard from "../Card/BasicCard.jsx";
import Popup from "../Popup/Popup.jsx";

function StartPage() {
    const socket = useRef();
    const [games, setGames] = useState([]);
    const [connected, setConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({text: '', status: ''});
    const [player, setPlayer] = useState(null);
    const [playerNameInput, setPlayerNameInput] = useState('');
    const [gameIdInput, setGameIdInput] = useState('');
    const [isOpenNotification, setIsOpenNotification] = useState(false);
    const [popup, setPopup] = useState({onClose: ()=>{}, data: {}, open: false});
    const [cookies, setCookie, removeCookie] = useCookies(['player_name', 'player_id']);


    useEffect(() =>  {
        connect();
        if(cookies.player_id) setPlayer({
            id: cookies.player_id,
            name: cookies.player_name ?? 'Без имени',
        });
    }, [])

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
            setNotification({
                text: `[open] Соединение установлено. Отправляем данные на сервер.`,
                status: 'success'
            });
            setIsOpenNotification(true);
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
                    break;
                }
                default: {return;}
            }
            console.log(event.data)
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

            <Popup onClose={()=>setPopup({...popup, open: false})} data={popup.data} open={popup.open} />

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
                            <Button sx={{ width: '100%' }} type="submit" variant="contained">Войти</Button>
                        </form>
                        :

                        <div>
                            <List component="nav" aria-label="mailbox folders">
                                <ListItem>
                                    <div>
                                        <TextField
                                            sx={{width: '100%'}}
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
                                        <FormControl sx={{my: 2}} fullWidth>
                                            <InputLabel id="demo-simple-select-label">Количество игроков</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={3}
                                                label="Количество игроков"
                                                onChange={()=>{}}
                                            >
                                                <MenuItem value={2}>2</MenuItem>
                                                <MenuItem value={3}>3</MenuItem>
                                                <MenuItem value={4}>4</MenuItem>
                                                <MenuItem value={5}>5</MenuItem>
                                                <MenuItem value={6}>6</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <form onSubmit={createGame} action="">
                                            <Button sx={{ my: 2, width: '100%', textAlign: 'center' }} type="submit" variant="contained">Новая игра</Button>
                                        </form>
                                    </div>
                                </ListItem>
                                <Divider />
                                <ListItem sx={{width: '100%'}} divider>
                                    <div style={{width: '100%'}}>
                                        <h4>Присоединиться к игре</h4>
                                        <form onSubmit={joinGame} action="">

                                            <div>
                                                <label htmlFor="">
                                                    <TextField
                                                        sx={{width: "100%"}}
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

export default StartPage
