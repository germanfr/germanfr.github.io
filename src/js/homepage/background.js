import { Petri } from 'petri-nodes';
import { onDomLoaded } from '../utils/domUtils';

export function loadBackground() {
	// return;
	let canvas = getCanvas();
	let petri = initPetri(canvas);

	onDomLoaded(() => {
		document.body.appendChild(canvas);
	});

	window.addEventListener('load', () => {
		if (getDimensions().height !== canvas.height) {
			resize(petri);
		}
		requestAnimationFrame(() => { // Do async to show animation
			petri.start();
			canvas.classList.add('loaded');
		});
	});
}


function initPetri(canvas) {
	let petri = new Petri(canvas, {
		dot_density: .08,
		// with_cursor: true,
	});
	window.addEventListener('resize', () => resize(petri));
	return petri;
}


function getCanvas() {
	let canvas = document.createElement('canvas');
	canvas.className = 'petri-background';

	const dim = getDimensions();
	canvas.width = dim.width;
	canvas.height = dim.height;

	return canvas;
}


function resize(petri) {
	const dim = getDimensions();
	petri.resize(dim.width, dim.height);
}

function getDimensions() {
	return { width: document.body.clientWidth, height: document.body.clientHeight };
}
