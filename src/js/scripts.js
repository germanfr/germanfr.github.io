(function() { 'use strict'

	window.smoothScroll = require('smoothscroll');

	if(document.readyState === 'interactive') {
		_main_();
	} else {
		window.addEventListener('DOMContentLoaded', _main_);
	}

	function _main_() {
		set_emails();
		adjust_footer();
		//nav_selector();
	}

	function adjust_footer() {
		var footer = document.getElementById('footer');
		var margin_property = window.getComputedStyle(footer).getPropertyValue('margin-top');
		var margin_value = margin_property ? parseInt(margin_property, 10) : 0;

		var wrapper = document.getElementById('wrapper');
		wrapper.style.paddingBottom = footer.offsetHeight + margin_value + 'px';
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
		//this.href = ':otliam'.split('').reverse().join('')+ m + 'moc.liamg\u0040'.split('').reverse().join('');
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

	/*
	function nav_selector() {
		var nav = document.getElementById('nav');
		var children = get_child_nodes_array_by_class(nav, 'root-entry');
		var selector = nav.getElementsByClassName('nav-selector')[0];
		nav.addEventListener('mouseover', function(e) {
			var target = e.target;
			if(children.indexOf(target) >= 0) {
				selector.style.left = target.offsetLeft + 'px';
				selector.style.width = target.offsetWidth + 'px';
				selector.classList.remove('hidden');
				e.stopPropagation();

			} else {
				selector.classList.add('hidden');
			}

		});
		nav.addEventListener('mouseleave', function(e) {
			selector.classList.add('hidden');
		});
	}

	function get_child_nodes_array_by_class(parent, classname) {
		var children_nodelist = parent.getElementsByClassName(classname);
		var children_array = [];
		for(var i=0, len = children_nodelist.length; i < len; i++) {
			children_array[i] = children_nodelist.item(i);
		}
		return children_array;
	}
	*/

 })();
