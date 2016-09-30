(function(window) { 'use strict'

	var ID_AGE = 'my-age',
	    ID_HEADER = 'header',
	    ID_HEADER_QUOTES = 'title-description',
		ID_HEADER_CURSOR = 'title-cursor',
		ID_HEADER_OVERLAY = 'header-bg-overlay',
		ID_PROJECTS_GALLERY = 'project-showcase';


	if ('complete' === document.readyState) {
		_main_interactive_();
		_main_complete_();
	} else if ('interactive' === document.readyState) {
		_main_interactive_();
		window.addEventListener('load', _main_complete_);
	} else {
		window.addEventListener('DOMContentLoaded', _main_interactive_);
		window.addEventListener('load', _main_complete_);
	}

	function _main_complete_() {
        preload_header();
		//enable_project_showcase();
		show_github_repos();
    }

	function _main_interactive_() {
		launch_cursor(ID_HEADER_QUOTES);
        show_age(1996, ID_AGE);
    }

    function show_age(birth, where) {
        var el = document.getElementById(where);
        el.textContent = get_age(birth);
    }
	// Returns your age based on your year of birth
    function get_age(year_of_birth) {
        var d = new Date();
        return d.getFullYear() - year_of_birth;
    }

	var quotes = [
		'Please, marry me',
		'I do things',
		'Oh, please, stop it',
		'Hello... human...',
		'I don\'t use to bite people',
		'Sometimes',
		'You know',
		'Life under construction'
	];

    function launch_cursor(where) {
        var desc_elem = document.getElementById(where);
		var rand = Date.now() % quotes.length;

		var cursor = document.createElement('span');
		cursor.id = ID_HEADER_CURSOR;
		cursor.textContent = '|';
		cursor.style.visibility = 'visible';

		var start = write_text.bind(null, quotes[rand], desc_elem, function () {
			desc_elem.appendChild(cursor);
	        setInterval(function() {
	            toggle_visibility(cursor);
	        }, 1000);
		}, 100, cursor.textContent);

		// Meant to be called on dom content loaded to erase ASAP,
		// but launch text on load because it is not visible before
		desc_elem.textContent = ' ';
		if(document.readyState !== 'complete') {
			window.addEventListener('load', start);
		} else {
			start();
		}
    }

	function write_text(text, context, callback, interval, cursor) {
		cursor = (typeof cursor === 'string') ? cursor.trim() : '';
		if(!text) return;

		var i = 1; // <-- Don't start with an empty string
		function write_internal() {
			if(i < text.length) {
				var t_delta = interval;
				if(text[i] === ',') {
					t_delta *= 2;
				} else if (text[i] === '.' || text[i] === '?') {
					t_delta *= 3;
				}
				// Use request animation frame to improve performance and reliability
				// Use a no-anonymous funcion so that it doesn't create copies.
				window.requestAnimationFrame(put_text_internal);
				function put_text_internal(t) {
					context.textContent = text.substr(0, i) + cursor;
				}

				i++;
				setTimeout(write_internal, t_delta);
			} else {
				context.textContent = text;
				if(typeof callback === 'function')
					callback(context);
			}
		}
		write_internal();
	}

    function toggle_visibility(el) {
        if('visible' === el.style.visibility){
			el.style.visibility = 'hidden';
		} else {
			el.style.visibility = 'visible';
		}
    }

    function preload_header() {
        var overlay, header = document.getElementById(ID_HEADER);
		var img = new Image();
		var css_bg, raw_url;

        css_bg = window.getComputedStyle(header).getPropertyValue('background-image');
        raw_url = css_bg && 'none' !== css_bg && get_raw_url(css_bg);

        if(raw_url){
			img.onload = function() {
	            overlay = document.getElementById(ID_HEADER_OVERLAY);
	            overlay.style.opacity = '0';
	            overlay.style.visibility = 'hidden';
	        }
			img.src = raw_url;
		}

    }

	function get_raw_url(url) {
        return url ? url.match(/(?:\(['|"]?)(.*?)(?:['|"]?\))/)[1] : null;
    }

	/*
	function enable_project_showcase() {
		var container = document.getElementById(ID_PROJECTS_GALLERY);
		var fragment = document.createDocumentFragment();

		var backButton = document.createElement('a');
		var forwardButton = document.createElement('a');
		backButton.className = 'controller back disabled';
		forwardButton.className = 'controller forward';
		fragment.appendChild(backButton);
		fragment.appendChild(forwardButton);

		container.appendChild(fragment);

		enable_controllers(container, backButton,forwardButton);
	}

	function enable_controllers(container, backButton, forwardButton) {
		var scrollable = container.querySelector('.gallery');
		var clickable = true;
		if(!is_touch_device())
			scrollable.style.overflowX = 'hidden';

		forwardButton.onclick = function(e) {
			if(!clickable) return false;
			e.preventDefault();
			e.stopPropagation();
			clickable = false;

			var base = scrollable.scrollLeft;
			var offset = scrollable.offsetWidth;
			smoothScroll(base + offset, null, on_scroll_stop, scrollable, true);
		};

		backButton.onclick = function(e) {
			if(!clickable) return false;
			e.preventDefault();
			e.stopPropagation();
			clickable = false;

			var base = scrollable.scrollLeft;
			var offset = scrollable.offsetWidth;
			smoothScroll(base - offset, null, on_scroll_stop, scrollable, true);
		};

		function on_scroll_stop() {
			clickable = true;
			if(is_scroll_start(scrollable)) {
				backButton.classList.add('disabled');
				forwardButton.classList.remove('disabled');
			} else if(is_scroll_end(scrollable)) {
				backButton.classList.remove('disabled');
				forwardButton.classList.add('disabled');
			} else { // It's in the middle
				backButton.classList.remove('disabled');
				forwardButton.classList.remove('disabled');
			}
		}

		function is_scroll_start(el) {
			return el.scrollLeft === 0;
		}

		function is_scroll_end(el) {
			return el.offsetWidth + el.scrollLeft >= el.scrollWidth;
		}

		function is_touch_device() {
			return 'ontouchstart' in window || navigator.maxTouchPoints;
		}
	}
	*/

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
