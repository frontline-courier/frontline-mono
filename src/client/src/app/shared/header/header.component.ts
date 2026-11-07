import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  searchId = '';
  searchType = '1';

  constructor(private router: Router) {}

  submitSearch(event: Event): void {
    event.preventDefault();
    const id = this.searchId.trim();
    if (!id) {
      return;
    }
    this.router.navigate(['/track'], {
      queryParams: { id, track: this.searchType },
    });
  }
}
