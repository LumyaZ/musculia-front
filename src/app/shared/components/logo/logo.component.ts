import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-logo',
  template: `
    <a routerLink="/" class="logo">
      <span class="icon">💪</span>
      <span class="highlight">MUSC</span>ULIA
    </a>
  `,
  standalone: true,
  imports: [RouterModule]
})
export class LogoComponent {} 