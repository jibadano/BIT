import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../app.service';
import { Issue, View, Ocurrence } from '../../core/issue';
import { ActivatedRoute } from '@angular/router';

//declare var tinymce:any;
declare var $: any;
@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css']
})
export class IssueComponent implements OnInit {
  viewSearchResults = [];
  viewSearchTerm = "";

  issue = new Issue();



  newOcurrence : Ocurrence = null;
  coreServices = [];
  cmmServices = [];
  currentOcurrence = new Ocurrence();

  constructor(private services: AppService, private route: ActivatedRoute) { }
  now(){
    return new Date();
  }

  ngOnInit() {
    // tinymce.init({ selector:'#resolution',elementpath: false});
    this.route.params.subscribe(params => {
      let id = params['id'];

      if (id)
        if (id == 'task')
          this.issue.task = true;
        else
          this.services.exec("getIssue", { issue: { _id: id } }).then(co => {
            if (co.data)
              this.issue = co.data;
          })
    });
  }

  reset() {
    this.issue = new Issue();
    this.viewSearchResults = [];
    this.viewSearchTerm = "";
  }

  //ISSUE

  done(){
    if (this.issue._id) 
      this.services.exec("updIssue", { issue: this.issue }).then(co => {

      });
    else
      this.services.exec("addIssue", { issue: this.issue }).then(co => {
        this.services.router.navigate(['/']);
      });
  }

  remove(){
    this.services.exec("delIssue", { issue: this.issue }).then(co => {
      this.services.router.navigate(['/']);
    });
  }


  //OCURRENCES

  addNewOcurrence(){
    this.newOcurrence = new Ocurrence();
  }

  removeOcurrence(ocurrence) {
    var index = this.issue.ocurrences.indexOf(ocurrence);
    if (index != -1)
      this.issue.ocurrences.splice(index, 1);
  }

  removeImage(ocurrence, image) {
    var index = ocurrence.images.indexOf(image);
    if (index != -1)
      ocurrence.images.splice(index, 1);
  }


  uploadImage(ocurrence) {
    this.currentOcurrence = ocurrence;
    $('input[type=file]').click();
  }

  previewFile() {
    var file = $('input[type=file]')[0].files[0]; //sames as here
    var reader = new FileReader();
    var ocurrence = this.currentOcurrence;

    reader.onloadend = function () {
      ocurrence.images.push(reader.result);
    }

    if (file)
      reader.readAsDataURL(file);
  }

  //PASAJE

  select(result) {
    this.viewSearchTerm = "";
    this.viewSearchResults = [];
    let component = this.issue.view.components.find(component => { return component.nombre_concatenado == result.nombre_concatenado && component.componentType == result.componentType });
    if (!component) {
      this.services.exec('searchServices', { component: result }).then((co) => {
        let newComp = Object.assign({}, result);
        newComp.cmm = [];
        if (co.data) {
          newComp.cmm = newComp.cmm.concat(co.data);
          this.addServices(co.data);
        }
        this.issue.view.components.push(newComp);

      })
    }
    else {
      let index = this.issue.view.components.indexOf(component)
      if (index != -1)
        this.issue.view.components.splice(index, 1);
    }
  }

  addServices(services) {
    this.cmmServices = this.cmmServices.concat(services);
    for (let service of services) {
      if (service.core)
        this.coreServices.push(service.core);
      else
        this.addServices(service.canonicals);
    }
  }

  search(event: any, searchTerm: string) {
    if (searchTerm && searchTerm != "" && event.keyCode != 27)
      this.services.exec('search', { searchTarget: ['workflows', 'layouts'], searchTerm: searchTerm }).then(co => {
        if (!co.err)
          this.viewSearchResults = co.data;
      })
    else {
      this.viewSearchTerm = "";
      this.viewSearchResults = [];
    }
  }

}


