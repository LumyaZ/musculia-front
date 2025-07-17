import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-program-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './program-card.component.html',
  styleUrls: ['./program-card.component.scss']
})
export class ProgramCardComponent {
  @Input() program: any;
  @Output() cardClick = new EventEmitter<void>();
  @Output() assignWorkout = new EventEmitter<number>();
  @Input() isAssigned: boolean = false;

  getLevelIcon(level: string): string {
    switch ((level || '').toLowerCase()) {
      case 'débutant':
        return 'fa-seedling';
      case 'intermédiaire':
        return 'fa-person-running';
      case 'avancé':
        return 'fa-dumbbell';
      case 'tous niveaux':
        return 'fa-users';
      default:
        return 'fa-question-circle';
    }
  }
} 