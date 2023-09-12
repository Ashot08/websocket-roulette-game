import {useState} from 'react';
import Button from '@mui/material/Button';
import {TextField} from "@mui/material";
import {login} from "../../asyncActions/player.js";
import {useDispatch} from "react-redux";


function Login () {
    const dispatch = useDispatch();
    const [playerNameInput, setPlayerNameInput] = useState('');

    function setPlayerData(data){
        dispatch(login(data));
    }

    return (
        <>

            <form onSubmit={
                (e) => {
                    e.preventDefault();
                    setPlayerData({id: Math.random(), name: playerNameInput})
                }
            }>

                <TextField
                    sx={{width: '100%'}}
                    required={true}
                    onInput={(e) => setPlayerNameInput(e.target.value)}
                    id="name-input"
                    label="Ваше имя"
                    variant="outlined"
                    type="text"
                    name={'name'}
                    value={playerNameInput}
                />
                <br/>
                <br/>
                <Button sx={{width: '100%'}} type="submit" variant="contained">Войти</Button>
            </form>

        </>
    )
}

export default Login;
