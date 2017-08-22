import { Component, OnInit, Input} from '@angular/core';
import { AppService }        from '../../app.service';
import { Issue, View, CMM, Teradata, Core, BPM }        from '../../core/issue';
import { ActivatedRoute } from '@angular/router';

declare var tinymce:any;
@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css']
})
export class IssueComponent implements OnInit {
    viewSearchResults = [];
    viewSearchTerm = "";
    cmmSearchResults = [];
    cmmSearchTerm = "";
    newDemand = "";
    newStoredProcedure = "";
    newBPMService = "";
    newCoreService = "";
    issue = new Issue();

    newOcurrence = {};
    coreServices = [];
    constructor( private services: AppService, private route: ActivatedRoute) {}

  ngOnInit() {
  //   tinymce.init({ selector:'textarea',elementpath: false,
  // file_browser_callback: function(field_name, url, type, win) {
  //   win.document.getElementById(field_name).value = 'my browser value';
  // } });
   this.route.params.subscribe(params => {
       let id = params['id']; 
       
       if(id)
        if(id=='issue')
          this.issue.issue = true;
        else
          this.services.exec("getIssue",{issue:{_id:id}}).then(co=>{
            this.issue = co.data;
          })
    });
  }

  reset(){
    this.issue = new Issue();
    this.viewSearchResults = [];
    this.viewSearchTerm = "";
  }

  done(){
    this.services.exec("addIssue",{issue:this.issue}).then(co=>{
      this.services.router.navigate(['/']);
    });
  }

  remove(){
    this.services.exec("delIssue",{issue:this.issue}).then(co=>{
      this.services.router.navigate(['/']);
    });
  }

  hasView(){
		return this.issue.view.rules || this.issue.view.styles || this.issue.view.masks || this.issue.view.components.length != 0; 
  }
  hasCMM(){
		return this.issue.cmm.services.length != 0 || this.issue.cmm.demands.length != 0; 
  }
  hasTeradata(){
		return this.issue.teradata.storedProcedures.length != 0; 
  }
  hasCore(){
			return this.issue.core.services.length != 0; 
  }
  hasBPM(){
			return this.issue.bpm.services.length != 0; 
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
      this.issue.cmm.demands.push(this.newDemand);
      this.newDemand = "";
  }
}

addStoredProcedure(event:any){
  if(this.newStoredProcedure != "" && (!event || event.keyCode == 13)){
      this.issue.teradata.storedProcedures.push({name:this.newStoredProcedure, version:0});
      this.newStoredProcedure = "";
  }
}

addBPMService(event:any){
  if(this.newBPMService != "" && (!event || event.keyCode == 13)){
      this.issue.bpm.services.push({name:this.newBPMService, version:0});
      this.newBPMService = "";
  }
}

addCoreService(event:any){
  if(this.newCoreService != "" && (!event || event.keyCode == 13)){
      this.issue.core.services.push({name:this.newCoreService, version:0});
      this.newCoreService = "";
  }
}

removeDemand(demand){
  let index = this.issue.cmm.demands.indexOf(demand)
  if(index != -1)
    this.issue.cmm.demands.splice(index,1);
}

select(result){
    this.viewSearchTerm = "";
    this.viewSearchResults = [];
    let component = this.issue.view.components.find(component=> {return component.nombre_concatenado == result.nombre_concatenado && component.componentType==result.componentType});
    if(!component){
      this.services.exec('cmmSearch',{}).then((co)=>{
          this.issue.view.components.push(Object.assign({},result));
          this.issue.cmm.services = this.issue.cmm.services.concat(co.data);
          for(let service of co.data){
            if(service.core)
              this.coreServices.push(service.core);
          }
      })
    }
    else{
      let index = this.issue.view.components.indexOf(component)
      if(index != -1)
        this.issue.view.components.splice(index,1);
    }
}

cmmSelect(result){
    this.cmmSearchTerm = "";
    this.cmmSearchResults = [];
    let service = this.issue.cmm.services.find(service=> {return service.name == result.name});
    if(!service){
      this.issue.cmm.services.push(Object.assign({},result));
    }
    else{
      let index = this.issue.cmm.services.indexOf(service)
      if(index != -1)
        this.issue.cmm.services.splice(index,1);
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
