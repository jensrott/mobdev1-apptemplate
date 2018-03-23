'use strict';

export class GridOverlayElement extends HTMLElement {
  createdCallback () {
    this._canvasElement = document.createElement('canvas');
    this._canvasElement.setAttribute('style', 'width: 100%;height:100%;');
    this.appendChild(this._canvasElement);
    this._canvas2DContext = this._canvasElement.getContext('2d');
    this._gutter = 24;

    this.updateGrid();
  }

  updateRendering (width, height, gutter = 24) {
    this._canvasElement.width = width;
    this._canvasElement.height = height;
    this._gutter = gutter;

    this.updateGrid();
  }

  updateGrid () {
    const n = Math.ceil(this._canvasElement.height / this._gutter);

    this._canvas2DContext.beginPath();
    for (let i = 0; i <= n; i++) {
      this._canvas2DContext.moveTo(0, i * this._gutter);
      this._canvas2DContext.lineTo(this._canvasElement.width, i * this._gutter);
    }
    this._canvas2DContext.closePath();

    this._canvas2DContext.strokeStyle = '#ff0000';
    this._canvas2DContext.stroke();

    const colWidth = 8.33333 * (this._canvasElement.width - 2 * this._gutter) / 100;

    this._canvas2DContext.beginPath();
    for (let j = 0; j <= 12; j++) {
      this._canvas2DContext.moveTo(this._gutter + j * colWidth, 0);
      this._canvas2DContext.lineTo(this._gutter + j * colWidth, this._canvasElement.height);
    }
    this._canvas2DContext.closePath();

    this._canvas2DContext.strokeStyle = '#ff0000';
    this._canvas2DContext.stroke();

    this._canvas2DContext.beginPath();
    for (let j = 0; j < 12; j++) {
      this._canvas2DContext.moveTo(this._gutter + j * colWidth + this._gutter / 2, 0);
      this._canvas2DContext.lineTo(this._gutter + j * colWidth + this._gutter / 2, this._canvasElement.height);
      this._canvas2DContext.moveTo(this._gutter + (j + 1) * colWidth - this._gutter / 2, 0);
      this._canvas2DContext.lineTo(this._gutter + (j + 1) * colWidth - this._gutter / 2, this._canvasElement.height);
    }
    this._canvas2DContext.closePath();

    this._canvas2DContext.strokeStyle = '#0000ff';
    this._canvas2DContext.stroke();
  }

  delete () {
    this.parentNode.removeChild(this);
  }
};
