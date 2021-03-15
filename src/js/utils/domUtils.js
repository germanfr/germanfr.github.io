// Ensure the callback will be called as soon as the DOM is ready,
// even if it DOMContentLoaded already happened
export function onDomLoaded(cb) {
	if (document.readyState === 'loading') {
		window.addEventListener('DOMContentLoaded', cb);
	} else {
		cb();
	}
}


export function createElement(name, props) {
	let elem = document.createElement(name);
	if (props.children) {
		elem.appendChild(props.children);
	}
	for (let key in props) {
		if (key === 'children') continue;
		elem[key] = props[key];
	}
	return elem;
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
