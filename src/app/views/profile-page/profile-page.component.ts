import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { UserProfileService } from '../../services/user-profile.service';
import { UserProfile } from '../../_models/user-profile.model';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { ProfileModalComponent, ModalType } from '../../components/profile-modal/profile-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-page',
  imports: [CommonModule, NavBarComponent, ProfileModalComponent],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {

  userProfile: UserProfile | null = null;
  modalType: ModalType = 'basic';
  @ViewChild(ProfileModalComponent) profileModal!: ProfileModalComponent;
  private refreshSubscription?: Subscription;

  constructor(
    private userProfileService: UserProfileService,
    private cdr: ChangeDetectorRef,
    private translationService: TranslationService
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
    
    // S'abonner aux mises à jour du profil
    this.refreshSubscription = this.userProfileService.refreshNeeded$.subscribe(() => {
      this.loadUserProfile();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  private loadUserProfile(): void {
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        const userId = userData.id;

        if (userId) {
          this.userProfileService.getProfileByUserId(userId).subscribe({
            next: (profile) => {
              this.userProfile = profile;
              this.cdr.markForCheck();
              this.cdr.detectChanges();
            },
            error: (error) => {
              console.error('Error loading user profile:', error);
            }
          });
        } else {
          console.error('User ID not found in localStorage user data.');
        }
      } catch (e) {
        console.error('Failed to parse user data from localStorage:', e);
      }
    } else {
      console.error('User data not found in localStorage.');
    }
  }

  getInitials(): string {
    if (!this.userProfile?.authUser?.email) {
      return 'U';
    }
    return this.userProfile.authUser.email.substring(0, 2).toUpperCase();
  }

  getTranslatedGender(gender: string | undefined): string {
    return this.translationService.translateGender(gender as any);
  }

  getTranslatedGoal(goal: string | undefined): string {
    return this.translationService.translateGoal(goal as any);
  }

  getTranslatedTrainingPreference(preference: string | undefined): string {
    return this.translationService.translateTrainingPreference(preference as any);
  }

  openModal(type: ModalType) {
    if (this.userProfile && this.profileModal) {
      this.profileModal.modalType = type;
      this.profileModal.show(this.userProfile);
    }
  }
}
