import { link, icon } from '../../utils/domUtils';
// import GitHubColors from 'github-colors';

export class ProjectCard extends HTMLElement {
	set project(val) {
		this.render(val);
		this.setAttribute('id', val.full_name);
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
		titleEl.textContent = project.name;
		header.appendChild(titleEl);

		let subTitleEl = document.createElement('div');
		subTitleEl.className = 'project-stats';

		if (project.stargazers_count) {
			let starsEl = document.createElement('span');
			// starsEl.className = 'ml-2 mr-1';
			starsEl.textContent = project.stargazers_count;
			subTitleEl.appendChild(starsEl);
			subTitleEl.appendChild(icon('far fa-star'));
		}

		if (project.forks_count) {
			let forksEl = document.createElement('span');
			// forksEl.className = 'ml-2 mr-1';
			forksEl.textContent = project.forks_count;
			subTitleEl.appendChild(forksEl);
			subTitleEl.appendChild(icon('fas fa-code-branch'));
		}

		header.appendChild(subTitleEl);

		return header;
	}

	#renderCardBody(project) {
		// console.log(project);
		let body = document.createElement('div');
		body.className = 'card-body';

		let description = document.createElement('div');
		description.className = 'text-secondary text-truncate';
		description.textContent = project.description;
		description.title = project.description;
		body.appendChild(description);



		return body;
	}

	#renderCardFooter(project) {
		let footer = document.createElement('footer');
		footer.className = 'card-footer';

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


		let languages = document.createElement('span');
		languages.className = 'project-language';
		languages.textContent = project.language === 'JavaScript' ? 'JS' : project.language;

		let colorSpot = document.createElement('language-color');
		colorSpot.language = project.language;
		languages.prepend(colorSpot);

		footer.appendChild(languages);

		return footer;
	}
}

export const componentName = 'project-card';

customElements.define(componentName, ProjectCard);
