import { Component, OnInit, Input} from '@angular/core';
import { AppService }        from '../../app.service';
import { Task, View, CMM, Teradata, Core, BPM }        from '../../core/task';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
    viewSearchResults = [];
    viewSearchTerm = "";
    cmmSearchResults = [];
    cmmSearchTerm = "";
    newDemand = "";
    newStoredProcedure = "";
    newBPMService = "";
    newCoreService = "";
    task = new Task();

    constructor( private services: AppService, private route: ActivatedRoute) {}

  ngOnInit() {
   this.route.params.subscribe(params => {
       let id = params['id']; 
       
       if(id)
        if(id=='issue')
          this.task.issue = true;
        else
          this.services.exec("getTask",{task:{_id:id}}).then(co=>{
            this.task = co.data;
          })
    });
  }

  reset(){
    this.task = new Task();
    this.viewSearchResults = [];
    this.viewSearchTerm = "";
  }

  done(){
    this.services.exec("addTask",{task:this.task}).then(co=>{
      this.services.router.navigate(['/']);
    });
  }

  remove(){
    this.services.exec("delTask",{task:this.task}).then(co=>{
      this.services.router.navigate(['/']);
    });
  }

  hasView(){
		return this.task.view.rules || this.task.view.styles || this.task.view.masks || this.task.view.components.length != 0; 
  }
  hasCMM(){
		return this.task.cmm.services.length != 0 || this.task.cmm.demands.length != 0; 
  }
  hasTeradata(){
		return this.task.teradata.storedProcedures.length != 0; 
  }
  hasCore(){
			return this.task.core.services.length != 0; 
  }
  hasBPM(){
			return this.task.bpm.services.length != 0; 
	}

cmmSearch(event:any, searchTerm:string){
      if(searchTerm && searchTerm != "" && event.keyCode != 27)
        this.services.exec('cmmSearch',{searchTerm:searchTerm}).then(co=>{
          if(!co.err)
            this.cmmSearchResults = co.data;
        })
      else{
          this.cmmSearchTerm = "";
          this.cmmSearchResults= [];
      }
}

addDemand(event:any){
  if(this.newDemand != "" && (!event || event.keyCode == 13)){
      this.task.cmm.demands.push(this.newDemand);
      this.newDemand = "";
  }
}

addStoredProcedure(event:any){
  if(this.newStoredProcedure != "" && (!event || event.keyCode == 13)){
      this.task.teradata.storedProcedures.push({name:this.newStoredProcedure, version:0});
      this.newStoredProcedure = "";
  }
}

addBPMService(event:any){
  if(this.newBPMService != "" && (!event || event.keyCode == 13)){
      this.task.bpm.services.push({name:this.newBPMService, version:0});
      this.newBPMService = "";
  }
}

addCoreService(event:any){
  if(this.newCoreService != "" && (!event || event.keyCode == 13)){
      this.task.core.services.push({name:this.newCoreService, version:0});
      this.newCoreService = "";
  }
}

removeDemand(demand){
  let index = this.task.cmm.demands.indexOf(demand)
  if(index != -1)
    this.task.cmm.demands.splice(index,1);
}

select(result){
    this.viewSearchTerm = "";
    this.viewSearchResults = [];
    let component = this.task.view.components.find(component=> {return component.nombre_concatenado == result.nombre_concatenado && component.componentType==result.componentType});
    if(!component){
      this.task.view.components.push(Object.assign({},result));
    }
    else{
      let index = this.task.view.components.indexOf(component)
      if(index != -1)
        this.task.view.components.splice(index,1);
    }
}

cmmSelect(result){
    this.cmmSearchTerm = "";
    this.cmmSearchResults = [];
    let service = this.task.cmm.services.find(service=> {return service.name == result.name});
    if(!service){
      this.task.cmm.services.push(Object.assign({},result));
    }
    else{
      let index = this.task.cmm.services.indexOf(service)
      if(index != -1)
        this.task.cmm.services.splice(index,1);
    }
}

 search(event:any, searchTerm:string){
      if(searchTerm && searchTerm != "" && event.keyCode != 27)
        this.services.exec('search',{searchTarget:['workflows','layouts'],searchTerm:searchTerm}).then(co=>{
          if(!co.err)
            this.viewSearchResults = co.data;
        })
      else{
          this.viewSearchTerm = "";
          this.viewSearchResults= [];
      }
    }
  
}
