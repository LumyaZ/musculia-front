import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <button class="btn-primary">
          <i class="fas fa-edit"></i>
          Modifier le profil
        </button>
      </div>

      <div class="profile-content">
        <div class="profile-section">
          <h2><i class="fas fa-user-circle"></i> Informations de base</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Genre</label>
              <p>Non renseigné</p>
            </div>
            <div class="info-item">
              <label>Poids</label>
              <p>Non renseigné</p>
            </div>
            <div class="info-item">
              <label>Taille</label>
              <p>Non renseigné</p>
            </div>
          </div>
        </div>
        
        <div class="profile-section">
          <h2><i class="fas fa-dumbbell"></i> Entraînement</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Expérience</label>
              <p>Non renseigné</p>
            </div>
            <div class="info-item">
              <label>Fréquence</label>
              <p>Non renseigné</p>
            </div>
            <div class="info-item">
              <label>Durée des séances</label>
              <p>Non renseigné</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      width: 100%;
    }

    .profile-header {
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
    
    .profile-content {
      display: grid;
      gap: 1.5rem;
    }
    
    .profile-section {
      background: var(--gray);
      padding: 1.5rem;
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      
      h2 {
        margin: 0 0 1.5rem 0;
        font-size: 1.25rem;
        color: var(--white);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        
        i {
          color: var(--primary);
          font-size: 1.1em;
        }
      }
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    
    .info-item {
      label {
        display: block;
        color: var(--white-60);
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
      }
      
      p {
        margin: 0;
        color: var(--white);
        font-size: 1.1rem;
      }
    }
  `]
})
export class ProfileComponent {} 