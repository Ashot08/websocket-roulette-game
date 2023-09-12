import {useEffect, useRef, useState} from 'react';
import Button from '@mui/material/Button';
import {List, ListItem, ListItemIcon, ListItemText, TextField} from "@mui/material";
import BasicCard from "../Card/BasicCard.jsx";
import {useParams} from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import * as React from "react";
import FaceIcon from '@mui/icons-material/Face';
import Roulette from "../Roulette/Roulette.jsx";
import Login from "../Login/Login.jsx";
import {useDispatch, useSelector} from "react-redux";
import './game.css';
import {hidePopupAction} from "../../store/popupReducer.js";


function Game (props) {
    const params = useParams();
    const player = useSelector(state => state.player.player);
    const game = useSelector(state => state.game.game);

    useEffect(() => {
        if(props.socket.current){
            props.socket.current.send(JSON.stringify({
                        action: 'get_game_state',
                        game_id: params.gameId,
                    }
                )
            );
        }
    }, [props.socket.current, params.gameId]);


    const joinGame = async (e) => {
        e.preventDefault();
        props.socket.current.send(JSON.stringify({action: 'join_player', game_id: params.gameId, player: {...player}}));
    }

    const onRoulettePressSpin = () => {
        props.socket.current.send(JSON.stringify({action: 'get_game_state', game_id: params.gameId, roll: true}));
    }
    const onNextPlayer = () => {
        props.socket.current.send(JSON.stringify({action: 'get_game_state', game_id: params.gameId, nextTurn: true}));
    }

    return (
        <>

            <main>
                <div className={'gameWrapper'}>
                    {
                        ( game && player && game.players.find(p => p.id == player.id) )

                            ?
                            <>
                                <aside className={'game_state'}>
                                    <ul>
                                        <li>Игра: {game.id}</li>
                                        <li>Статус: {game.status}</li>
                                        <li>Следующий ход: {game.players[game.turn].name}</li>
                                        {game.result && <li>Результат: {game.players[game.result.turn].name} - {game.result.prize}</li> }

                                        <li>
                                            Игроки:
                                            <ul>
                                                {game.players.map(p => <li key={'players' + p.id}>{p.name}</li>)}
                                            </ul>

                                        </li>
                                    </ul>

                                </aside>

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
                                        <Roulette game={game} onNextPlayer={onNextPlayer} doRoll={game.doRoll ?? false} prizeNumber={game.prizeNumber ?? 0} handleSpinClick={onRoulettePressSpin} />
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

                                    <Login />

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

                </div>
            </main>

        </>
    )
}

export default Game
