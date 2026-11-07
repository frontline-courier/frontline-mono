import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-common',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './common.component.html',
  styleUrl: './common.component.scss',
})
export class CommonComponent {}
