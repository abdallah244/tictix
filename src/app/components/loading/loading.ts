// loading.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrls: ['./loading.css']
})
export class LoadingComponent implements OnInit {
  cells: string[] = Array(9).fill('');
  currentGame: number = 0;
  games = [
    { moves: [0, 4, 1, 2, 3], winner: 'X', winningLine: [0, 1, 2] },
    { moves: [0, 1, 4, 2, 8], winner: 'O', winningLine: [0, 4, 8] },
    { moves: [0, 3, 1, 4, 2], winner: 'X', winningLine: [0, 1, 2] },
    { moves: [0, 4, 8, 2, 6], winner: 'O', winningLine: [2, 4, 6] }
  ];
  currentWinningLine: number[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.startGameSequence();

    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 6000);
  }

  startGameSequence() {
    this.playGame(0);
  }

  playGame(gameIndex: number) {
    if (gameIndex >= this.games.length) return;

    this.resetBoard();
    const game = this.games[gameIndex];
    let currentPlayer = 'X';
    let moveIndex = 0;

    const makeMove = () => {
      if (moveIndex < game.moves.length) {
        const position = game.moves[moveIndex];
        this.cells[position] = currentPlayer;
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        moveIndex++;

        if (moveIndex === game.moves.length) {
          this.currentWinningLine = game.winningLine;
          setTimeout(() => {
            this.showWinner(game.winner, () => {
              setTimeout(() => {
                this.playGame(gameIndex + 1);
              }, 800);
            });
          }, 500);
        } else {
          setTimeout(makeMove, 300);
        }
      }
    };

    setTimeout(makeMove, 500);
  }

  resetBoard() {
    this.cells = Array(9).fill('');
    this.currentWinningLine = [];
  }

  isWinningCell(index: number): boolean {
    return this.currentWinningLine.includes(index);
  }

  showWinner(winner: string, callback: () => void) {
    const winnerElement = document.querySelector('.winner-message') as HTMLElement;
    const particles = document.querySelector('.particles') as HTMLElement;

    if (winnerElement) {
      winnerElement.textContent = `Player ${winner} Wins!`;
      winnerElement.classList.add('show');

      if (particles) {
        particles.classList.add('active');
        this.createParticles(winner);
      }

      setTimeout(() => {
        winnerElement.classList.remove('show');
        particles.classList.remove('active');
        callback();
      }, 1500);
    }
  }

  createParticles(winner: string) {
    const particles = document.querySelector('.particles');
    if (!particles) return;

    particles.innerHTML = '';
    const color = winner === 'X' ? '#8B4513' : '#D2691E';

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        --color: ${color};
        --x: ${Math.random() * 100}vw;
        --y: ${Math.random() * 100}vh;
        --delay: ${Math.random() * 1}s;
        --duration: ${1 + Math.random() * 1}s;
      `;
      particles.appendChild(particle);
    }
  }
}
