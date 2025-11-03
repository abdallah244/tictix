// game.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GameResultModal } from '../game-result-modal/game-result-modal';
import { GameDataService, GameSettings } from '../../services/game-data';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.html',
  styleUrls: ['./game.css']
})
export class Game implements OnInit, OnDestroy {
  board: string[] = ['', '', '', '', '', '', '', '', ''];
  currentPlayer: 'X' | 'O' = 'X';
  isGameOver: boolean = false;
  winner: string | null = null;
  winningLine: number[] = [];

  // إعدادات اللعبة
  gameMode: 'player' | 'computer' = 'player';
  difficulty: 'easy' | 'medium' | 'hard' = 'medium';
  playerSymbol: 'X' | 'O' = 'X';

  scores = { X: 0, O: 0 };
  isComputerThinking: boolean = false;

  private moveTimeouts: any[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private gameDataService: GameDataService
  ) {}

  ngOnInit() {
    // جلب البيانات من الـ service بدل الـ router
    const gameSettings = this.gameDataService.getGameSettings();

    console.log('🎮 GAME STARTING - Settings from service:', gameSettings);

    if (gameSettings) {
      this.gameMode = gameSettings.mode;
      this.difficulty = gameSettings.difficulty || 'medium';
      this.playerSymbol = gameSettings.symbol;
    } else {
      console.warn('⚠️ No game settings found, using defaults');
    }

    this.initializeGame();
  }

  ngOnDestroy() {
    this.moveTimeouts.forEach(timeout => clearTimeout(timeout));
    this.moveTimeouts = [];
  }

  initializeGame() {
    this.board = ['', '', '', '', '', '', '', '', ''];
    this.currentPlayer = 'X';
    this.isGameOver = false;
    this.winner = null;
    this.winningLine = [];
    this.isComputerThinking = false;

    console.log('🔄 GAME INITIALIZED:', {
      mode: this.gameMode,
      difficulty: this.difficulty,
      playerSymbol: this.playerSymbol,
      currentPlayer: this.currentPlayer
    });

    // إذا كان ضد الكمبيوتر والكمبيوتر يلعب أولاً
    if (this.gameMode === 'computer' && this.currentPlayer !== this.playerSymbol) {
      console.log('🤖 COMPUTER PLAYS FIRST');
      setTimeout(() => {
        this.makeComputerMove();
      }, 1000);
    }
  }


makeMove(index: number) {
  console.log('🎯 Attempting move at:', index, 'Current player:', this.currentPlayer);

  // تحقق إذا اللاعب يقدر يلعب
  if (!this.canMakeMove(index)) {
    console.log('❌ MOVE BLOCKED');
    return;
  }

  console.log('✅ PLAYER MOVE at index:', index);

  // حركة اللاعب
  this.board[index] = this.currentPlayer;

  // تحقق من الفوز
  if (this.checkGameResult()) {
    return;
  }

  // بدّل اللاعب - ده أهم جزء!
  this.switchPlayer();

  // إذا كان ضد الكمبيوتر، الكمبيوتر يلعب
  if (this.gameMode === 'computer' && !this.isGameOver) {
    console.log('🤖 COMPUTER TURN');
    setTimeout(() => {
      this.makeComputerMove();
    }, 500);
  }
  // في وضع Player vs Player، اللعبة تكمل عادي من غير ما تتوقف
}

  canMakeMove(index: number): boolean {
  const canMove =
    !this.isGameOver &&
    !this.isComputerThinking &&
    this.board[index] === '' &&
    // في وضع Player vs Player، أي لاعب يقدر يلعب في دوره
    (this.gameMode === 'player' || this.currentPlayer === this.playerSymbol);

  console.log('🔍 Can make move check:', {
    index,
    isGameOver: this.isGameOver,
    isComputerThinking: this.isComputerThinking,
    cellEmpty: this.board[index] === '',
    gameMode: this.gameMode,
    currentPlayer: this.currentPlayer,
    playerSymbol: this.playerSymbol,
    result: canMove
  });

  return canMove;
}

switchPlayer() {
  this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  console.log('🔄 SWITCHED TO:', this.currentPlayer);
}

// ودالة الـ HTML helper


  makeComputerMove() {
    console.log('🤖 COMPUTER MOVE STARTED - Current player:', this.currentPlayer);

    if (this.isGameOver || this.isComputerThinking) {
      console.log('❌ COMPUTER MOVE BLOCKED');
      return;
    }

    this.isComputerThinking = true;
    console.log('🤖 COMPUTER THINKING...');

    const availableMoves = this.board
      .map((cell, index) => cell === '' ? index : null)
      .filter(index => index !== null) as number[];

    console.log('📋 AVAILABLE MOVES:', availableMoves);

    if (availableMoves.length === 0) {
      console.log('❌ NO MOVES AVAILABLE');
      this.isComputerThinking = false;
      return;
    }

    let computerMove: number;

    // اختيار الحركة بناءً على الصعوبة
    if (this.difficulty === 'hard') {
      computerMove = this.getBestMove();
    } else if (this.difficulty === 'medium') {
      computerMove = Math.random() > 0.3 ? this.getBestMove() : availableMoves[Math.floor(Math.random() * availableMoves.length)];
    } else {
      computerMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    console.log('🎯 COMPUTER CHOSE MOVE:', computerMove);

    // وقت التفكير
    const thinkingTime = 800;

    const timeout = setTimeout(() => {
      console.log('✅ COMPUTER EXECUTING MOVE:', computerMove);
      this.board[computerMove] = this.currentPlayer;
      this.isComputerThinking = false;

      // تحقق من النتيجة
      if (!this.checkGameResult()) {
        // بدّل للاعب
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        console.log('🔄 SWITCHED BACK TO PLAYER:', this.currentPlayer);
      }
    }, thinkingTime);

    this.moveTimeouts.push(timeout);
  }

  getBestMove(): number {
    const availableMoves = this.board
      .map((cell, index) => cell === '' ? index : null)
      .filter(index => index !== null) as number[];

    const computerPlayer = this.currentPlayer;
    const humanPlayer = computerPlayer === 'X' ? 'O' : 'X';

    // 1. حاول تفوز
    for (const move of availableMoves) {
      const testBoard = [...this.board];
      testBoard[move] = computerPlayer;
      if (this.checkWinner(testBoard) === computerPlayer) {
        return move;
      }
    }

    // 2. حاول تمنع اللاعب
    for (const move of availableMoves) {
      const testBoard = [...this.board];
      testBoard[move] = humanPlayer;
      if (this.checkWinner(testBoard) === humanPlayer) {
        return move;
      }
    }

    // 3. حركات استراتيجية
    const strategicMoves = [4, 0, 2, 6, 8, 1, 3, 5, 7];
    for (const move of strategicMoves) {
      if (availableMoves.includes(move)) {
        return move;
      }
    }

    return availableMoves[0];
  }

  checkGameResult(): boolean {
    const winner = this.checkWinner(this.board);

    if (winner) {
      this.winner = winner;
      this.isGameOver = true;
      this.scores[winner as 'X' | 'O']++;
      console.log('🏆 GAME OVER - Winner:', winner);
      this.showGameResult(this.getWinnerMessage(winner));
      return true;
    }

    if (this.board.every(cell => cell !== '')) {
      this.winner = 'draw';
      this.isGameOver = true;
      console.log('🤝 GAME OVER - Draw');
      this.showGameResult("It's a Draw!");
      return true;
    }

    return false;
  }

  checkWinner(board: string[]): string | null {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        this.winningLine = pattern;
        return board[a];
      }
    }

    return null;
  }

  getWinnerMessage(winner: string): string {
    if (this.gameMode === 'computer') {
      return winner === this.playerSymbol ? 'You Win! 🎉' : 'Computer Wins! 🤖';
    } else {
      return `Player ${winner} Wins! 🎉`;
    }
  }

  showGameResult(message: string) {
    setTimeout(() => {
      this.dialog.open(GameResultModal, {
        width: '400px',
        data: { message, scores: this.scores, gameMode: this.gameMode }
      }).afterClosed().subscribe(action => {
        if (action === 'restart') {
          this.restartGame();
        } else if (action === 'menu') {
          this.router.navigate(['/home']);
        }
      });
    }, 1000);
  }

  restartGame() {
    this.moveTimeouts.forEach(timeout => clearTimeout(timeout));
    this.moveTimeouts = [];
    this.initializeGame();
  }

  isWinningCell(index: number): boolean {
    return this.winningLine.includes(index);
  }

  getPlayerName(symbol: 'X' | 'O'): string {
    return this.gameMode === 'computer' ?
      (symbol === this.playerSymbol ? 'You' : 'Computer') :
      (symbol === 'X' ? 'Player 1' : 'Player 2');
  }

  isCurrentPlayer(symbol: 'X' | 'O'): boolean {
    return this.currentPlayer === symbol && !this.isGameOver;
  }

  getTurnText(): string {
    if (this.isComputerThinking) return 'Computer thinking...';
    if (this.isGameOver) return 'Game Over';
    if (this.gameMode === 'computer' && this.currentPlayer !== this.playerSymbol) return 'Computer Turn';
    return `${this.getPlayerName(this.currentPlayer)}'s Turn`;
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  getGameModeText(): string {
    return this.gameMode === 'computer' ? 'VS Computer' : 'VS Player';
  }

 isCellClickable(index: number): boolean {
  return this.canMakeMove(index);
}
}
