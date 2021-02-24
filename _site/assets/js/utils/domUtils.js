export function onDomLoaded(cb) {

	if (document.readyState === 'loading') {
		window.addEventListener('DOMContentLoaded', cb);
	} else {
		cb();
	}
}


export function emptyElement(el) {
	while (el.firstChild) el.removeChild(el.firstChild);
}


export function link(url, name) {
	let a = document.createElement('a');
	a.href = url;
	a.textContent = name;
	return a;
}

export function icon(name) {
	let i = document.createElement('i');
	i.className = name;
	return i;
}
