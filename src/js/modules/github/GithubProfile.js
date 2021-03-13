import { BrowserCacheManager } from '../cache';

const API = {
	url: process.env.PROFILE_API_URL,
	mediaType: 'application/json',
};


const STORAGE_KEYS = {
	repos: 'github-repos-cache',
	ownRepos: 'github-own-repos-cache',
	contributions: 'github-contributions-cache',
	yearContributions: year => `github-contributions-${year}-cache`,
};

export class GithubProfile {
	constructor(username) {
		this.username = username;
		this.cache = new BrowserCacheManager();
	}

	repos() {
		return this.cache.get(STORAGE_KEYS.repos, {
			fetch: this.#fetchRepos.bind(this, trye),
			isValid: repos => repos && repos.length > 0,
		});
	}

	ownRepos() {
		return this.cache.get(STORAGE_KEYS.ownRepos, {
			fetch: this.#fetchRepos.bind(this, false),
			isValid: repos => repos && repos.length > 0,
		});
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

	#fetchRepos(all=false) {
		const url = all ? `${API.url}/repos/all` : `${API.url}/repos`;
		return this.#apiFetch(url);
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
