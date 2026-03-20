import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { JhiNavbarComponent } from '../navbar/navbar.component';
import { JhiFooterComponent } from '../footer/footer.component';
import { JhiPageRibbonComponent } from '../../shared/page-ribbon/page-ribbon.component';
import { CarnivalWidgetComponent } from '../../shared/carnival-widget/carnival-widget.component';

@Component({
  selector: 'jhi-main',
  standalone: true,
  templateUrl: './main.component.html',
  imports: [CommonModule, RouterOutlet, JhiNavbarComponent, JhiFooterComponent, JhiPageRibbonComponent, CarnivalWidgetComponent],
})
export class MainComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Logic to initialize component
  }
}