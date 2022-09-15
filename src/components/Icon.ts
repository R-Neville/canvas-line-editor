import { applyStyles } from '../helpers';

class Icon extends HTMLElement {
  private _svg: SVGElement;

  constructor(svg: SVGElement, width?: string, square?: boolean) {
    super();

    this._svg = svg;
    this.appendChild(svg);

    applyStyles(this, {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxSizing: 'border-box',
      width: width ? width: '100%',
      minWidth: width ? width : '100%',
      userSelect: 'none'
    } as CSSStyleDeclaration);

    if (square && width) {
      applyStyles(this, {
        height: width,
        minHeight: width
      } as CSSStyleDeclaration);
    }
  }

  setColor(color: string) {
    const strokes = this.querySelectorAll('.stroke');
    (Array.from(strokes) as any[]).forEach(stroke => {
      stroke.style.stroke = color;
    });
    const fills = this.querySelectorAll('.fill');
    (Array.from(fills) as any[]).forEach(fill => {
      fill.style.fill = color;
    });
  }

  transform(transformation: string) {
    this._svg.setAttribute('transform', transformation);
  }
}

customElements.define('textualize-icon', Icon);

export default Icon;