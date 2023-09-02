import {useEffect, useRef, useState} from 'react';
import './App.css';
import {useCookies} from "react-cookie";

function App() {
    const socket = useRef();
    const [games, setGames] = useState([]);
    const [connected, setConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [player, setPlayer] = useState(null);
    const [playerNameInput, setPlayerNameInput] = useState('');
    const [gameIdInput, setGameIdInput] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies(['player_name', 'player_id']);


    useEffect(() =>  {
        connect();
        if(cookies.player_id) setPlayer({
            id: cookies.player_id,
            name: cookies.player_name ?? 'Без имени',
        });
    }, [])

    function setPlayerData(data){
        setCookie('player_name', data.name, {maxAge: 10});
        setCookie('player_id', data.id, {maxAge: 10});
        setPlayer({ id: data.id, name: data.name ?? 'Без имени'});
    }

    const createGame = async (e) => {
        e.preventDefault();
        socket.current.send(JSON.stringify({action: 'create_game', game: {status: 'created', players: [player], players_count: 3}}));
    }

    const joinGame = async (e) => {
        e.preventDefault();
        socket.current.send(JSON.stringify({action: 'join_player', game_id: gameIdInput, player: {...player}}));
    }

    function connect(){

        setIsLoading(true)

        socket.current = new WebSocket("ws://localhost:3000/");

        socket.current.onopen = function(e) {
            setConnected(true);
            setIsLoading(false);
            alert("[open] Соединение установлено");
            alert("Отправляем данные на сервер");
        };

        socket.current.onmessage = function message(event) {
            console.log(event.data)
        };
        socket.current.onclose = function(event) {
            if (event.wasClean) {
                alert(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
            } else {
                // например, сервер убил процесс или сеть недоступна
                // обычно в этом случае event.code 1006
                alert('[close] Соединение прервано');
            }
        };

        socket.current.onerror = function(error) {
            alert(`[error]`);
        };
    }

  return (
    <>

        {!player
            ?
            <form onSubmit={
                (e) => {
                    e.preventDefault();
                    setPlayerData({id: Math.random(), name: playerNameInput})
                }
            }>
                <label htmlFor="">
                    <span>Ваше имя</span>
                    <input required={true} onInput={(e) => setPlayerNameInput(e.target.value)} type="text" name={name} placeholder={'Ваше имя'} value={playerNameInput}/>
                </label>
            </form>
            :
            <div>
                <div>
                    <h4>Новая игра</h4>
                    <form onSubmit={createGame} action="">
                        <button>Создать</button>
                    </form>
                </div>

                <div>
                    <h4>Присоединиться к игре</h4>
                    <form onSubmit={joinGame} action="">

                        <div>
                            <label htmlFor="">
                                <span>Id игры</span>
                                <input required={true} onInput={(e) => {setGameIdInput(e.target.value)}} type="text" name={'game_id'} placeholder={'Id игры'} value={gameIdInput}/>
                            </label>
                        </div>

                        <button>Присоединиться!</button>
                    </form>

                </div>
            </div>
        }

        {player && <div>{player.name} - {player.id}</div>}

        {connected ?
            games.map(g => <div key={g.id}>{g.id} - status: {g.status}</div>)
            :
            isLoading ? 'Loading...' : <button onClick={connect}>connect</button>
        }

    </>
  )
}

export default App
