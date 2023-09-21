import {useState} from 'react';
import Button from '@mui/material/Button';
import {
    Checkbox,
    Divider, FormControl, FormControlLabel,
    InputLabel,
    List,
    ListItem,
    MenuItem,
    Select,
    TextField
} from "@mui/material";

import BasicCard from "../Card/BasicCard.jsx";
import {useDispatch, useSelector} from "react-redux";
import Login from "../Login/Login.jsx";
import {showNotificationAction} from "../../store/notificationReducer.js";

function StartPage (props) {
    const [gameIdInput, setGameIdInput] = useState('');
    const player = useSelector(state => state.player.player);
    const [playersCount, setPlayersCount] = useState(3);
    const [gameTitle, setGameTitle] = useState('');
    const [moderatorMode, setModeratorMode] = useState(false);
    const dispatch = useDispatch();
    const createGame = async (e) => {
        e.preventDefault();

        if(!gameTitle) {
            dispatch(showNotificationAction({
                text: 'Поле "Название игры" является обязательным',
                status: 'error'
            }));
            return;
        }

        if(moderatorMode) {
            props.socket.current.send(JSON.stringify({
                action: 'create_game',
                game: {
                    title: gameTitle,
                    status: 'created',
                    players: [],
                    players_count: playersCount,
                    moderator: player,
                }
            }));
        } else {
            props.socket.current.send(JSON.stringify({
                action: 'create_game',
                game: {
                    title: gameTitle,
                    status: 'created',
                    players: [player],
                    players_count: playersCount,
                    moderator: player,
                }
            }));
        }

    }

    const joinGame = async (e) => {
        e.preventDefault();
        props.socket.current.send(JSON.stringify({action: 'join_player', game_id: gameIdInput, player: {...player}}));
    }


    return (
        <>

            <main>

                <div className={'page_wrapper'}>

                    {player && <BasicCard name={player.name} id={player.id} />}

                    {!player
                        ?
                        <Login />
                        :

                        <div>
                            <List component="nav" aria-label="mailbox folders">
                                <ListItem>
                                    <div>
                                        <TextField
                                            sx={{width: '100%'}}
                                            id="name-input"
                                            label="Добро пожаловать"
                                            variant="outlined"
                                            type="text"
                                            name={'name'}
                                            placeholder={'Добро пожаловать'}
                                            value={player.name}
                                            disabled={true}
                                        />
                                        <FormControl sx={{my: 2}} fullWidth>
                                            <TextField
                                                sx={{width: '100%'}}
                                                id="game-title-input"
                                                label={'Название игры'}
                                                variant="outlined"
                                                type="text"
                                                name={'game-title'}
                                                placeholder={'Введите название'}
                                                value={gameTitle}
                                                onChange={(e) => setGameTitle(e.target.value)}
                                                required={true}
                                            />
                                        </FormControl>
                                        <FormControl sx={{my: 2}} fullWidth>
                                            <InputLabel id="demo-simple-select-label">Количество игроков</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={playersCount}
                                                label="Количество игроков"
                                                onChange={(e)=>{setPlayersCount(e.target.value)}}
                                            >
                                                <MenuItem value={2}>2</MenuItem>
                                                <MenuItem value={3}>3</MenuItem>
                                                <MenuItem value={4}>4</MenuItem>
                                                <MenuItem value={5}>5</MenuItem>
                                                <MenuItem value={6}>6</MenuItem>
                                            </Select>
                                            <FormControlLabel onChange={() => setModeratorMode(!moderatorMode)} control={<Checkbox checked={moderatorMode} />} label="Модератор" />
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

                </div>
            </main>

        </>
    )
}

export default StartPage
