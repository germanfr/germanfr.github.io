(function(){ 'use-strict'

	const petri = require('petri-nodes');
	const HEADER_BACKGROUND_ID = 'header-background';

	function MyHeaderBg() {}

	MyHeaderBg.prototype = {
		load: function() {
			let header = document.getElementById(HEADER_BACKGROUND_ID);
			let parent = header.parentElement;
			header.width = parent.clientWidth;
			header.height = parent.clientHeight;

			let dots = new petri.Petri(header, {
				dot_density: 0.3,
				with_cursor: true
			});
			dots.start();
			header.style.opacity = '1';

			window.addEventListener('resize', function() {
				dots.resize(parent.clientWidth, parent.clientHeight);
			});
			window.addEventListener('load', function() {
				if(parent.clientHeight !== header.height)
					dots.resize(parent.clientWidth, parent.clientHeight);
			});
		},

		load_on: function() {
			return 'interactive';
		}
	};

	module.exports = MyHeaderBg;
})();
