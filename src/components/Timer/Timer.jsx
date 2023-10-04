import React from 'react';
import { useTimer } from 'react-timer-hook';
import './timer.css';

function Timer({ expiryTimestamp, onExpire }) {
    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({ autoStart: true, expiryTimestamp, onExpire });

    setTimeout(() => {
        console.log(expiryTimestamp)
    }, 1000)


    return (
        <div className={'timer'}>

            {seconds}

        </div>
    );
}

export default Timer;
