(function() { 'use strict'

	require('smoothscroll');

	window.addEventListener('DOMContentLoaded', function () {
		set_emails();
		adjust_footer();
	});

	function adjust_footer() {
		var footer = document.getElementById('footer');
		var wrapper = footer.parentElement;
		wrapper.style.paddingBottom = footer.offsetHeight + 'px';
		footer.classList.add('floating-footer');
	}

	function set_emails() {
		var ms = document.getElementsByClassName('liam');
		for(var i = 0, len = ms.length; i < len; i++) {
			ms[i].addEventListener('mouseover', show_mail_link);
			ms[i].addEventListener('mouseout', hide_mail_link);
		}
	}

	function show_mail_link() {
		var mailto = '\x6Dai\x6C\x74o\x3A';
		var mail = this.href.substr(7, this.href.length-1);
		this.href = mailto + unobfuscate_mail(mail);
	}

	function hide_mail_link() {
		var mailto = '\x6Dai\x6C\x74o\x3A';
		var mail = this.href.substr(7, this.href.length-1);
		this.href = mailto + obfuscate_mail(mail);
	}

	// Obfuscate email in format name@whatever.blah
	function obfuscate_mail(mail) {
		var raw = mail.split('\u0040');
		var name = raw[0], obs = '';
		var i = 0, j = name.length-1;
		while(i < j) {
			obs += name[i] + name[j];
			i++; j--;
		}
		if(i === j)
			obs += name[i];
		return  obs + '\u0040' + raw[1];
	}

	// Unobfuscate email in format hhdashjdkanwo@whatever.blah
	function unobfuscate_mail(mail) {
		var raw = mail.split('\u0040');
		var obs = raw[0], name = new Array(obs.length);
		var i = 0, j = obs.length-1;
		for(var count = 0; count < obs.length; count++) {
			if(count % 2 === 0) {
				name[i] = obs[count];
				i++;
			} else {
				name[j] = obs[count];
				j--;
			}
		}
		return  name.join('') + '\u0040' + raw[1];
	}

 })();
