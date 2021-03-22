export class Skeleton extends HTMLElement {
	static get observedAttributes() {
		return [ 'size' ];
	}

	set variant(val) {
		this.setAttribute('variant', val);
	}

	set size(val) {
		this.setAttribute('size', val);
	}

	set color(val) {
		if (['','secondary'].includes(val))
			this.setAttribute('color', val);
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		if (oldVal === newVal) {
			return;
		}

		if (this.getAttribute('variant') === 'circle') {
			let size = isNaN(newVal) ? newVal : (newVal + 'px');
			this.style.width = size;
			this.style.height = size;
		}
	}
}

export const componentName = 'x-skeleton';

customElements.define(componentName, Skeleton);
