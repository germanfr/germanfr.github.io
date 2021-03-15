import './components';

import { onDomLoaded } from './utils/domUtils';
import * as email from './modules/email';

onDomLoaded(() => email.connect());

window.addEventListener('load', () => {
	document.body.classList.add('loaded');
});
