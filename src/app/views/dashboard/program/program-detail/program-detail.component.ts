import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-program-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './program-detail.component.html',
  styleUrls: ['./program-detail.component.scss']
})
export class ProgramDetailComponent {
  slug: string = '';
  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      this.slug = params['slug'];
    });
  }
  goBack() {
    this.router.navigate(['/dashboard/program']);
  }
} 