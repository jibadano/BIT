import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private services: AppService) { };
	ngOnInit(){
		 this.getEnvironments();
  }
  
  getEnvironments(){
    this.services.exec("getEnvironments",{}).then(co=>{
      this.services.environments = co.data;
       this.testEnvironments();
        setTimeout(()=>{
          this.testEnvironments();
        },10000);
    });
  }

  testEnvironments(){
      this.services.exec("testEnvironment", {url:this.services.environments.DESA.url}).then(co=>{
        this.services.environments.DESA.up = co.err == undefined;
      });
      this.services.exec("testEnvironment", {url:this.services.environments.TEST.url}).then(co=>{
        this.services.environments.TEST.up = co.err == undefined;
      });
      this.services.exec("testEnvironment", {url:this.services.environments.HOMO.url}).then(co=>{
        this.services.environments.HOMO.up = co.err == undefined;
      });
      this.services.exec("testEnvironment", {url:this.services.environments.PROD.url}).then(co=>{
        this.services.environments.PROD.up = co.err == undefined;
      });
  }
}