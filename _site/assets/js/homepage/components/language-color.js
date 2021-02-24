import GitHubColors from 'github-colors';

export class LanguageColor extends HTMLElement {
	static get observedAttributes() {
		return [ 'language' ];
	}

	set language(val) {
		this.setAttribute('language', val);
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		if (attrName === 'language') {
			if (oldVal !== newVal) {
				this.render(newVal);
			}
		}
	}

	render(language) {
		this.style.background = this.#getColor();
	}

	#getColor() {
		let language = this.getAttribute('language');
		return GitHubColors.get(language)?.color;
	}
}

export const componentName = 'language-color';

customElements.define(componentName, LanguageColor);
