import { StorageCacheManager } from './utils/storage';

const API = {
	url: 'https://api.github.com',
	mediaType: 'application/vnd.github.v3+json',
};

const REPOS_STORAGE_KEY = 'github-repos-cache';

export class GithubProfile {

	constructor(username) {
		this.username = username;
		this.cache = new StorageCacheManager();
	}

	repos() {
		return this.cache.get(REPOS_STORAGE_KEY, {
			fetch: this.fetchRepos.bind(this),
			isValid: repos => repos && repos.length > 0,
		});
	}

	async ownRepos() {
		// return this.repos();
		const githubPagesUrl = this.username + '.github.io';
		let repos = await this.repos();
		let filtered = [];
		for (let repo of repos) {
			if ((repo.stargazers_count || !repo.fork) && repo.name !== githubPagesUrl) {
				filtered.push(repo);
			}
		}
		return filtered;
	}

	async fetchRepos() {
		const url = API.url + '/users/' + this.username + '/repos?sort=updated';
		let json = [];
		try {
			let response = await fetch(url, {
				headers: {
					'Accept': API.mediaType,
				},
			});
			console.log(response);
			if (response.ok) {
				json = await response.json();
			} else {
				console.error("Failed to fetch", response);
			}
		} catch (e) {
			console.log(e)
		}
		return json;
	}

	async #fetchReposPage(page = 0) {
		const url = `${API.url}/users/${this.username}/repos?sort=updated&page=${parseInt(page)}`;
		let json = [];
		try {
			let response = await fetch(url, {
				headers: {
					'Accept': API.mediaType,
				},
			});
			console.log(response);
			if (response.ok) {
				json = await response.json();
			} else {
				console.error("Failed to fetch", response);
			}
		} catch (e) {
			console.log(e)
		}
		return json;
	}
}
