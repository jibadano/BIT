import { User}       from './user';
export class Poll{

	_id: number = -1;
	question: string = 'this is the question, this is the question, this is the question, this is the question';
	date: Date = new Date();
	options: Option[] = [{desc:'opt1',users:[]},{desc:'opt2',users:[]},{desc:'opt3',users:[]}];
	owner: User;
	image: string;
	privacy: {public:Boolean, showResult: Boolean, users: User[]} = {public:true, showResult:true,users:[]};
	categories:any[];
}

export class Option{
	desc: string = '';
	users: User[] = [];
}