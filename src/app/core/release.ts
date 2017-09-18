import { Issue }       from './issue';

export class Release {
	date: Date = new Date();
	issues: Issue[] = [];
}

