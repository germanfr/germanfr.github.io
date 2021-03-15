import { BrowserCacheManager } from '../cache';

const API = {
	url: process.env.PROFILE_API_URL,
	mediaType: 'application/json',
};

const GITHUB_API = {
	url: 'https://api.github.com',
	mediaType: 'application/vnd.github.v3+json'
}


const STORAGE_KEYS = {
	repos: 'github-repos-cache',
	ownRepos: 'github-own-repos-cache',
	contributions: 'github-contributions-cache',
	yearContributions: year => `github-contributions-${year}-cache`,
};

const REPOS_BLACKLIST = [
	'gh-pages-backend', // The backend of this same website
];

export class GithubProfile {
	constructor(username) {
		this.username = username;
		this.cache = new BrowserCacheManager();
	}

	repos() {
		return this.cache.get(STORAGE_KEYS.repos, {
			fetch: this.#fetchRepos.bind(this),
			isValid: repos => repos && repos.length > 0,
		});
	}

	async ownRepos() {
		// return this.repos();
		const githubPagesUrl = this.username + '.github.io';
		let repos = await this.repos();
		let filtered = [];

		for (let repo of repos) {
			if (repo.fork && repo.stargazers_count === 0)
				continue;
			if (repo.name === githubPagesUrl || REPOS_BLACKLIST.includes(repo.name))
				continue;
			if (repo.archived)
				continue;

			// Return only relevat repositories
			filtered.push(repo);
		}
		return filtered.sort(GithubProfile.#compareRepos);
	}

	contributions() {
		return this.cache.get(STORAGE_KEYS.contributions, {
			fetch: this.#fetchContributions.bind(this),
			isValid: contribs => contribs && Object.keys(contribs).length > 0,
		});
	}

	yearContributions(year) {
		return this.cache.get(STORAGE_KEYS.yearContributions(year), {
			fetch: this.#fetchYearContributions.bind(this, year),
			isValid: contribs => contribs?.repositories?.length > 0,
		});
	}

	async #fetchRepos() {
		let repos = await this.#fetchReposPage(1);
		if (repos && repos.length === 100) {
			let page2 = await this.#fetchReposPage(2);
			repos = [ ...repos, ...page2 ];
		}
		return repos;
	}

	async #fetchReposPage(page = 1) {
		const url = `${GITHUB_API.url}/users/${this.username}/repos?sort=updated&per_page=100&page=${parseInt(page)}`;
		let json = [];
		try {
			let response = await fetch(url, {
				headers: {
					'Accept': GITHUB_API.mediaType,
				},
			});
			if (response.ok) {
				json = await response.json();
			} else {
				console.error("Failed to fetch", response);
			}
		} catch (e) {
			console.error(e)
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

	#fetchContributions() {
		const url = `${API.url}/contributions`;
		return this.#apiFetch(url);
	}

	#fetchYearContributions(year) {
		const url = `${API.url}/contributions/${parseInt(year)}`;
		return this.#apiFetch(url);
	}

	async #apiFetch(url) {
		let json = null;
		try {
			let response = await fetch(url, {
				headers: {
					'Accept': API.mediaType,
				},
			});
			if (response.ok) {
				json = await response.json();
			} else {
				console.error("Failed to fetch", response);
			}
		} catch (e) {
			console.error(e)
		}
		return json;
	}
}
