(function(){ 'use-strict'

	const petri = require('petri-nodes');
	const HEADER_BACKGROUND_ID = 'header-background';

	function MyHeaderBg() {}

	MyHeaderBg.prototype = {
		load: function() {
			let header = document.getElementById(HEADER_BACKGROUND_ID);
			header.width = window.innerWidth;
			header.height = header.parentElement.offsetHeight;
			let dots = new petri.Petri(header, {
				dot_density: 0.3,
				with_cursor: true
			});
			dots.start();
			header.style.opacity = '1';
			window.addEventListener('resize',function() {
				dots.resize(window.innerWidth, header.parentElement.offsetHeight)
			});
		},

		load_on: function() {
			return 'complete';
		}
	};

	module.exports = MyHeaderBg;
})();
