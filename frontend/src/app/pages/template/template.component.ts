import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobalStatusService } from '../../services/global-status.service';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './template.component.html',
  styleUrl: './template.component.css',
})
export class TemplateComponent {
  constructor(private globalStatusService: GlobalStatusService) {}

  isLoading(): boolean {
    return this.globalStatusService.isLoading();
  }
}
