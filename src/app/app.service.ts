import { Component, Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router }    from '@angular/router';

import { User } from './model/user';
import { Co } from './core/co';
import { Error } from './core/error';

import './rxjs-extensions';

@Injectable()
export class AppService implements OnInit {
  user: User;
  nav: string = 'issues';
  environments : any;
  co: Co = new Co();
  constructor(private http: Http, public router:Router) {};

  ngOnInit() {
    this.loadScript("admin.js");
    this.co.err = new Error();
    
  }

  exec(serviceId: string, data: any): Promise<Co> {
    return this.http.post('/services', JSON.stringify({ serviceId: serviceId, data: data }))
      .toPromise()
      .then(co => this.co = co.json() as Co)
  }


  loadScript(script: string) {
    let node = document.createElement('script');
    node.src = 'assets/js/' + script;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

}