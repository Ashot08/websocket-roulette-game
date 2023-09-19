import { quiz } from './quiz';
import {useDispatch, useSelector} from "react-redux";
import {ButtonGroup, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import Button from "@mui/material/Button";
import {showQuestionAction} from "../../store/quizReducer.js";
import './quiz.css';
import {useEffect, useState} from "react";
import {showNotificationAction} from "../../store/notificationReducer.js";

export const Quiz = (props) => {
    const dispatch = useDispatch();
    const questionNumber = useSelector(state => state.game.game.question.question);
    const [answer, setAnswer] = useState('');
    const [answerStatus, setAnswerStatus] = useState('in_process');

    const getQuestion = () => {
        setAnswer('');
        setAnswerStatus('in_process');
        props.onGetQuestion();
    }
    useEffect(() => {
        setAnswerStatus('in_process');
    }, [questionNumber]);

    const onSubmit = (e) => {
        e.preventDefault();
        const trueAnswer = quiz.questions[questionNumber].answers[ +quiz.questions[questionNumber]['correctAnswer'] - 1 ];

        if(!answer) {
            alert('Нужно выбрать ответ!');
            return;
        }

        if(answer == trueAnswer){
            setAnswerStatus('success');
            dispatch(showNotificationAction({
                text: `Вы ответили правильно!`,
                status: 'success'
            }))
        }else{
            dispatch(showNotificationAction({
                text: `Вы ошиблись!`,
                status: 'error'
            }))
            setAnswerStatus('failed');
        }
    }

    return <>
        <div className={'quiz'}>
            <div className={'variants'}>
                <form onSubmit={onSubmit}>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">{quiz.questions[questionNumber].question}</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue=""
                            name="radio-buttons-group"
                            onChange={(e) => setAnswer(e.target.value)}
                        >
                            {
                                quiz.questions[questionNumber].answers.map(a => <FormControlLabel key={questionNumber + a} value={a} control={<Radio />} label={a} /> )
                            }

                        </RadioGroup>
                    </FormControl>

                    {
                        <Button disabled={answerStatus !== 'in_process'} type={'submit'} variant={'contained'}>Ответить</Button>
                    }
                    {
                        (answerStatus == 'success')
                        &&
                        <div>
                            <h3>Верно!</h3>
                            {props.isMyTurn && <Button onClick={getQuestion} variant={'contained'}>Взять ещё один вопрос</Button>}
                        </div>

                    }
                    {
                        (answerStatus == 'failed')
                        &&
                        <div>
                            <h3>Ответ неверный!</h3>
                            {props.isMyTurn && <Button onClick={getQuestion} variant={'contained'}>Взять ещё один вопрос</Button>}
                        </div>

                    }
                </form>

            </div>
        </div>
    </>
}


function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
