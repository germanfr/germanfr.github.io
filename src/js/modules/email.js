import * as StringUtils from '../utils/string';

const COMMON_DOMAINS = [ 'gmail', 'yahoo', 'outlook', 'hotmail' ];

// The name part:
//  * Reverse.
//  * Convert to base64.
//  * Replace equal padding (=) with underscores (_).
// The at (@):
//  * Replace with #
// The domain:
//  * Change the domain to the next in the COMMON_DOMAINS array.
export function obfuscate(email) {
	let [ name, domain ] = email.split('\u0040', 2);
	let obfuscatedName = btoa(StringUtils.reverse(name)).replace('=', '_');
	return  obfuscatedName + '#' + obfuscateDomainPart(domain);
}

export function unobfuscate(email) {
	let [ name, domain ] = email.split('#', 2);
	let obfuscatedName = StringUtils.reverse(atob(name.replace('_', '=')));
	return  obfuscatedName + '\u0040' + unobfuscateDomainPart(domain);
}

// Change the domain to the next in the COMMON_DOMAINS array.
function obfuscateDomainPart(domain) {
	let [ dom, ...tld ] = domain.split('.');
	const idx = COMMON_DOMAINS.indexOf(dom);
	if (idx < 0) {
		return dom + '.' + tld.join('.'); // as is
	} else {
		const next = (idx + 1) % COMMON_DOMAINS.length;
		return COMMON_DOMAINS[next] + '.' + tld.join('.');
	}
}

function unobfuscateDomainPart(domain) {
	let [ dom, ...tld ] = domain.split('.');
	const idx = COMMON_DOMAINS.indexOf(dom);
	if (idx < 0) {
		return dom + '.' + tld.join('.'); // as is
	} else {
		const prev = (idx - 1 + COMMON_DOMAINS.length) % COMMON_DOMAINS.length;
		return COMMON_DOMAINS[prev] + '.' + tld.join('.');
	}
}


const MAILTO = '\x6Dai\x6C\x74o\x3A';


export function connect(elements) {
	let connElements;
	if (typeof elements === 'undefined') {
		connElements = document.querySelectorAll(`.liam[href]`);
	} else if (!Array.isArray(elements)) {
		connElements = [ elements ];
	} else {
		connElements = elements;
	}

	for (const el of connElements) {
		el.addEventListener('mouseover', unobfuscateHref);
		el.addEventListener('mouseout', obfuscateHref);
	}
}

function obfuscateHref(el) {
	if (this.getAttribute('data-plain')) {
		const email = this.getAttribute('href').substring(MAILTO.length);
		this.href = obfuscate(email);
		this.removeAttribute('data-plain');
	}
}

function unobfuscateHref(el) {
	const email = this.getAttribute('href');
	this.href = MAILTO + unobfuscate(email);
	this.setAttribute('data-plain', true);
}
