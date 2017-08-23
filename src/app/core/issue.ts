import { Environment }       from './environment';
import { ViewComponent }       from './view-component';
import { Service }       from './service';



export class Issue {
	_id:string;
	title: string;
	assignee:string;
	resolution: string;
	date: Date;
	ocurrences:Ocurrence[] = [];
	ticket:string;
	task:boolean;
	environments: [string];
	view:View = new View();
}

export class View {
	rules:Boolean = false;
	styles:Boolean = false;
	masks:Boolean = false;
	components: ViewComponent[] = [];
	
}




export class Ocurrence{
	date:Date;
	reporter:string;
	branch:string;
	time:string;
	user:string;
	customer:string;
	desc:string;
	images:string[] = [];
}