import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Subscription } from 'rxjs';
import { CustomSocketService } from '../../custom.socket.service';
import { TokenService } from '../../token.service';
import { GlobalService } from '../../services/global.serice';
import { KeyboardService } from './keyboard.service';
import { GameService } from './game.service';
import { TAIGA_MODULES } from '../../taiga-all-modules/taiga.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Player } from './interfaces';



@Component({
    standalone: true,
    selector: 'app-game',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TAIGA_MODULES,
    ],
    styleUrls: ['./game.component.less'],
    templateUrl: './game.component.html'
})
export class GameComponent implements OnInit, OnDestroy {

    public playerId: string;
    playersArray: Player[] = [];
    private subscription: any;

    @ViewChild('screen') screenElement!: ElementRef<HTMLCanvasElement>;
    @ViewChild('scoreTable') scoreTableElement!: ElementRef<HTMLTableElement>;
    @ViewChild('potionsImg') potionsImgElement!: ElementRef<HTMLImageElement>;

    audios: any = {
        playerCollision: new Audio("./assets/sounds/bubble_hit.mp3"),
        newFruit: new Audio("./assets/sounds/fruit_drop.mp3"),
        wallCollision: new Audio("./assets/sounds/wall_energy_shock.mp3"),
        eatFruit: new Audio("./assets/sounds/eat_fruit_apple.mp3"),
        drinkPot: new Audio("./assets/sounds/human_swallowing_loud.mp3"),
    }

    constructor(
        private keyboardService: KeyboardService,
        private socket: CustomSocketService, 
        private cdRef: ChangeDetectorRef, 
        private tokenService: TokenService, 
        public globalService: GlobalService, 
        public gameService: GameService
    ) {
        
        this.playerId = this.globalService.userState.user.tgId;
    }

    ngOnInit(): void {
        this.tokenService.setToken(this.globalService.getToken())
        this.setupSocketListeners()

    }



    ngOnDestroy(): void {
        this.keyboardService.unsubscribeAll();
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
    }

    private getInitials(str:string) {
        // Разбиваем строку на массив слов
        const words = str.split(' ');
    
        // Получаем первые буквы двух слов
        const firstInitial = words[0] ? words[0][0] : '*';
        const secondInitial = words[1] ? words[1][0] : '*';
    
        // Объединяем и возвращаем результат
        return firstInitial + secondInitial;
    }

    private setupSocketListeners(): void {
        this.socket.on('connect').subscribe(e => {
            console.log('connectos')
            this.setupScreen();
            this.renderScreen();
        })

        this.socket.on('disconnect').subscribe(e => {
            console.log('Disconnected');
            // Handle cleanup if needed
        })

        this.socket.on('setup').subscribe(state => {
            //this.setupGameState(state);
            this.gameService.setState(state);
            this.keyboardService.registerPlayerId(this.playerId); 
  
        })

        this.socket.on('disconnect-player').subscribe(command => {
            this.gameService.disconnectPlayer(command);
        })

        this.socket.on('add-player').subscribe(command => {
            this.gameService.addPlayer(command);
        })

        this.socket.on('remove-player').subscribe(command => {
            this.gameService.removePlayer(command);
        })

        this.socket.on('move-player').subscribe(command => {
            this.gameService.movePlayer(command);
        })

        this.socket.on('add-fruit').subscribe(command => {
            this.gameService.addFruit(command);
        })

        this.socket.on('remove-fruit').subscribe(command => {
            this.gameService.removeFruit(command);
        })

        this.socket.on('play-audio').subscribe(command => {
     

            if (command.audio && this.audios[command.audio]) {

                //only play sound for those users
                if (command.playersId && command.playersId.indexOf(this.playerId) > -1)
                    this.playAudio(command)
                else if (command.playersId && command.playersId.length === 0) {
                    this.playAudio(command)
                }
            }

        })
    }

    ngAfterViewInit(){
        this.subscription = this.keyboardService.subscribe((command) => {
            this.socket.emit('move-player', command)
          });
    }

    private setupScreen(): void {
        const canvas = this.screenElement.nativeElement;
        const context = canvas.getContext('2d');
        if (!context) return;

        const { width, height, pixelsPerFields } = this.gameService.state.screen;
        canvas.width = width * pixelsPerFields;
        canvas.height = height * pixelsPerFields;
    }

    private renderScreen(): void {
        const canvas = this.screenElement.nativeElement;
        const context = canvas.getContext('2d');
        const potionsImg = this.potionsImgElement.nativeElement;
        // const scoreTable = this.scoreTableElement.nativeElement;

        if (!context) return;
        const { width, height, pixelsPerFields } = this.gameService.state.screen;
        context.clearRect(0, 0, width * pixelsPerFields, height * pixelsPerFields);
        for (const playerId in this.gameService.state.players) {
            const player = this.gameService.state.players[playerId];
            this.drawPlayer(context, player, playerId === this.playerId);
        }

        for (const fruitId in this.gameService.state.fruits) {
            const fruit = this.gameService.state.fruits[fruitId];
            this.drawPot(context, fruit, potionsImg);
        }
        this.playersArray = Object.values(this.gameService.state.players).sort((a:any, b:any) => b.score - a.score);
        // this.updateScoreTable(scoreTable);
 
        requestAnimationFrame(() => {
            this.renderScreen()
            this.cdRef.markForCheck()
            this.cdRef.detectChanges()
        });
    }

    private drawPlayer(context: CanvasRenderingContext2D, player: any, isCurrentPlayer: boolean): void {
        const { pixelsPerFields } = this.gameService.state.screen;
        let faceColor = this.getColorFromScore(player.score);
        let eyeAndMouthColors = 'black';

        if (!player.isConnected) {
            faceColor = 'brown';
        }

        if (isCurrentPlayer) {
            eyeAndMouthColors = 'white';
        }

        let { x, y } = player;
        x *= pixelsPerFields;
        y *= pixelsPerFields;

        context.fillStyle = faceColor;
        context.fillRect(x, y, pixelsPerFields, pixelsPerFields);

        context.fillStyle = eyeAndMouthColors;
        context.fillRect(x + this.responsiveMeasure(1, pixelsPerFields), y + this.responsiveMeasure(1, pixelsPerFields), this.responsiveMeasure(1, pixelsPerFields), this.responsiveMeasure(1, pixelsPerFields));
        context.fillRect(x + this.responsiveMeasure(3, pixelsPerFields), y + this.responsiveMeasure(1, pixelsPerFields), this.responsiveMeasure(1, pixelsPerFields), this.responsiveMeasure(1, pixelsPerFields));
        context.fillRect(x + this.responsiveMeasure(1, pixelsPerFields), y + this.responsiveMeasure(3, pixelsPerFields), this.responsiveMeasure(3, pixelsPerFields), this.responsiveMeasure(1, pixelsPerFields));

        context.fillStyle = 'white';
        context.font = "10px Arial";
        context.fillText(this.getInitials(player.name), x, y - 3);

        if (player.disconnected === true) {
            const remainingTime = Math.ceil((30000 - (Date.now() - player.disconnectTime)) / 1000);
            if(player.disconnectDuration){
                context.fillStyle = 'red';
                context.font = "10px Arial";
                context.fillText(`TM: ${player.disconnectDuration}`, x, y - 15);
            }

        }
    }

    private drawPot(context: CanvasRenderingContext2D, fruit: any, potionsImg: HTMLImageElement): void {
        const { pixelsPerFields } = this.gameService.state.screen;
        let { x, y, quantity } = fruit;
        x *= pixelsPerFields;
        y *= pixelsPerFields;

        const pictSize = 16;
        let column = Math.floor((quantity - 1) % 10);
        let line = Math.floor((quantity - 1) / 10);

        if (line > 0 && column < 9) line--;

        line = Math.min(line, 9);
        column = Math.min(column, 9);

        const spriteX = line * pictSize;
        const spriteY = column * pictSize;
        context.drawImage(potionsImg, spriteY, spriteX, 16, 16, x, y, pixelsPerFields, pixelsPerFields);

        if (this.gameService.state.config.showPotsValue) {
            context.fillStyle = 'black';
            context.font = "10px Arial";
            context.fillText(quantity.toString(), x, y - 3);
        }
    }

    // private updateScoreTable(scoreTable: HTMLTableElement): void {
    //     const maxResults = 10;
    //     let scoreTableInnerHTML = `
    //   <tr class="header">
    //     <td>Top 10 Players</td>
    //     <td>Points</td>
    //     <td>Online</td>
    //   </tr>
    // `;

    //     const playersArray = Object.values(this.gameService.state.players).map(player => ({
    //         playerId: player.playerId,
    //         x: player.x,
    //         y: player.y,
    //         score: player.score,
    //         disconnectTime: player.disconnectTime,
    //         disconnectTimeout: player.disconnectTimeout,
    //         disconnectDuration: player.disconnectDuration,
    //         disconnected: player.disconnected
    //     }));

    //     const playersSortedByScore = playersArray.sort((first, second) => second.score - first.score);
    //     const topScorePlayers = playersSortedByScore.slice(0, maxResults);

    //     scoreTableInnerHTML = topScorePlayers.reduce((stringFormed, player) => stringFormed + `
    //   <tr class="${player.playerId === this.playerId ? 'current-player' : ''}">
    //     <td>${player.playerId}</td>
    //     <td>${player.score}</td>
    //     <td>${player.disconnected} ${player.disconnectTime} ${player.disconnectDuration}</td>
    //   </tr>
    // `, scoreTableInnerHTML);

    //     if (!topScorePlayers.some(player => player.playerId === this.playerId)) {
    //         const currentPlayerFromTopScore = this.gameService.state.players[this.playerId || ''];

    //         if (currentPlayerFromTopScore) {
    //             scoreTableInnerHTML += `
    //       <tr class="current-player">
    //         <td>${this.playerId}</td>
    //         <td>${currentPlayerFromTopScore.score}</td>
    //       </tr>
    //     `;
    //         }
    //     }

    //     scoreTable.innerHTML = scoreTableInnerHTML;
    // }

    private getColorFromScore(score: number): string {
        score *= 10;
        const red = Math.min(score, 240);
        const green = Math.min(score, 219);
        const blue = Math.max(score, 79);
        return `rgb(${red},${green},${blue})`;
    }

    private responsiveMeasure(initialValue: number, pixelsPerFields: number): number {
        return initialValue * (pixelsPerFields / 5);
    }

   

    private playAudio(command: any): void {
        // Handle playing audio
        this.audios[command.audio].cloneNode(true).play().catch((error: any) => {
            console.error('Error playing audio:', error);
        });
    }
}