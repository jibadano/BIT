import { Environment }       from './environment';
import { ViewComponent }       from './view-component';
import { Service }       from './service';



export class Task {
	_id:number;
	title:string;

	issue:Boolean;
	assignee:string;
	reporter:string;
	branch:string;
	comment:string;
	resolution: string;
	ticket:string;

	date: Date;
	environment:Environment = new Environment();
	view:View = new View();
	cmm:CMM = new CMM();
	teradata:Teradata = new Teradata();
	bpm:BPM = new BPM();
	core:Core = new Core();
}

export class View {
	rules:Boolean = false;
	styles:Boolean = false;
	masks:Boolean = false;
	components: ViewComponent[] = [];

}

export class Teradata {
	storedProcedures:Service[] = [];
}

export class Core {
	services:Service[] = [];
}

export class CMM {
	services:Service[] = [];
	demands:any[] = [];
}

export class BPM {
	services:Service[] = [];
}