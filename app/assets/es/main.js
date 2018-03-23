'use strict';
'use strict';

import { Person, Student } from './models';
import { GridOverlayElement } from './grid';

class App {
  constructor () {
    console.log('Constructor of the class');

    document.registerElement('grid-overlay', GridOverlayElement);

    this._gridOverlayElement = document.createElement('grid-overlay');
    document.body.appendChild(this._gridOverlayElement);
    this.resizeWindow();

    window.addEventListener('resize', () => this.resizeWindow());
  }

  resizeWindow () {
    this._gridOverlayElement.updateRendering(window.innerWidth, Math.max(
      window.innerHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight
    ), 24);
  }

  init () {
    console.log('Initialization of the class App');
  }
};

window.addEventListener('load', (ev) => {
  const app = new App();
  app.init();
});
