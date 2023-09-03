import { WebSocketServer } from 'ws';
import { nanoid } from 'nanoid'

const wss = new WebSocketServer({ port: 3000 }, ()=>console.log('listen 3000'));

let games = new Map([
    [
        's123', {status: 'finished', players: [], players_count: 3, turn: 0}
    ],
]);

const players =

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

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
                if(game.players.find(p => p.id === data.player.id)){
                    const message = {
                        type: 'message',
                        action: 'notification',
                        text: 'Вы уже в игре!',
                        status: 'failed'
                    }
                    ws.send(JSON.stringify(message));
                    break;
                }
                game.players.push(data.player);
                const message = {
                    type: 'message',
                    action: 'onJoinGame',
                    text: 'Вы добавлены в игру!',
                    status: 'success',
                    id: game.id
                }
                ws.send(JSON.stringify(message));
                console.log(games.get(data.game_id).players);
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

    ws.send(JSON.stringify(games));
});
