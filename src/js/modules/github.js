import { StorageCacheManager } from '../utils/storage';

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
			// Return only relevat repositories
			if ((repo.stargazers_count || !repo.fork) && repo.name !== githubPagesUrl && !repo.archived) {
				filtered.push(repo);
			}
		}
		return filtered.sort(GithubProfile.#compareRepos);
	}

	async fetchRepos() {
		let repos = await this.#fetchReposPage(1);
		if (repos && repos.length === 100) {
			let page2 = await this.#fetchReposPage(2);
			repos = [ ...repos, ...page2 ];
		}
		console.log('repos', repos);
		return repos;
	}

	async #fetchReposPage(page = 1) {
		const url = `${API.url}/users/${this.username}/repos?sort=updated&per_page=100&page=${parseInt(page)}`;
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

	static #compareRepos(a, b) {
		if (b.stargazers_count > a.stargazers_count) {
			return 1;
		} else if (b.stargazers_count < a.stargazers_count) {
			return -1;
		}

		if (b.forks_count > a.forks_count) {
			return 1;
		} else if (b.forks_count < a.forks_count) {
			return -1;
		}

		if (b.watchers_count > a.watchers_count) {
			return 1
		} else if (b.watchers_count < a.watchers_count) {
			return -1;
		}

		if (b.updated_at > a.updated_at) {
			return 1;
		} else if (b.updated_at < a.updated_at) {
			return -1;
		}

		return 0;
	}
}
