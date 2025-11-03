// home.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { GameModeModalComponent } from '../game-mode-modal/game-mode-modal';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  previewCells = ['X', 'O', 'X', 'O', 'X', '', 'O', '', ''];

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {}

  openGameModeModal(): void {
    const dialogRef = this.dialog.open(GameModeModalComponent, {
      width: '500px',
      panelClass: 'custom-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'start') {
        // الانتقال للعبة بدون بيانات في الـ state
        this.router.navigate(['/game']);
      }
    });
  }

  }
