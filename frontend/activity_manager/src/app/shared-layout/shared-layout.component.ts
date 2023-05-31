import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faBars,faEnvelope} from '@fortawesome/free-solid-svg-icons';
import {faGithub,faLinkedin} from '@fortawesome/free-brands-svg-icons'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-shared-layout',
  templateUrl: './shared-layout.component.html',
  styleUrls: ['./shared-layout.component.css'],
})
export class SharedLayoutComponent implements OnInit {
  // FontAwesome
  faBars = faBars;
  faEnvelope =faEnvelope;
  faGithub =faGithub;
  faLinkedin = faLinkedin

  mobile!:Boolean
  options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  today = new Date().toLocaleDateString('en-US',{ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  year =new Date().getFullYear()
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef;
  constructor(
    private offCanvasService: NgbOffcanvas,
    private bpointObserver: BreakpointObserver
  ) {}

  openCanvas(canvas: any) {
    this.offCanvasService.open(canvas, { scroll: true, backdrop: false });
  }

  closeCanvas(canvas: any) {
    this.offCanvasService.dismiss(canvas);
  }
  ngOnInit(): void {
    const isMobile = this.bpointObserver.observe([Breakpoints.Handset]);
    isMobile.subscribe((result) => {
      this.mobile = result.matches;
    });
  }
}
