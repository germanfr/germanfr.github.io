import './project-card';

import { ProfileManager } from '../../modules/github';
import { emptyElement } from '../../utils/domUtils';

export class YearContributions extends HTMLElement {
	static get observedAttributes() {
		return [ 'username', 'year' ];
	}
	set username(val) {
		this.setAttribute('username', val);
	}

	set year(val) {
		this.setAttribute('year', val);
	}


	attributeChangedCallback(attrName, oldVal, newVal) {
		if (oldVal === newVal) {
			return;
		}
		if (attrName === 'username') {
			this.profile = ProfileManager.get(newVal);
		} else if (attrName === 'year') {
			this._year = Math.max(2000, parseInt(newVal));
		}

		if (this.profile && this._year) {
			this.render();
		}
	}

	render() {
		this.appendChild(this.#renderHeader());
		this.appendChild(document.createTextNode("Loading..."));

		this.profile.yearContributions(this._year).then(contributions => {
			emptyElement(this);

			if (!contributions || contributions.repositories.length === 0) {
				this.hidden = true;
				return;
			} else {
				this.hidden = undefined;
			}

			this.appendChild(this.#renderHeader(contributions));

			let reposContainer = document.createElement('div');
			reposContainer.className = 'repos-list';
			for (let repo of contributions.repositories) {
				let elem = document.createElement('a');
				elem.className = 'repo-link';
				elem.href = repo.url;
				elem.rel = 'external noopener';
				{
					let avatar = document.createElement('img');
					avatar.src = repo.avatarUrl+'&s=48';
					elem.appendChild(avatar);
				}
				elem.appendChild(document.createTextNode(repo.fullName));
				reposContainer.appendChild(elem);
			}
			this.appendChild(reposContainer);

		}).catch(err => {
			this.#renderError(err);
			console.error(err);
		});
	}

	#renderHeader(contributions) {
		let header = document.createElement('header');
		header.className = 'd-flex';

		let yearEl = document.createElement('h5');
		yearEl.textContent = this._year;
		header.appendChild(yearEl);

		let line = document.createElement('div');
		line.className = 'fancy-header-line';
		header.appendChild(line);

		if (contributions) {
			header.appendChild(this.#renderContributionsCounter(contributions.repositories.length));
		}

		return header;
	}

	#renderContributionsCounter(count) {
		let contribCountEl = document.createElement('span');
		contribCountEl.className = 'text-truncate repo-count';

		let i = 0;
		let intervalId = setInterval(() => {
			let text = "Contributed to %d repositories".replace('%d', i);
			contribCountEl.textContent = text;
			if (i === count) {
				clearInterval(intervalId);
			}
			i++;
		}, Math.min(100, 1000/count));
		return contribCountEl;
	}

	#renderError(err) {
		emptyElement(this);
		this.appendChild(this.#renderHeader());
		let errorContainer = document.createElement('div');
		errorContainer.className = 'text-danger';
		errorContainer.textContent = "Error :(";
		this.appendChild(errorContainer);
	}
}

export const componentName = 'year-contributions';

customElements.define(componentName, YearContributions);
