import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <main id="main-content" class="fl-main">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styles: [],
  standalone: false,
})
export class AppComponent {
  title = 'frontline-client';

  constructor(
    private router: Router,
    private seo: SeoService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.handleRouteEvents();
  }

  private handleRouteEvents(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        const data = this.getRouteData(this.router.routerState.root);
        const title = (data['title'] as string) || 'Home';

        this.seo.update({
          title,
          description: data['description'] as string | undefined,
          url: event.urlAfterRedirects,
          jsonLd: data['jsonLd'] as Record<string, unknown> | Record<string, unknown>[] | undefined,
        });

        gtag('event', 'page_view', {
          page_title: title,
          page_path: event.urlAfterRedirects,
          page_location: this.document.location.href,
        });
      });
  }

  private getRouteData(route: ActivatedRoute): Record<string, unknown> {
    const data: Record<string, unknown> = { ...route.snapshot.data };
    if (route.firstChild) {
      return { ...data, ...this.getRouteData(route.firstChild) };
    }
    return data;
  }
}
