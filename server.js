import { WebSocketServer } from 'ws';
import { nanoid } from 'nanoid'

const wss = new WebSocketServer({ port: 3000 }, ()=>console.log('listen 3000'));

let games = new Map([
    [
        's123', {status: 'finished', players: [], players_count: 3, turn: 0, id: 's123'}
    ],
]);
const rouletteData = [
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
const players =

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    wss.on('connection', function connection(ws) {
        const message = {
            type: 'message',
            action: 'onGetGames',
            data: Array.from(games),
            status: 'success',
        }
        broadcastMessage(message)
    })

    ws.on('message', function message(data) {
        data = JSON.parse(data);

        switch (data.action) {
            case 'create_game': {
                const game = data.game;
                const id = nanoid(5);
                game.turn = 0;
                game.id = id;
                games.set(id, game);
                const message = {
                    type: 'message',
                    action: 'onGameCreated',
                    text: 'Игра создана',
                    status: 'success',
                    id: game.id,
                }
                ws.send(JSON.stringify(message));

                console.log(Array.from(games));
                break;
            }

            case 'join_player': {
                const game = games.get(data.game_id);

                if(typeof game !== "object") {
                    const message = {
                        type: 'message',
                        action: 'notification',
                        text: 'Игры с таким  ID не существует!',
                        status: 'failed'
                    }
                    console.log(data.game_id);
                    ws.send(JSON.stringify(message));
                    break;
                }

                if(game.players.length >= game.players_count) {
                    const message = {
                        type: 'message',
                        action: 'notification',
                        text: 'Все места в игре заняты!',
                        status: 'failed',
                    }
                    ws.send(JSON.stringify(message));
                    break;
                }
                if(game.players.find(p => p.id == data.player.id)){
                    const message = {
                        type: 'message',
                        action: 'notification',
                        text: 'Вы уже в игре!',
                        status: 'failed'
                    }
                    ws.send(JSON.stringify(message));
                    break;
                }
                if(!data.player.id || !data.player.name){
                    const message = {
                        type: 'message',
                        action: 'notification',
                        text: 'Ошибочные данные пользователя, попробуйте залогиниться заново или перезагрузить страницу',
                        status: 'failed'
                    }
                    ws.send(JSON.stringify(message));
                    break;
                }
                game.players.push(data.player);
                if(game.players.length === game.players_count){
                    game.status = 'in_process';
                }
                const message = {
                    type: 'message',
                    action: 'onJoinGame',
                    text: 'Вы добавлены в игру!',
                    status: 'success',
                    id: game.id,
                }
                //broadcastMessage(message);
                ws.send(JSON.stringify(message));
                break;
            }
            case 'get_game_state': {
                const gameId = data.game_id;
                const gameState = games.get(gameId);
                let doRoll = false;


                if(data.nextTurn === true) {
                    if(gameState.turn < gameState.players.length - 1) {
                        gameState.turn++;
                    } else {
                        gameState.turn = 0;
                    }
                }

                if(data.roll === true) {
                    const result = {
                        turn: gameState.turn,
                        prizeNumber: null,
                        prize: null,
                    }
                    doRoll = true;
                    gameState.prizeNumber = Math.floor(Math.random() * rouletteData.length);
                    //gameState.prizeNumber = 3;
                    result.prizeNumber = gameState.prizeNumber;
                    result.prize = rouletteData[gameState.prizeNumber].fullName;
                    gameState.result = result;
                }
                if(!gameState){
                    const message = {
                        type: 'message',
                        action: 'onGetGameState',
                        status: 'failed',
                        text: `Игры с таким ID (${gameId}) не существует`,
                    }
                    ws.send(JSON.stringify(message));
                    break;
                }

                const message = {
                    type: 'message',
                    action: 'onGetGameState',
                    status: 'success',
                    state: {
                        ...gameState,
                    },
                    doRoll,
                    id: gameId,
                }
                broadcastMessage(message);
                //ws.send(JSON.stringify(message));
                break;
            }

            default: {
                const message = {
                    type: 'message',
                    action: 'notification',
                    text: `action '${data.action}' is undefined`,
                    status: 'failed'
                }
                ws.send(JSON.stringify(message));
            }
        }
    });

    //ws.send(JSON.stringify(games));
});

function broadcastMessage(message, id = 0) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message))
    })
}
