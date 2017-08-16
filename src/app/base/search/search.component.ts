import { Component, OnInit , Input, Output, EventEmitter} from '@angular/core';
import { AppService}       from '../../app.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent{

 isOpen:boolean = false;
    searchResults : any = {desa:[]};
    searchTerm: String = "";
    selectedResults : any[];
    @Input('selected') set selected(selected:any[]){
      this.selectedResults = selected;
    }
    @Input() searchTarget: String[] = ['workflows','layouts','users'];

    constructor( private services: AppService) {}

    @Output() result: EventEmitter<any> = new EventEmitter();

    getVersion(name,env){
      if(this.searchResults.test && env == 'TEST'){
        let comp = this.searchResults.test.find((c)=>{return c.name == name});
        if (comp) return comp.version;
      }
      if(this.searchResults.homo && env == 'HOMO'){
        let comp = this.searchResults.homo.find((c)=>{return c.name == name});
        if (comp) return comp.version;
      }
      if(this.searchResults.prod && env == 'PROD'){
        let comp = this.searchResults.prod.find((c)=>{return c.name == name});
        if (comp) return comp.version;
      }
        
    }

    open(){
      this.isOpen = true;
    }

    close(){
      this.searchResults=[]; 
      this.searchTerm = "";
      this.isOpen = false;
    }

    remove(selected){
      let i = this.selectedResults.findIndex(val=>selected.desc == val.desc);
      if(i>-1)
        this.selectedResults.splice(i,1);
    }

    done(){
      this.result.emit(this.selectedResults);
      this.close();
    }

    search(event:any, searchTerm:string){
      if(searchTerm && searchTerm != "" && event.keyCode != 27)
        this.services.exec('search',{searchTarget:this.searchTarget,searchTerm:searchTerm}).then(co=>{
          if(!co.err)
            this.searchResults = co.data;
        })
      else
        if( event.keyCode == 27)
          this.close();
        else 
          this.searchResults= [];
    }

}
