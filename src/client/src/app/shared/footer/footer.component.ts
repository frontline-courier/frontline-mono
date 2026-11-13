import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  EXAFUL_LINK_DOMAIN,
  buildExafulCreditUrl,
  trackOutboundClick,
} from '../../utils/footer-credit';

const SITE_DOMAIN = 'frontlinecourier.com';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
  readonly creditLabel = 'Built by Exaful';
  readonly creditUrl = buildExafulCreditUrl(SITE_DOMAIN);

  onCreditClick(): void {
    trackOutboundClick({
      link_url: this.creditUrl,
      link_domain: EXAFUL_LINK_DOMAIN,
      link_text: this.creditLabel,
      outbound: true,
    });
  }
}
