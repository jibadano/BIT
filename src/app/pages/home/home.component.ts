import { Component, OnInit } from '@angular/core';
import { AppService }        from '../../app.service';
import { Task }        from '../../core/task';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tasks : Task[] =[];
    issues : Task[] =[];

  nav: string = 'issues';
  constructor( private services: AppService) {}
  ngAfterViewInit(){
    
  }
  ngOnInit(){
    this.services.loadScript("admin.js");
    this.services.loadScript("demo.js");
    this.services.exec("getTasks",{}).then(co=>this.tasks = co.data);
    this.services.exec("getIssues",{}).then(co=>this.issues = co.data);

  }

}
