import React, {useEffect, useState} from 'react';
import { Wheel } from 'react-custom-roulette';
import './Roulette.css';
import arrowImage from './img/arrow.svg';
import Popup from "../Popup/Popup.jsx";
import BasicCard from "../Card/BasicCard.jsx";
import {hidePopupAction, showPopupAction} from "../../store/popupReducer.js";
import {useDispatch, useSelector} from "react-redux";
import {offRollAction} from "../../store/gameReducer.js";
import {Quiz} from "../Quiz/Quiz.jsx";
import {ButtonGroup} from "@mui/material";
import Button from "@mui/material/Button";
import sound from './audio/volchok_sound.mp3';

const data = [
    {
        option: 'Групповой, летальный',
        optionSize: 2,
        // image: {
        //     uri: '/src/assets/logo.svg',
        // },
        style: {
            backgroundColor: '#660000',
            fontSize: 14,
            textColor: '#fff'
        },
        fullName: 'Групповой, летальный НС'
    },
    {
        option: 'Бонус',
        optionSize: 5,
        style: {
            backgroundColor: 'green',
            fontSize: 16,
            textColor: '#fff'
        },
        fullName: 'всё ок, бонус!'
    },
    {
        option: 'Тяжелый',
        optionSize: 4,
        style: {
            backgroundColor: '#c50000',
            fontSize: 16,
            textColor: '#fff'
        },
        fullName: 'Тяжелый НС'
    },
    {
        option: 'Микротравма',
        optionSize: 5,
        style: {
            backgroundColor: 'orange',
            fontSize: 16,
            textColor: '#333'
        },
        fullName: 'Микротравма'
    },
    {
        option: 'Летальный',
        optionSize: 3,
        style: {
            backgroundColor: '#660000',
            fontSize: 16,
            textColor: '#fff'
        },
        fullName: 'Летальный НС'
    },
    {
        option: 'Легкий',
        optionSize: 5,
        style: {
            backgroundColor: '#ffae42',
            fontSize: 16,
            textColor: '#333'
        },
        fullName: 'Легкий НС'
    },
    {
        option: 'Групповой',
        optionSize: 5,
        style: {
            backgroundColor: '#c50000',
            fontSize: 16,
            textColor: '#fff'
        },
        fullName: 'Групповой НС'
    },
    {
        option: 'Микротравма',
        optionSize: 5,
        style: {
            backgroundColor: 'orange',
            fontSize: 16,
            textColor: '#333'
        },
        fullName: 'Микротравма'
    },
]
export default (props) => {
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const dispatch = useDispatch();
    const player = useSelector(state => state.player.player);
    const game = useSelector(state => state.game.game);

    useEffect(() => {
        setPrizeNumber(props.prizeNumber);
        setMustSpin(props.doRoll);
        if(props.doRoll || props.game.nextTurn) {
            dispatch(hidePopupAction());
        }
    }, [props.doRoll, props.prizeNumber, props.game.nextTurn]);

    const onRoll = (e) => {
        //play();
        props.handleSpinClick();
    }
    // let audio = document.querySelector("#chatAudio");
    // function play() {
    //     audio.play()
    // }


    return (
        <>
            <BasicCard name={''} id={'Ходит ' + props.game.players[props.game.turn].name} />

            <div className="rouletteWrapper">
                <Wheel
                    mustStartSpinning={mustSpin}
                    prizeNumber={prizeNumber}
                    data={data}
                    innerRadius={8}
                    radiusLineWidth={1}
                    textDistance={55}
                    spinDuration={1.25}
                    pointerProps={{src: arrowImage}}
                    onStopSpinning={() => {
                        const turn = props.game.turn;
                        dispatch(showPopupAction({
                                title: '',
                                content: <BasicCard
                                    style={{textAlign: 'center'}}
                                    name={<div style={{textAlign: 'center'}}>
                                        Ход  <strong>{props.game.players[turn].name}</strong>
                                    </div>}
                                    id={`У ${props.game.players[turn].name} на предприятии ${data[prizeNumber].fullName}`} />,
                            }
                        ));
                        setMustSpin(false);
                        dispatch(offRollAction());
                    }}
                />
            </div>
            <div className="rouletteButtonWrapper">

                {/*<audio id="chatAudio">*/}
                {/*    <source src={sound} type="audio/mpeg"></source>*/}
                {/*</audio>*/}

                {
                    ( game.players[game.turn].id == player.id || game.moderator.id == player.id )
                    &&
                    <ButtonGroup className={'rouletteButtons'} variant="contained" aria-label="outlined primary button group">
                        <Button disabled={mustSpin} onClick={onRoll}>Крутить</Button>
                        <Button disabled={mustSpin} onClick={props.onNextPlayer}>Передать ход</Button>
                    </ButtonGroup>
                }


            </div>



        </>
    )
}
