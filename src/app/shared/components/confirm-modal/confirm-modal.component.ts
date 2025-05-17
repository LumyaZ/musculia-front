import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
        <div class="modal-actions">
          <button class="btn-secondary" (click)="onCancel()">Annuler</button>
          <button class="btn-primary" (click)="onConfirm()">Confirmer</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      padding: 1rem;
    }

    .modal-content {
      background: var(--gray);
      border-radius: var(--border-radius);
      padding: 1.5rem;
      max-width: 400px;
      width: 100%;
      box-shadow: var(--box-shadow);

      h2 {
        margin: 0 0 1rem 0;
        font-size: 1.25rem;
        color: var(--white);
      }

      p {
        margin: 0 0 1.5rem 0;
        color: var(--white-60);
      }
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;

      button {
        padding: 0.75rem 1.5rem;
        border-radius: var(--border-radius);
        border: none;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;

        &.btn-secondary {
          background: transparent;
          color: var(--white);
          border: 1px solid var(--white-60);

          &:hover {
            border-color: var(--white);
          }
        }

        &.btn-primary {
          background: var(--primary);
          color: var(--white);

          &:hover {
            background: var(--primary-dark);
          }
        }
      }
    }
  `]
})
export class ConfirmModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() message = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
} 