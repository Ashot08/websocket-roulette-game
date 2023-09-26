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
import bonusIcon from './img/icons/bonus.png';
import microIcon from './img/icons/micro.png';
import lightIcon from './img/icons/light.png';
import hardIcon from './img/icons/hard.png';
import groupIcon from './img/icons/group.png';
import letalIcon from './img/icons/letal.png';
import groupLetalIcon from './img/icons/group_letal.png';
import {clearAnswersStat} from "../../store/quizReducer.js";
import {mobileCheck} from "../../utils/mobileCheck.js";
import RouletteMobile from "../RouletteMobile/RouletteMobile.jsx";

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
        fullName: 'Групповой, летальный НС',
        icon: groupLetalIcon,
    },
    {
        option: 'Бонус',
        optionSize: 5,
        style: {
            backgroundColor: 'green',
            fontSize: 16,
            textColor: '#fff'
        },
        fullName: 'Бонус!',
        icon: bonusIcon,
    },
    {
        option: 'Тяжелый',
        optionSize: 4,
        style: {
            backgroundColor: '#c50000',
            fontSize: 16,
            textColor: '#fff'
        },
        fullName: 'Тяжелый НС',
        icon: hardIcon,
    },
    {
        option: 'Микротравма',
        optionSize: 5,
        style: {
            backgroundColor: 'orange',
            fontSize: 16,
            textColor: '#333'
        },
        fullName: 'Микротравма',
        icon: microIcon,
    },
    {
        option: 'Летальный',
        optionSize: 3,
        style: {
            backgroundColor: '#660000',
            fontSize: 16,
            textColor: '#fff'
        },
        fullName: 'Летальный НС',
        icon: letalIcon,
    },
    {
        option: 'Легкий',
        optionSize: 5,
        style: {
            backgroundColor: '#ffae42',
            fontSize: 16,
            textColor: '#333'
        },
        fullName: 'Легкий НС',
        icon: lightIcon,
    },
    {
        option: 'Групповой',
        optionSize: 5,
        style: {
            backgroundColor: '#c50000',
            fontSize: 16,
            textColor: '#fff'
        },
        fullName: 'Групповой НС',
        icon: groupIcon,
    },
    {
        option: 'Микротравма',
        optionSize: 5,
        style: {
            backgroundColor: 'orange',
            fontSize: 16,
            textColor: '#333'
        },
        fullName: 'Микротравма',
        icon: microIcon,
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

    const onStopSpinning = () => {
        const turn = props.game.turn;
        dispatch(showPopupAction({
                title: <>
                    Ход  <strong>{props.game.players[turn].name}</strong>
                </>,
                content: <BasicCard
                    style={{textAlign: 'center'}}
                    name={''}
                    id={<div className={'roll_result_content'}>
                        <div>
                            <img src={data[prizeNumber].icon} alt={data[prizeNumber].fullName}/>
                        </div>
                        <div>
                            {data[prizeNumber].fullName}
                        </div>
                    </div>} />,
            }
        ));
        dispatch(clearAnswersStat());
        setMustSpin(false);
        dispatch(offRollAction());
    }

    // let audio = document.querySelector("#chatAudio");
    // function play() {
    //     audio.play()
    // }


    return (
        <>
            <BasicCard name={''} id={'Ходит ' + props.game.players[props.game.turn].name} />

            <div className="rouletteWrapper">

                {mobileCheck() ?
                    <RouletteMobile onStopSpinning={onStopSpinning} mustSpin={props.mustSpin} prizeNumber={props.prizeNumber} nextTurn={props.game.nextTurn}  />
                    :
                    <Wheel
                        mustStartSpinning={mustSpin}
                        prizeNumber={prizeNumber}
                        data={data}
                        innerRadius={8}
                        radiusLineWidth={1}
                        textDistance={55}
                        spinDuration={0.2}
                        pointerProps={{src: arrowImage}}
                        onStopSpinning={onStopSpinning}
                    />
                }


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
