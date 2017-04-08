(function(){

	const API_URL = 'https://api.github.com',
	      MEDIA_TYPE = 'application/vnd.github.v3+json';

	const STORAGE_KEY = 'github_user_repos',
	      STORAGE_TIMESTAMP_KEY = STORAGE_KEY + '_timestamp';
	const CACHED_REPOS_EXPIRE_TIME = 24; // in hours

	const REPO_CONTAINER_ID = 'project-container';
	const REPO_BASE_ID = 'project-elem',
	      REPO_TITLE_ID = REPO_BASE_ID + '-title',
	      REPO_DESCRIPTION_ID = REPO_BASE_ID + '-description',
	      REPO_META_ID = REPO_BASE_ID + '-meta',
	      REPO_LANG_ID = REPO_BASE_ID + '-language';


	function MyRepos(username) {
		this.username = username;
		this.repos = null;
	}

	MyRepos.prototype = {
		load: function() {
			try {
				this.repos = this._get_cached_data();
			} catch (e) {
				this._clear_cache();
				this.repos = null;
			}

			if(this.repos) {
				this._show_results();
			} else {
				this._download();
			}
		},

		load_on: function() {
			return 'interactive';
		},

		_download: function() {
			// --Fetch first page with a maximum number &per_page
			let params = '/users/' + this.username + '/repos?sort=updated';

			let request = new XMLHttpRequest();
			request.onload = () => {
				if (request.status === 200) { // Success
					let data = request.responseText;
					this._download_complete(JSON.parse(data));
				}
			};
			request.onerror = () => {
				console.error('Failed to fetch GitHub repositories for ' + this.username);
			};
			request.open('GET', API_URL + params, true);
			request.setRequestHeader('Accept', MEDIA_TYPE);
			request.send();
		},

		_download_complete: function(data) {
			this.repos = this._process_downloaded_data(data);
			this._cache_data(JSON.stringify(this.repos));
			this._show_results();
		},

		_process_downloaded_data: function(raw) {
			let repos = [];

			for(let i = 0; i < raw.length; ++i) {
				if(!raw[i].fork) {
					repos.push(raw[i]);
				}
			}
			this._sort_repos(repos);
			return repos;
		},

		_sort_repos: function(list) {
			list.sort(function(a,b) {
				return (2 * (b.stargazers_count + b.forks_count) + b.watchers_count) -
					   (2 * (a.stargazers_count + a.forks_count) + a.watchers_count);
			});
		},

		// Data may come in string format
		_cache_data: function(data) {
			if(!data) throw 'data is not defined';

			localStorage.setItem(STORAGE_KEY, data);
			localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now());
		},

		_get_cached_data: function() {
			let timestamp = parseInt(localStorage.getItem(STORAGE_TIMESTAMP_KEY));

			// Convert to ms. 1 hour = 3600000 ms
			// If defined less than X time ago
			if(timestamp >= Date.now() - CACHED_REPOS_EXPIRE_TIME * 3600000) {
				let data_str = localStorage.getItem(STORAGE_KEY);
				if(data_str)
					return JSON.parse(data_str);
			}

			return null;
		},

		_clear_cache: function() {
			localStorage.setItem(STORAGE_KEY, '');
			localStorage.setItem(STORAGE_TIMESTAMP_KEY, '0');
		},

		_show_results: function() {
			let fragment = document.createDocumentFragment();
			for(let i = 0; i < this.repos.length; ++i) {
				let element = this._create_repo_element(this.repos[i]);
				fragment.appendChild(element);
			}
			requestAnimationFrame(function() {
				document.getElementById(REPO_CONTAINER_ID).appendChild(fragment);
			});
			this.repos = null;
		},

		/*
		 *  <div class="repo-elem github">
		 *  	<a class="repo-elem-title">Title</a>
		 *  	<p class="repo-elem-description">description...</p>
		 *  	<div class="repo-elem-meta">
		 *  		<span class="repo-elem-language">Language</span>
		 *  		<a>Source</a><a>Website</a>
		 *  	</div>
		 *  </div>
		*/
		_create_repo_element: function(repo) {
			let container = document.createElement('div');
			container.className = REPO_BASE_ID + ' github';

			// Title element
			let title = document.createElement('a');
			title.className = REPO_TITLE_ID;
			title.href = repo.homepage || repo.html_url;
			title.textContent = repo.name;
			container.appendChild(title);

			// Description
			let description = document.createElement('p');
			description.className = REPO_DESCRIPTION_ID;
			description.textContent = repo.description;
			container.appendChild(description);

			// Meta & links footer
			let meta = document.createElement('div');
			meta.className = REPO_META_ID;

			let lang = document.createElement('span');
			lang.className = REPO_LANG_ID;
			lang.textContent = repo.language;
			meta.appendChild(lang);

			let source = document.createElement('a');
			source.href = repo.html_url;
			source.title = repo.full_name
			source.textContent = 'Source';
			meta.appendChild(source);

			if(repo.homepage) {
				let website = document.createElement('a');
				website.href = repo.homepage;
				website.textContent = 'Website';
				meta.appendChild(website);
			}
			container.appendChild(meta);
			return container;
		}
	};

	module.exports = MyRepos;
})();
