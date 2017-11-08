(function(window) { 'use strict'

	const HeaderBg = require('./homepage/header/_bg.js');
	const HeaderQuotes = require('./homepage/header/_quotes.js');
	const AgeCalculator = require('./homepage/_age.js');
	const GithubRepos = require('./homepage/_repos.js');

	const modules = [
		new HeaderBg(),
		new HeaderQuotes(),
		new GithubRepos('germanfr')
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
	});

})(window);
