import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserProfileService } from '../../services/user-profile.service';
import { UserProfile } from '../../_models/user-profile.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-page',
  imports: [CommonModule],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  userProfile: UserProfile | null = null;

  constructor(private userProfileService: UserProfileService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
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

}
