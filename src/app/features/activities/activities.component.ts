import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="activities-container">
      <div class="activities-header">
        <button class="btn-primary">
          <i class="fas fa-plus"></i>
          Nouvelle activité
        </button>
      </div>

      <div class="activities-list">
        <div class="activity-card empty-state">
          <i class="fas fa-dumbbell empty-icon"></i>
          <p>Aucune activité pour le moment</p>
          <p class="empty-subtitle">Commencez par créer votre première activité</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .activities-container {
      width: 100%;
    }
    
    .activities-header {
      margin-bottom: 1.5rem;
      display: flex;
      justify-content: flex-end;
    }
    
    .btn-primary {
      background: var(--primary);
      color: var(--white);
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: var(--border-radius);
      cursor: pointer;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      i {
        font-size: 1rem;
      }
      
      &:hover {
        background: var(--primary-dark);
      }
    }
    
    .activities-list {
      display: grid;
      gap: 1rem;
    }
    
    .activity-card {
      background: var(--gray);
      padding: 2rem;
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      
      &.empty-state {
        text-align: center;
        
        .empty-icon {
          font-size: 3rem;
          color: var(--primary);
          margin-bottom: 1rem;
          opacity: 0.5;
        }
        
        p {
          margin: 0;
          color: var(--white);
          font-size: 1.1rem;
          
          &.empty-subtitle {
            color: var(--white-60);
            font-size: 0.9rem;
            margin-top: 0.5rem;
          }
        }
      }
    }
  `]
})
export class ActivitiesComponent {} 