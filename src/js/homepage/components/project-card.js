import { createElement, link, icon } from '../../utils/domUtils';
import languages from '../../../assets/languages.json';

export class ProjectCard extends HTMLElement {
	set project(val) {
		this.render(val);
		this.setAttribute('id', val?.full_name);
	}

	connectedCallback() {
		if (!this.getAttribute('id'))
			this.render();
	}

	render(project) {
		this.className = 'card';
		this.appendChild(this.#renderCardHeader(project));
		this.appendChild(this.#renderCardBody(project));
		this.appendChild(this.#renderCardFooter(project));
	}

	#renderCardHeader(project) {
		let header = document.createElement('header');
		header.className = 'card-header d-flex align-items-baseline';

		let titleEl = document.createElement('h6');
		titleEl.className = 'm-0 flex-grow-1 text-truncate';

		if (project) {
			titleEl.textContent = project.name;
			header.appendChild(titleEl);

			let subTitleEl = document.createElement('div');
			subTitleEl.className = 'project-stats';

			if (project.stargazers_count) {
				let starsEl = document.createElement('span');
				starsEl.textContent = project.stargazers_count;
				subTitleEl.appendChild(starsEl);
				subTitleEl.appendChild(icon('far fa-star'));
			}

			if (project.forks_count) {
				let forksEl = document.createElement('span');
				forksEl.textContent = project.forks_count;
				subTitleEl.appendChild(forksEl);
				subTitleEl.appendChild(icon('fas fa-code-branch'));
			}

			header.appendChild(subTitleEl);

		} else { // Is loading
			titleEl.textContent = '-';
			let skeleton = createElement('x-skeleton', { variant: 'text', className: 'w-50', children: titleEl });
			header.appendChild(skeleton);
		}

		return header;
	}

	#renderCardBody(project) {
		let body = document.createElement('div');
		body.className = 'card-body';

		if (project) {
			let description = document.createElement('div');
			description.className = 'text-secondary text-truncate';
			description.textContent = project.description;
			description.title = project.description;
			body.appendChild(description);
		} else {
			let skeleton = createElement('x-skeleton', { variant: 'text', className: 'w-100' });
			body.appendChild(skeleton);
		}

		let metadataEl = document.createElement('div');
		metadataEl.className = 'project-metadata';


		if (project) {
			if (project.language) {
				let languagesEl = document.createElement('span');
				languagesEl.className = 'project-language';

				languagesEl.appendChild(createElement('language-color', { language: project.language }));
				languagesEl.appendChild(document.createTextNode(project.language));

				metadataEl.appendChild(languagesEl);
			}

			if (project.license) {
				let license = document.createElement('span');
				license.className = 'project-license';
				license.appendChild(icon('fas fa-balance-scale mr-2'));
				license.appendChild(document.createTextNode(project.license.spdx_id));
				metadataEl.appendChild(license);
			}

		} else {
			metadataEl.appendChild(createElement('x-skeleton', { variant: 'circle', size: '2ex' }));
			metadataEl.appendChild(createElement('x-skeleton', { variant: 'text', className: 'w-25' }));
			metadataEl.appendChild(createElement('x-skeleton', { variant: 'circle', size: '2ex' }));
			metadataEl.appendChild(createElement('x-skeleton', { variant: 'text', className: 'w-25' }));
		}

		body.appendChild(metadataEl);

		return body;
	}

	#renderCardFooter(project) {
		let footer = document.createElement('footer');
		footer.className = 'card-footer';

		if (project) {
			let sourceLink = link(project.html_url, "Source")
			sourceLink.className = 'footer-link';
			sourceLink.prepend(icon('far fa-folder'))
			footer.appendChild(sourceLink);

			if (project.homepage) {
				let homepageLink = link(project.homepage, "Website")
				homepageLink.className = 'footer-link';
				homepageLink.prepend(icon('fas fa-link'))
				footer.appendChild(homepageLink);
			}

		} else {
			footer.classList.add('pt-1');
			footer.appendChild(createElement('x-skeleton', { variant: 'text', className: 'footer-link w-25 mt-2' }));
			footer.appendChild(createElement('x-skeleton', { variant: 'text', className: 'footer-link w-25 mt-2' }));
		}


		return footer;
	}
}

export const componentName = 'project-card';

customElements.define(componentName, ProjectCard);
