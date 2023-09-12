import {useState} from 'react';
import Button from '@mui/material/Button';
import {
    Divider, FormControl,
    InputLabel,
    List,
    ListItem,
    MenuItem,
    Select,
    TextField
} from "@mui/material";

import BasicCard from "../Card/BasicCard.jsx";
import {useSelector} from "react-redux";
import Login from "../Login/Login.jsx";

function StartPage (props) {
    const [gameIdInput, setGameIdInput] = useState('');
    const player = useSelector(state => state.player.player);


    const createGame = async (e) => {
        e.preventDefault();
        props.socket.current.send(JSON.stringify({action: 'create_game', game: {status: 'created', players: [player], players_count: 3}}));
    }

    const joinGame = async (e) => {
        e.preventDefault();
        props.socket.current.send(JSON.stringify({action: 'join_player', game_id: gameIdInput, player: {...player}}));
    }


    return (
        <>

            <main>

                <div>

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

                </div>
            </main>

        </>
    )
}

export default StartPage
