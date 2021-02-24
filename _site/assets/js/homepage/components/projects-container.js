import './project-card';

import { GithubProfile } from '../../github';
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
				this.profile = new GithubProfile(newVal);
				this.render();
			}
		}
	}

	render() {
		this.textContent = 'Loading...';

		this.profile.ownRepos().then(repos => {
			console.log(repos);
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
