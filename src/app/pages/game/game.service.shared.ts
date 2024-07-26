// shared/game.service.shared.ts

export const mod = (x: number, y: number): number => ((y % x) + x) % x;

export interface State {
    players: Record<string, Player>;
    fruits: Record<string, Fruit>;
    screen: {
        width: number;
        height: number;
        pixelsPerFields: number;
    };
    config: {
        maxCollisionDistance: number;
        playerCollisionCost: number;
        wallCollisionCost: number;
        initialScore: number;
        autoDropFruitValue: number;
        showPotsValue: boolean;
    };
}

export interface Player {
    name: string;
    playerId: string;
    x: number;
    y: number;
    score: number;
    isConnected: boolean;
    disconnectTimeout: any;
    disconnected: boolean;
    disconnectDuration: number | null;
    disconnectTime: any;
}

export interface Fruit {
    x: number;
    y: number;
    quantity: number;
}

export class GameServiceBase {
  
    private serverSock:any = null;
    protected logger: any = null; 
    

    public state: State = {
        players: {
        },
        fruits: {},
        screen: {
            width: 25,
            height: 25,
            pixelsPerFields: 16,
        },
        config: {
            maxCollisionDistance: 4,
            playerCollisionCost: 100,
            wallCollisionCost: 150,
            initialScore: 500,
            autoDropFruitValue: 1,
            showPotsValue: false,
        }
    };

    private observers: Array<(command: any) => void> = [];

    setServer(server: any){
        if(this.serverSock === null){
            this.serverSock = server;
            this.subscribe((command) => {
                 console.log(`> Emitting ${command.type}`);
                 this.serverSock.emit(command.type, command);
             })
        }
    }

    constructor(isStart:boolean = false) {
        if(isStart === true)
            this.start();
    }

    private start() {
        const frequency = 5000;
        setInterval(() => 
        {
            let countFruits = Object.keys(this.state.fruits).length
            if(countFruits <= 90)
                this.addFruit()
        }
        , frequency);
        
    }

    public subscribe(observerFunction: (command: any) => void) {
        this.observers.push(observerFunction);
    }

    private safeStringify(obj: any, replacer: any = null, spaces: number = 2): string {
        const cache = new Set();
        return JSON.stringify(obj, (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (cache.has(value)) {
                    // Циклическая ссылка
                    return;
                }
                cache.add(value);
            }
            return value;
        }, spaces);
    }



    public notifyAll(command: any) {
         this.logCommand(command);
        for (const observerFunction of this.observers) {
            observerFunction(command);
        }
    }

    public setState(newState: Partial<State>) {
        this.logState();
        Object.assign(this.state, newState);
        this.logState();
    }

    public addPlayer(command: any) {
        this.logState();
        const playerId = command.playerId;
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * this.state.screen.width);
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * this.state.screen.height);

        this.state.players[playerId] = {
            playerId,
            x: playerX,
            y: playerY,
            score: this.state.config.initialScore,
            isConnected: true,
            disconnectTimeout: null,
            disconnectDuration: null,
            disconnected: false,
            disconnectTime: null,
            name: command.name,
        };

        this.notifyAll({
            type: 'add-player',
            playerId,
            playerX,
            playerY,
            score: this.state.config.initialScore
        });
        this.logState();
    }

    public disconnectPlayer(command: any) {
        console.log('disconnect...')
        const playerId = command.playerId;
        if(this.state.players[playerId]){
            const playerObj = Object.assign(this.state.players[playerId]);
            this.state.players[playerId] = {
              ...playerObj,
              disconnectDuration: command.disconnectDuration,
              disconnected: command.disconnected,
              disconnectTime: command.disconnectTime,
            };
        
            this.notifyAll({
              type: 'disconnect-player',
              playerId,
              disconnectDuration: command.disconnectDuration,
              disconnected: command.disconnected,
              disconnectTime: command.disconnectTime,
        
            });
           
        }
      }

    public removePlayer(command: any) {
        this.logState();
        const playerId = command.playerId;
        delete this.state.players[playerId];

        this.notifyAll({
            type: 'remove-player',
            playerId
        });
        this.logState();
    }

    private getPlayersAround(coords: { x: number, y: number }): string[] {
        const { config: { maxCollisionDistance }, players } = this.state;
        const playersAround: string[] = [];

        for (const playerId in players) {
            const player = players[playerId];
            const { x, y } = player;
            const distance = Math.sqrt((coords.x - x) ** 2 + (coords.y - y) ** 2);
            if (distance <= maxCollisionDistance) {
                playersAround.push(playerId);
            }
        }
        return playersAround;
    }

    public addFruit(command?: any) {
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * this.state.screen.width);
        const fruitY = command ? command.fruitY : Math.floor(Math.random() * this.state.screen.height);
        const fruitId = command ? command.fruitId : `${fruitX}-${fruitY}`;
        const quantity = command ? command.quantity : Math.floor(100 * (1 - Math.sqrt(Math.random()))) + 1;

        const oldQuantity = this.state.fruits[fruitId] ? this.state.fruits[fruitId].quantity : 0;

        this.state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY,
            quantity: quantity + oldQuantity > 100 ? 0 : quantity + oldQuantity
        };

        this.notifyAll({
            type: 'play-audio',
            audio: 'newFruit',
            playersId: this.getPlayersAround({ x: fruitX, y: fruitY })
        });

        this.notifyAll({
            type: 'add-fruit',
            fruitId: `${fruitX}-${fruitY}`,
            fruitX,
            fruitY,
            quantity
        });
    }

    public removeFruit(command: any) {
        const { fruitId, playerId } = command;

        delete this.state.fruits[fruitId];

        this.notifyAll({
            type: 'play-audio',
            audio: 'drinkPot',
            playersId: [playerId]
        });

        this.notifyAll({
            type: 'remove-fruit',
            fruitId
        });
    }

    private onBorderShock(player: Player) {
        const { config: { wallCollisionCost } } = this.state;
        const shockCost = Math.min(player.score, wallCollisionCost);
        this.state.players[player.playerId].score -= shockCost;
        this.explodeFruits(shockCost, player.x, player.y);

        this.notifyAll({
            type: 'play-audio',
            audio: 'wallCollision',
            playersId: [player.playerId]
        });
    }

    public movePlayer(command: any) {
        this.notifyAll(command);

        const acceptedMoves: Record<string, (player: Player) => void> = {
            ArrowUp: (player) => {
                if (player.y - 1 >= 0) {
                    player.y -= 1;
                } else this.onBorderShock(player);
            },
            ArrowRight: (player) => {
                if (player.x + 1 < this.state.screen.width) {
                    player.x += 1;
                } else this.onBorderShock(player);
            },
            ArrowDown: (player) => {
                if (player.y + 1 < this.state.screen.height) {
                    player.y += 1;
                } else this.onBorderShock(player);
            },
            ArrowLeft: (player) => {
                if (player.x - 1 >= 0) {
                    player.x -= 1;
                } else this.onBorderShock(player);
            }
        };

        const keyPressed = command.keyPressed;
        const playerId = command.playerId;
        const player = this.state.players[playerId];
        const moveFunction = acceptedMoves[keyPressed];

        if (player && moveFunction && player.score > 0) {
            moveFunction(player);
            this.checkForFruitCollision(playerId);
            this.checkForPlayerCollision(playerId);
        }
    }

    private checkForPlayerCollision(playerId: string) {
        const player = this.state.players[playerId];

        Object.keys(this.state.players).filter(k => k !== playerId).forEach(otherPlayerKey => {
            const otherPlayer = this.state.players[otherPlayerKey];
            if (player.x === otherPlayer.x && player.y === otherPlayer.y && otherPlayer.score > 0) {
                const otherPlayerDiscount = Math.min(otherPlayer.score, this.state.config.playerCollisionCost);
                const playerDiscount = Math.min(player.score, this.state.config.playerCollisionCost);
                const totalFruits = otherPlayerDiscount + playerDiscount;

                this.state.players[otherPlayerKey].score -= otherPlayerDiscount;
                this.state.players[playerId].score -= playerDiscount;

                this.notifyAll({
                    type: 'play-audio',
                    audio: 'playersCollision',
                    playersId: [otherPlayerKey, playerId]
                });

                this.explodeFruits(totalFruits, player.x, player.y);
            }
        });
    }

    private checkForFruitCollision(playerId: string) {
        const player = this.state.players[playerId];
        Object.keys(this.state.fruits).forEach(fruitId => {
            const fruit = this.state.fruits[fruitId];
            if (player.x === fruit.x && player.y === fruit.y) {
                this.state.players[playerId].score += fruit.quantity;
                this.removeFruit({ fruitId, playerId });
            }
        });
    }

    private explodeFruits(totalFruits: number, x: number, y: number) {
        const quantity = Math.ceil(totalFruits / 9);
        this.addFruit({ fruitId: `${x}-${y}`, fruitX: x, fruitY: y, quantity });
        this.addFruit({ fruitId: `${x}-${mod(y + 1, this.state.screen.height)}`, fruitX: x, fruitY: mod(y + 1, this.state.screen.height), quantity });
        this.addFruit({ fruitId: `${x}-${mod(y - 1, this.state.screen.height)}`, fruitX: x, fruitY: mod(y - 1, this.state.screen.height), quantity });
        this.addFruit({ fruitId: `${mod(x + 1, this.state.screen.width)}-${y}`, fruitX: mod(x + 1, this.state.screen.width), fruitY: y, quantity });
        this.addFruit({ fruitId: `${mod(x - 1, this.state.screen.width)}-${y}`, fruitX: mod(x - 1, this.state.screen.width), fruitY: y, quantity });
        this.addFruit({ fruitId: `${mod(x - 1, this.state.screen.width)}-${mod(y - 1, this.state.screen.height)}`, fruitX: mod(x - 1, this.state.screen.width), fruitY: mod(y - 1, this.state.screen.height), quantity });
        this.addFruit({ fruitId: `${mod(x - 1, this.state.screen.width)}-${mod(y + 1, this.state.screen.height)}`, fruitX: mod(x - 1, this.state.screen.width), fruitY: mod(y + 1, this.state.screen.height), quantity });
        this.addFruit({ fruitId: `${mod(x + 1, this.state.screen.width)}-${mod(y - 1, this.state.screen.height)}`, fruitX: mod(x + 1, this.state.screen.width), fruitY: mod(y - 1, this.state.screen.height), quantity });
        this.addFruit({ fruitId: `${mod(x + 1, this.state.screen.width)}-${mod(y + 1, this.state.screen.height)}`, fruitX: mod(x + 1, this.state.screen.width), fruitY: mod(y + 1, this.state.screen.height), quantity });
    }

    private logCommand(command: any) {
        if(this.logger !== null)
            this.logger.log('Command:', command); // Используйте this.logger
    }

    private logState() {
        if(this.logger !== null)
            this.logger.log(`> Current state: ${this.safeStringify(this.state)}`); // Используйте this.logger
    }
}