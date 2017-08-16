import { Component, OnInit } from '@angular/core';
import { Environment }       from '../../core/environment';
import { AppService }        from '../../app.service';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.css']
})
export class EnvironmentComponent implements OnInit {
  constructor( private services: AppService) {}

  ngOnInit() {

  }


}
