(function(window) { 'use strict'

	const ID_AGE = 'my-age', ID_PROJECTS_GALLERY = 'project-showcase';


	const HeaderBg = require('./homepage/header/_bg.js');
	const HeaderQuotes = require('./homepage/header/_quotes.js');
	const AgeCalculator = require('./homepage/_age.js');

	const modules = [
		new HeaderBg(),
		new HeaderQuotes(),
		new AgeCalculator('1996/05')
	];

	function load_modules(state) {
		for(let i = 0; i < modules.length; ++i) {
			try {
				if(modules[i].load_on() === state) {
					modules[i].load();
				}
			} catch (e) {
				console.error(e);
			}
		}
	}

	window.addEventListener('DOMContentLoaded', function() {
		load_modules('interactive');
	});

	window.addEventListener('load', function() {
		load_modules('complete');
		requestAnimationFrame(show_github_repos);
	});

	function get_raw_url(url) {
        return url ? url.match(/(?:\(['|"]?)(.*?)(?:['|"]?\))/)[1] : null;
    }

	function show_github_repos(where_id) {
		var MAX_DAYS_CACHE = 1;
		load_repos(MAX_DAYS_CACHE, function(repos) {
			sort_repos(repos);
			var fragment = document.createDocumentFragment();
			var repo;
			for(var i=0; i<repos.length; i++) {
				repo = repos[i];
				if(!repo.fork)
					fragment.appendChild(new_repo_elem(repo));
			}
			document.getElementById(ID_PROJECTS_GALLERY).appendChild(fragment);
		});
	}

	function sort_repos(list) {
		list.sort(function(a, b) {
			return (2 * (b.stargazers_count + b.forks_count) + b.watchers_count) -
			       (2 * (a.stargazers_count + a.forks_count) + a.watchers_count);
		});
	}

	function new_repo_elem(repo) {
		var container = document.createElement('div');
			container.className = 'grid-elem github';
			var title = document.createElement('a');
				title.className = 'title';
				title.href = repo.homepage || repo.html_url;
				title.textContent = repo.name;
			container.appendChild(title);
			var description = document.createElement('p');
				description.className = 'description';
				description.textContent = repo.description;
			container.appendChild(description);
			var meta = document.createElement('div');
				meta.className = 'meta';
				var lang = document.createElement('span');
					lang.className = 'language';
					lang.textContent = repo.language;
				meta.appendChild(lang);
				var source = document.createElement('a');
					source.href = repo.html_url;
					source.textContent = 'Source';
				meta.appendChild(source);
				if(repo.homepage) {
					var website = document.createElement('a');
					website.href = repo.homepage;
					website.title = repo.name;
					website.textContent = 'Website';
					meta.appendChild(website);
				}
			container.appendChild(meta);
		return container;
	}

	function load_repos(max_days, callback) {
		var data_storage_id = 'github_user_repos';
		var data = load_cached_repos(data_storage_id, max_days);
		if(data) {
			callback(data);
		} else {
			try {
				download_repos(data_storage_id, callback);
			} catch(e) {
				callback(data);
			}
		}
	}

	function download_repos(where_id, callback) {
		var request = new XMLHttpRequest();
		var github_url = 'https://api.github.com';
		var params = '/users/germanfr/repos?sort=updated'; // --Fetch first page with a maximum number &per_page--

		request.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				save_cache_repos(where_id, this.responseText)
				callback(JSON.parse(this.responseText));
				console.log(JSON.parse(this.responseText));
			}
		};
		request.open('GET', github_url+params, true);
		request.setRequestHeader('Accept', 'application/vnd.github.v3+json');
		request.send(null);
	}

	function load_cached_repos(where_id, max_days) {
		if(max_days < 0.5) return null;

		var data = null;
		var timestamp = localStorage.getItem(where_id + '_timestamp');
		var now = Date.now();

		// 86400000 = 24 * 60 * 60 * 1000 = 1 day
		// If defined less than `max_days days ago
		if(timestamp && parseInt(timestamp) >= now - max_days * 86400000) {
			var data_string = localStorage.getItem(where_id);
			if(data_string)
				data = JSON.parse(data_string);
		}
		return data;
	}

	function save_cache_repos(where_id, data) {
		if(!data)
			throw new ReferenceError('\'data\' is not defined');

		localStorage.setItem(where_id, data);
		localStorage.setItem(where_id + '_timestamp', Date.now());
	}

})(window);
