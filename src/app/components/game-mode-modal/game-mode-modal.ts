// src/app/components/game-mode-modal/game-mode-modal.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GameDataService, GameSettings } from '../../services/game-data';

@Component({
  selector: 'app-game-mode-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './game-mode-modal.html',
  styleUrls: ['./game-mode-modal.css']
})
export class GameModeModalComponent {
  selectedMode: 'player' | 'computer' | null = null;
  selectedDifficulty: 'easy' | 'medium' | 'hard' | null = null;
  selectedSymbol: 'X' | 'O' | null = null;

  constructor(
    public dialogRef: MatDialogRef<GameModeModalComponent>,
    private gameDataService: GameDataService
  ) {}

  selectMode(mode: 'player' | 'computer'): void {
    this.selectedMode = mode;
    this.selectedDifficulty = null;
    this.selectedSymbol = null;
    console.log('🎮 Selected mode:', mode);
  }

  selectDifficulty(difficulty: 'easy' | 'medium' | 'hard'): void {
    this.selectedDifficulty = difficulty;
    console.log('🎯 Selected difficulty:', difficulty);
  }

  selectSymbol(symbol: 'X' | 'O'): void {
    this.selectedSymbol = symbol;
    console.log('⚡ Selected symbol:', symbol);
  }

  isStepComplete(): boolean {
    if (this.selectedMode === 'computer') {
      return this.selectedDifficulty !== null && this.selectedSymbol !== null;
    } else if (this.selectedMode === 'player') {
      return this.selectedSymbol !== null;
    }
    return false;
  }

  startGame(): void {
    if (!this.isStepComplete()) {
      console.warn('❌ Cannot start game: incomplete selection.');
      return;
    }

    const gameData: GameSettings = {
      mode: this.selectedMode as 'player' | 'computer',
      difficulty: this.selectedDifficulty ?? undefined,
      symbol: this.selectedSymbol as 'X' | 'O'
    };

    console.log('🚀 Starting game with data:', gameData);

    this.gameDataService.setGameSettings(gameData);
    this.dialogRef.close('start');
  }

  close(): void {
    this.dialogRef.close();
  }

  getStepTitle(): string {
    if (!this.selectedMode) return 'Select Game Mode';
    if (this.selectedMode === 'computer' && !this.selectedDifficulty)
      return 'Choose Difficulty';
    return 'Choose Your Symbol';
  }

  getStepDescription(): string {
    if (!this.selectedMode) return 'How would you like to play?';
    if (this.selectedMode === 'computer' && !this.selectedDifficulty)
      return 'Select the AI difficulty level';
    return 'Pick your playing symbol';
  }
}
