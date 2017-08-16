export class User {
    _id: number;
	email: string;// = "jibadano@gmail.com";
	password: string;
	firstname: string;
	lastname: string;
	admin: boolean;
	groups:[{name: string, friends: User[]}];
	age: number;
	position: string;
	about: string;
	balanceRequest: number = 0;
	balance:number ;
}
