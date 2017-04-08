(function(){ 'use-strict'

	const CONTAINER_ID = 'header-quote';
	const CARET_ID = CONTAINER_ID + '-caret';
	const QUOTES = [
		'Please, marry me',
		'I do things',
		'Hello... human...',
		'I don\'t use to bite people',
		'(Sometimes)',
		'But you already knew',
		'And this is my website'];

	const DEFAULT_CARET = '|';

	function MyHeaderQuotes(caret_str) {
		let random = Date.now() % QUOTES.length;
		this.quote = QUOTES[random];
		this.caret = caret_str || DEFAULT_CARET;
		this.duration = 1600; //ms
		this.interval = 100
		this.caret_visible = false;
	}

	MyHeaderQuotes.prototype = {
		load: function() {
			this.container = document.getElementById(CONTAINER_ID);
			this.container.textContent = this.caret;
			this._write_portion(1);
		},

		load_on: function() {
			return 'interactive';
		},

		_write_portion: function(i) {
			if(i < this.quote.length) {
				let t_delta = this.interval;
				if(this.quote[i] === ',') {
					t_delta *= 2;
				} else if (this.quote[i] === '.') {
					t_delta *= 3;
				}
				// Use request animation frame to improve performance and reliability
				// Use a no-anonymous funcion so that it doesn't create copies.
				requestAnimationFrame(()=>{
					this.container.textContent = this.quote.substr(0, i) + this.caret;
				});

				setTimeout(
					this._write_portion.bind(this, i + 1),
					t_delta);
			} else {
				this.container.textContent = this.quote;
				this._on_end();
			}
		},

		_on_end: function() {
			this.caret_element = document.createElement('span');
			this.caret_element.id = CARET_ID;
			this.caret_element.textContent = this.caret;
			this.container.appendChild(this.caret_element);

			setInterval(this.toggle_caret.bind(this), 1000);
		},

		toggle_caret: function() {
			if(this.caret_visible) {
				this.caret_element.style.visibility = 'hidden';
			} else {
				this.caret_element.style.visibility = 'visible';
			}
			this.caret_visible = !this.caret_visible;
		}
	};

	module.exports = MyHeaderQuotes;
})();
