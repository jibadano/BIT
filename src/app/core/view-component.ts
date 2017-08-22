export class ViewComponent {
	nombre_concatenado:string;
	componentType:string;
	version:number;
	cmm:CMM[] = []; 
}

export class CMM {
	name:string;
	core:Core;
	canonicals:CMM[];
}


export class Core {
	name:string;
	origin:string;
}