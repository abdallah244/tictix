// src/app/services/game-data.service.ts
import { Injectable } from '@angular/core';

export interface GameSettings {
  mode: 'player' | 'computer';
  difficulty?: 'easy' | 'medium' | 'hard';
  symbol: 'X' | 'O';
}

@Injectable({
  providedIn: 'root'
})
export class GameDataService {
  private gameSettings: GameSettings | null = null;

  setGameSettings(settings: GameSettings) {
    this.gameSettings = settings;
    console.log('💾 Game settings saved:', settings);
  }

  getGameSettings(): GameSettings | null {
    console.log('💾 Game settings retrieved:', this.gameSettings);
    return this.gameSettings;
  }

  clearGameSettings() {
    this.gameSettings = null;
  }
}
