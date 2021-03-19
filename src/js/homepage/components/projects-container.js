import './project-card';

import { ProfileManager } from '../../modules/github';
import { emptyElement } from '../../utils/domUtils';

export class ProjectCardsContainer extends HTMLElement {
	static get observedAttributes() {
		return [ 'username' ];
	}
	set username(val) {
		this.setAttribute('username', val);
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		if (attrName === 'username') {
			if (oldVal !== newVal) {
				this.profile = ProfileManager.get(newVal);
				this.render();
			}
		}
	}

	render() {
		let cards = document.createDocumentFragment();
		for (let i = 0; i < 12; i++) {
			let card = document.createElement('project-card');
			cards.appendChild(card);
		}
		this.appendChild(cards);

		this.profile.ownRepos().then(repos => {
			if (!repos || repos.length === 0) {
				this.textContent = "There are no repositories.";
				return;
			}

			let cards = document.createDocumentFragment();
			for (let repo of repos) {
				let card = document.createElement('project-card');
				card.project = repo;
				cards.appendChild(card);
			}
			emptyElement(this);
			this.appendChild(cards);
		});
	}
}

export const componentName = 'projects-container';

customElements.define(componentName, ProjectCardsContainer);
