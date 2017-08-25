import { Component, OnInit } from '@angular/core';
import { AppService }        from '../../app.service';
import { Issue }        from '../../core/issue';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tasks : Issue[] =[];
    issues : Issue[] =[];

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

  getDate(issue){
    if(issue.ocurrences.length != 0 && issue.ocurrences[0].date)
      return issue.ocurrences[0].date;
    else
      return issue.date;
  }

}
