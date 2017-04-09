(function(window) {

	const lunr = require('../../lib/lunr.min.js');

	var store = window.search_store;

	switch (document.readyState) {
		case 'interactive':
		case 'complete':
			commit_search();
			break;
		default:
			window.addEventListener('DOMContentLoaded', commit_search);
	}

	function post_summary(post) {
		var article = document.createElement('article');
			article.className = 'post-summary';
			var header = document.createElement('header');
				var title = document.createElement('h2');
					var title_link = document.createElement('a');
						title_link.href = post.url;
						title_link.title = post.title;
						title_link.textContent = post.title;
					title.appendChild(title_link);
				header.appendChild(title);
				var date = document.createElement('span');
					date.className = 'date';
					date.textContent = post.date;
				header.appendChild(date);
			article.appendChild(header);
			var summary = document.createElement('div');
				summary.innerHTML = post.excerpt;
			article.appendChild(summary);
			var footer = document.createElement('footer');
				var tags = build_tags(post.tags);
				tags && footer.appendChild(tags);
			article.appendChild(footer);
		return article;
	}

	function build_tags(tag_list) {
		var len = tag_list.length
		if(len <= 0)
			return;

		var tags = document.createElement('div');
		tags.className = 'tags';
		tags.textContent = 'Tags: ';

		for(var i=0; i<len && i<6; i++) {
			tags.innerHTML += '<a>' + tag_list[i] + '</a>'; // TODO
		}
		return tags;
	}

	// Puts the results into the DOM
	function show_results(results, store) {
		var results_container = document.getElementById('search-results');
		var results_number_container = document.createElement('div');
		if(results && results.length > 0) {
			var results_str = results.length + (results.length > 1 ? ' results' : ' result') + ' found';
			results_number_container.appendChild(document.createTextNode(results_str));
			var elems = document.createDocumentFragment();
			for(var i=0; i<results.length; i++) {
				elems.appendChild(post_summary(store[results[i].ref]));
			}
			results_container.appendChild(results_number_container);
			results_container.appendChild(elems);
		} else {
			var no_results = document.createTextNode('No results found');
			results_number_container.appendChild(no_results);
			results_container.appendChild(results_number_container);
		}
	}

	function getQueryVariable(variable) {
		var query = window.location.search.substring(1);
		var vars = query.split('&');

		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');

			if (pair[0] === variable) {
				return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
			}
		}
	}

	function commit_search() {
		var searchTerm = getQueryVariable('term');
		var results = null;

		document.getElementById('search-box').setAttribute('value', searchTerm || '');

		if (searchTerm) {
			// Initalize lunr with the fields it will be searching on. I've given title
			// a boost of 10 to indicate matches on this field are more important.
			var idx = lunr(function () {
				this.field('id');
				this.field('title', { boost: 10 });
				this.field('category');
				this.field('tags');
				this.field('content');
			});

			for (var key in store) { // Add the data to lunr
				idx.add({
					'id': key,
					'title': store[key].title,
					'category': store[key].category,
					'tags': store[key].tags.join(' '),
					'content': store[key].content
				});
			}
			results = idx.search(searchTerm); // Get lunr to perform a search
		}
		show_results(results, store);
	}
})(window);
