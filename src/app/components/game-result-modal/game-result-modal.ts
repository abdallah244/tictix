// src/app/components/game-result-modal/game-result-modal.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface GameResultData {
  message: string;
  scores: { X: number; O: number };
  gameMode: string;
}

@Component({
  selector: 'app-game-result-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './game-result-modal.html',
  styleUrls: ['./game-result-modal.css']
})
export class GameResultModal {
  constructor(
    public dialogRef: MatDialogRef<GameResultModal>,
    @Inject(MAT_DIALOG_DATA) public data: GameResultData
  ) {}

  onRestart(): void {
    this.dialogRef.close('restart');
  }

  onMenu(): void {
    this.dialogRef.close('menu');
  }

  getWinnerSymbol(): string {
    if (this.data.message.includes('X')) return 'X';
    if (this.data.message.includes('O')) return 'O';
    return 'draw';
  }

  getResultTitle(): string {
    if (this.getWinnerSymbol() === 'draw') {
      return 'Game Tied!';
    }
    return 'Victory!';
  }

  getResultIcon(): string {
    const winner = this.getWinnerSymbol();
    switch (winner) {
      case 'X': return '⨉';
      case 'O': return '⦿';
      default: return '🤝';
    }
  }

  getResultColor(): string {
    const winner = this.getWinnerSymbol();
    switch (winner) {
      case 'X': return 'x-color';
      case 'O': return 'o-color';
      default: return 'draw-color';
    }
  }

  // الدوال الجديدة - أضفتها هنا
  getTotalGames(): number {
    return this.data.scores.X + this.data.scores.O;
  }

  // في game-result-modal.component.ts - دالة getWinRate
getWinRate(): string {
  const totalGames = this.getTotalGames();
  if (totalGames === 0) return '0';

  let playerWins: number;

  if (this.data.gameMode === 'computer') {
    // تحديد فوز اللاعب البشري
    if (this.data.message.includes('You Win')) {
      // اللاعب فاز
      playerWins = this.data.message.includes('X') ? this.data.scores.X : this.data.scores.O;
    } else {
      // AI فاز أو تعادل
      playerWins = this.data.message.includes('X') ? this.data.scores.O : this.data.scores.X;
    }
  } else {
    // في وضع لاعب ضد لاعب، نأخذ أعلى نتيجة
    playerWins = Math.max(this.data.scores.X, this.data.scores.O);
  }

  return ((playerWins / totalGames) * 100).toFixed(1);
}

   
}
