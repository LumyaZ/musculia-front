import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-you',
  templateUrl: './you.component.html',
  styleUrls: ['./you.component.scss']
})
export class YouComponent implements OnInit {
  user: any;
  joinDate: Date = new Date(); // À remplacer par la vraie date d'inscription

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }
} 