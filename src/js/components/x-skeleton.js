export class Skeleton extends HTMLElement {
	set variant(val) {
		this.setAttribute('variant', val);
	}
}

export const componentName = 'x-skeleton';

customElements.define(componentName, Skeleton);
