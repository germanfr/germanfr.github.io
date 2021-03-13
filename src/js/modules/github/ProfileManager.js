import { GithubProfile } from './GithubProfile';


const instances = {}; // static

export class ProfileManager {
	static get(username, ...rest) {
		return instances[username] ?? new GithubProfile(username, ...rest);
	}
}
