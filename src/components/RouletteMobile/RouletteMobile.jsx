import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

import RoulettePro from 'react-roulette-pro';
import 'react-roulette-pro/dist/index.css';

import reproductionArray from './utills/reproductionArray';
import getRandomIntInRange from './utills/getRandomIntInRange';

import sound from './sounds/rickroll.mp3';

import './App.css';
import groupLetalIcon from "../Roulette/img/icons/group_letal.png";
import bonusIcon from "../Roulette/img/icons/bonus.png";
import hardIcon from "../Roulette/img/icons/hard.png";
import microIcon from "../Roulette/img/icons/micro.png";
import letalIcon from "../Roulette/img/icons/letal.png";
import lightIcon from "../Roulette/img/icons/light.png";
import groupIcon from "../Roulette/img/icons/group.png";

//
// const prizes = [
//     {
//         id: 'a44c728d-8a0e-48ca-a963-3d5ce6dd41b0',
//         image: '/src/components/roulette2/images/1.png',
//         text: 'Летальный НС',
//     },
//     {
//         id: 'a44c728d-8a0e-48ca-a963-3d5ce6dd41b0',
//         image: '/src/components/roulette2/images/2.png',
//         text: 'Микротравма',
//     },
//     {
//         id: 'a44c728d-8a0e-48ca-a963-3d5ce6dd41b0',
//         image: '/src/components/roulette2/images/3.png',
//         text: 'Тяжелый НС',
//     },
// ];

const prizes = [
    {
        option: 'Групповой, летальный',
        optionSize: 2,
        id: 1,
        text: 'Групповой, летальный НС',
        image: groupLetalIcon,
    },
    {
        option: 'Бонус',
        optionSize: 5,
        id: 2,
        text: 'Бонус!',
        image: bonusIcon,
    },
    {
        option: 'Тяжелый',
        optionSize: 4,
        id: 3,
        text: 'Тяжелый НС',
        image: hardIcon,
    },
    {
        option: 'Микротравма',
        optionSize: 5,
        id: 4,
        text: 'Микротравма',
        image: microIcon,
    },
    {
        option: 'Летальный',
        optionSize: 3,
        id: 5,
        text: 'Летальный НС',
        image: letalIcon,
    },
    {
        option: 'Легкий',
        optionSize: 5,
        id: 6,
        text: 'Легкий НС',
        image: lightIcon,
    },
    {
        option: 'Групповой',
        optionSize: 5,
        id: 7,
        text: 'Групповой НС',
        image: groupIcon,
    },
    {
        option: 'Микротравма',
        optionSize: 5,
        id: 8,
        text: 'Микротравма',
        image: microIcon,
    },
]

const getDesignOptions = (settings) => {
    const result = {};
    const keys = Object.keys(settings);

    keys.forEach((key) => {
        const { forDesign, value } = settings[key];

        if (!forDesign) {
            return;
        }

        result[key] = value;
    });

    return result;
};





const RouletteMobile = (props) => {
    const [settings, setSettings] = useState({
        type: {
            name: 'Тип',
            options: ['horizontal', 'vertical'],
            value: 'horizontal',
        },
        design: {
            name: 'Design',
            options: ['Regular'],
            value: 'Regular',
        },
        prizesWithText: {
            name: 'Prizes with text',
            options: [false, true],
            value: true,
        },
        withoutAnimation: {
            name: 'Without animation',
            options: [false, true],
            value: false,
        },
        hideCenterDelimiter: {
            name: 'Hide center delimiter',
            options: [false, true],
            value: false,
            forDesign: 'Regular',
        },
        soundWhileSpinning: {
            name: 'Sound while spinning',
            options: [false, true],
            value: false,
        },
        stopInCenter: {
            name: 'Stop in the prize item center',
            options: [false, true],
            value: false,
        },
        spinningTime: {
            name: 'Продолжительность вращения',
            options: ['3', '5', '10', '15', '20'],
            value: '3',
        },
    });

    const [prizeList, setPrizeList] = useState([]);
    const [start, setStart] = useState(false);
    const [prizeIndex, setPrizeIndex] = useState(0);

    const API = {
        getPrizeIndex: async () => {
            //const randomPrizeIndex = getRandomIntInRange(0, prizes.length - 1);
            const randomPrizeIndex = props.prizeNumber;

            const randomPrizeIndexOffset = prizes.length * 4;

            return randomPrizeIndex + randomPrizeIndexOffset;

        },
    };

    useEffect(() => {
        const reproducedArray = [
            ...prizes,
            ...reproductionArray(prizes, prizes.length * 3),
            ...prizes,
            ...reproductionArray(prizes, prizes.length),
        ];

        const list = [...reproducedArray].map((item) => ({
            ...item,
            id: `${item.id}--${nanoid()}`,
        }));

        setPrizeList(list);

    }, []);

    // useEffect(() => {
    //     if (!prizeIndex || start) {
    //         return;
    //     }
    //     setStart(props.mustSpin);
    // }, [props.mustSpin, props.prizeNumber]);

    useEffect(() => {
        if (!prizeList.length || !props.mustSpin) {
            return;
        }
        setStart(props.mustSpin);
        const prepare = async () => {
            const newPrizeIndex = await API.getPrizeIndex();
            setPrizeIndex(newPrizeIndex);

            const { id } = prizeList[newPrizeIndex];

            console.log({ icon: 'info', title: `Вращаем..` });
        };
        prepare();
    }, [props.prizeNumber, props.mustSpin]);


    const handlePrizeDefined = () => {
        props.onStopSpinning();
        setStart(false);
    }

    const type = settings.type.value;
    const design = settings.design.value;
    const soundWhileSpinning = settings.soundWhileSpinning.value;
    const stopInCenter = settings.stopInCenter.value;
    const withoutAnimation = settings.withoutAnimation.value;
    const prizesWithText = settings.prizesWithText.value;
    const hideCenterDelimiter = settings.hideCenterDelimiter.value;
    const spinningTime = +settings.spinningTime.value;
    const designOptions = getDesignOptions(settings);



    return (
        <div className={'mobileRoulette'}>
            <div className={`roulette ${type}`}>
                <RoulettePro
                    type={type}
                    prizes={prizeList}
                    // design={design}
                    designOptions={designOptions}
                    start={start}
                    prizeIndex={prizeIndex}
                    onPrizeDefined={handlePrizeDefined}
                    spinningTime={spinningTime}
                    classes={{
                        wrapper: 'roulette-pro-wrapper-additional-styles',
                    }}
                    soundWhileSpinning={soundWhileSpinning ? sound : null}
                    options={{ stopInCenter, withoutAnimation }}
                    defaultDesignOptions={{ prizesWithText, hideCenterDelimiter }}
                />
            </div>


        </div>
    );
};

export default RouletteMobile;
