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
import {hidePopupAction, showPopupAction} from "../../store/popupReducer.js";
import {Quiz} from "../Quiz/Quiz.jsx";
import CasinoIcon from '@mui/icons-material/Casino';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DangerousIcon from '@mui/icons-material/Dangerous';
import {clearAnswersStat} from "../../store/quizReducer.js";
import RouletteMobile from "../RouletteMobile/RouletteMobile.jsx";
import {mobileCheck} from "../../utils/mobileCheck.js";


function Game (props) {
    const dispatch = useDispatch();
    const params = useParams();
    const player = useSelector(state => state.player.player);
    const game = useSelector(state => state.game.game);
    const answersStat = useSelector(state => state.quiz.quiz.answersStat);
    const isWebsocketConnect = useSelector(state => state.websocket.websocket.isConnect);

    useEffect(() => {
        setTimeout(() => {
            if(isWebsocketConnect && props.socket.current){
                props.socket.current.send(JSON.stringify({
                            action: 'get_game_state',
                            game_id: params.gameId,
                        }
                    )
                );
            }
        }, 1)

    }, [props.socket.current, params.gameId]);

    useEffect(() => {
        if(props.socket.current) {
            onQuizAnswer();
        }
    }, [answersStat])

    const joinGame = async (e) => {
        e.preventDefault();
        props.socket.current.send(JSON.stringify({action: 'join_player', game_id: params.gameId, player: {...player}}));
    }

    const onRoulettePressSpin = () => {
        props.socket.current.send(JSON.stringify({action: 'get_game_state', game_id: params.gameId, roll: true}));
    }
    const onNextPlayer = () => {
        props.socket.current.send(JSON.stringify({action: 'get_game_state', game_id: params.gameId, nextTurn: true}));
        dispatch(clearAnswersStat());
    }
    const onGetQuestion = () => {
        props.socket.current.send(JSON.stringify({action: 'get_game_state', game_id: params.gameId, getQuestion: true, questionNumber: Math.floor(Math.random() * 180)}));
    }
    const onHideQuestion = () => {
        props.socket.current.send(JSON.stringify({action: 'get_game_state', game_id: params.gameId, getQuestion: false}));
    }
    const onQuizAnswer = () => {
        if(game) {
            if(game.players[game.turn].id == player.id) {
                props.socket.current.send(JSON.stringify({action: 'get_game_state', game_id: params.gameId, setAnswersStat: true, answersStat}));
            }
        }
    }
    const onGetGameLink = () => {
        dispatch(showPopupAction({
                title: 'Поделиться ссылкой',
                content: '',
                gameId: game.id
            }
        ));
    }

    return (
        <>

            <main>
                <div className={'gameWrapper'}>
                    {
                        (
                            game &&
                            player &&
                            (game.players.find(p => p.id == player.id || game.moderator.id == player.id) )
                        )
                            ?
                            <>
                                {(game.status === 'in_process') && <aside className={'game_state'}>
                                    <ul>
                                        {game.moderator.id == player.id && <li><strong>Режим модератора:</strong> ON</li>}
                                        <li><strong>Игрок:</strong> {player.name}</li>
                                        <li>
                                            <strong>Игра:</strong> {game.title} ({game.id})
                                            <button style={{marginLeft: 5}} onClick={onGetGameLink} >Ссылка на игру</button>
                                        </li>
                                        {/*<li><strong>Статус:</strong> {game.status}</li>*/}
                                        <li><strong>Следующее вращение:</strong> {game.players[game.turn].name}</li>
                                        {game.result && <li><strong>Результат предыдущего:</strong> {game.players[game.result.turn].name} - {game.result.prize}</li> }

                                        <li>
                                            <strong>Игроки:</strong>
                                            <ul className={'game_state_players'}>
                                                {game.players.map((p) => {
                                                    return (
                                                        <li key={'players' + p.id}>
                                                            {(game.players[game.turn].id == p.id) && <CasinoIcon sx={{ width: 15 }} /> }
                                                            {p.name}
                                                            {(game.players[game.turn].id == p.id) && game.answersStat.map( (a) => { return a ? <CheckCircleOutlineIcon sx={{color: 'green'}} /> : <DangerousIcon sx={{color: 'red'}} /> }) }
                                                        </li>
                                                    )
                                                })}
                                            </ul>

                                        </li>

                                    </ul>
                                    {
                                        ( game.players[game.turn].id == player.id || game.moderator.id == player.id )
                                        &&
                                        <div>
                                            {
                                                game.question.show
                                                ?
                                                    <button onClick={onHideQuestion} className={'button'}>Перейти к рулетке</button>
                                                :
                                                    <button onClick={onGetQuestion} className={'button'}>Взять вопрос</button>
                                            }
                                        </div>
                                    }

                                </aside>}

                                {(game.status === 'finished') && <BasicCard name={'Игра ' + game.title ? game.title : game.id } id={'Завершена'} />}
                                {(game.status === 'created')
                                    &&
                                    <div className={'game_desk game_desk_centered'}>
                                        <div>
                                            <div>
                                                {player && <BasicCard name={''} id={game.players[game.turn].name} />}
                                            </div>
                                            <BasicCard
                                                name={'Игра ' + game.title ? game.title : params.id }
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
                                            <br/>
                                            <button style={{marginLeft: 5}} onClick={onGetGameLink} >Ссылка на игру</button>
                                        </div>
                                    </div>
                                }
                                {(game.status === 'in_process') &&
                                    <>
                                        <div className={'game_desk'}>
                                            {
                                                game.question.show
                                                    ?
                                                    <Quiz quizTimer={game.quizTimer} isMyTurn={game.players[game.turn].name == player.name} onGetQuestion={onGetQuestion} />
                                                    :
                                                    <div>

                                                        <Roulette game={game} onNextPlayer={onNextPlayer} doRoll={game.doRoll ?? false} prizeNumber={game.prizeNumber ?? 0} handleSpinClick={onRoulettePressSpin} />

                                                    </div>
                                            }
                                        </div>

                                    </>
                                }
                            </>

                            :
                            <div className={'game_desk game_desk_centered'}>
                                <div>
                                    <>
                                        <h1>ИГРА {game && game.title}</h1>
                                        {player && <BasicCard name={player.name} id={'id: ' + player.id} />}
                                    </>

                                    {(!player)
                                        ?
                                        <div >
                                            <Login />
                                        </div>

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
                                </div>
                            </div>
                    }

                </div>
            </main>

        </>
    )
}

export default Game
