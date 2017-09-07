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
  dayDelay : number = 24*60*60*1000;
  firstDelay : number = 3*this.dayDelay;
  secondDelay : number = 7*this.dayDelay;
  nav: string = 'issues';
  loading:boolean = true;
  show:boolean = false;
  constructor( private services: AppService) {}

  ngOnInit(){
    this.services.exec("getTasks",{}).then(co=>{this.tasks = co.data});
    this.services.exec("getIssues",{}).then(co=>{this.issues = co.data; this.loading = false;this.animate()});
  }

  animate(){
    this.show=false;
    setTimeout(()=>this.show=true,200)
  }

  getDelay(issue){
    return new Date().getTime() - Date.parse(this.getDate(issue));
  }

  getDate(issue){

    if(issue)
      if(issue.ocurrences.length != 0 && issue.ocurrences[0].date)
        return issue.ocurrences[0].date;
      else
        return issue.date;
    
    return new Date();
  }

}
