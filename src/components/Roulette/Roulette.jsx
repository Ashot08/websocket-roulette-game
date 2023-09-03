import React, {useEffect, useState} from 'react';
import { Wheel } from 'react-custom-roulette';
import './Roulette.css';
import arrowImage from './img/arrow.svg';
import Notification from "../Notification/Notification.jsx";

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
        fullName: 'всё ок, вам бонус!'
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

    useEffect(() => {
        setPrizeNumber(props.prizeNumber);
        setMustSpin(props.doRoll);
        console.log(mustSpin, prizeNumber)
    }, [props.doRoll, props.prizeNumber]);

    // const handleSpinClick = () => {
    //     if (!mustSpin) {
    //         const newPrizeNumber = Math.floor(Math.random() * data.length);
    //         setPrizeNumber(newPrizeNumber);
    //         setMustSpin(true);
    //     }
    // }

    return (
        <>
            <div className="rouletteWrapper">
                <Wheel
                    mustStartSpinning={mustSpin}
                    prizeNumber={prizeNumber}
                    data={data}
                    innerRadius={8}
                    radiusLineWidth={1}
                    textDistance={55}
                    pointerProps={{src: arrowImage}}
                    onStopSpinning={() => {
                        alert(`На вашем предприятии ${data[prizeNumber].fullName}`)
                        setMustSpin(false);
                    }}
                />
            </div>
            <div className="rouletteButtonWrapper">
                <button onClick={props.handleSpinClick}>Крутить</button>
            </div>

        </>
    )
}
