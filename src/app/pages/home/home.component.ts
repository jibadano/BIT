import { Component, OnInit } from '@angular/core';
import { AppService }        from '../../app.service';
import { Issue }        from '../../core/issue';
import { Release }        from '../../core/release';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tasks : Issue[] =[];
  issues : Issue[] =[];
  releases : Release[] =[];
  deploys=[];
  newRelease : Release;
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
    this.services.exec("getReleases",{}).then(co=>{this.releases = co.data;});
    this.services.exec("getDeploys",{}).then(co=>{this.deploys = co.data;});

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

  initRelease(){
    this.newRelease = new Release();
  }

  cancelRelease(){
    this.newRelease = null;
  }

  addIssueRelease(issue){
    if(!this.containsIssue(issue))
      this.newRelease.issues.push(issue);
    else{
      var index = this.newRelease.issues.indexOf(issue);
      if (index != -1)
        this.newRelease.issues.splice(index, 1);
    }
  }

  addRelease(){
    this.services.exec("addRelease",{release:this.newRelease}).then(co=>{});
  }

  containsIssue(issue){
    return this.newRelease.issues.some((i)=>{
      return i._id == issue._id;
    });
  }


}
