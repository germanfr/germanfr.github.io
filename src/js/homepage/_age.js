(function() {

	const AGE_ELEM_ID = 'my-age';

	function MyAge(date_of_birth) {
		this.birth = new Date(date_of_birth);
	}

	MyAge.prototype = {
		load: function() {
			let elem = document.getElementById(AGE_ELEM_ID);
			elem.textContent = this.calc_age(this.birth);
		},

		load_on: function() {
			return 'interactive';
		},

		calc_age: function(birth) {
			let now = new Date();
			let age = now.getFullYear() - birth.getFullYear();
			if(now.getMonth() < birth.getMonth())
				return age - 1;
			return age;
		}
	};

	module.exports = MyAge;
})();
