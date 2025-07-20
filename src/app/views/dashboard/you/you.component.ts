import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressComponent } from './progress/progress.component';
import { ActivityComponent } from './activity/activity.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-you',
  standalone: true,
  imports: [CommonModule, ProgressComponent, ActivityComponent],
  templateUrl: './you.component.html',
  styleUrls: ['./you.component.scss']
})
export class YouComponent {
  user: any;
  joinDate: Date = new Date();
  selectedTab: 'progress' | 'activity' = 'progress';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

  selectTab(tab: 'progress' | 'activity') {
    this.selectedTab = tab;
  }
} 