import ComponentTheme from '../themes/ComponentTheme';
import { applyStyles } from '../helpers';
import universalStyles from '../universalStyles';

class ContextMenuOption extends HTMLElement {
  private _theme: ComponentTheme;

  constructor(text: string, action: EventListener, theme: ComponentTheme) {
    super();

    this.textContent = text;
    this._theme = theme;

    applyStyles(this, {
      ...universalStyles,
      padding: '5px',
      width: '100%',
      backgroundColor: 'inherit',
      fontSize: "1em",
      color: this._theme.fg,
      cursor: 'pointer'
    } as CSSStyleDeclaration);

    this.addEventListener('click', action);
    this.addEventListener('mouseenter', this.onMouseEnter);
    this.addEventListener('mouseleave', this.onMouseLeave);
  }

  private onMouseEnter() {
    if (this._theme) {
      this.style.backgroundColor = this._theme.highlightBg;
    }
  }

  private onMouseLeave() {
    this.style.backgroundColor = 'inherit';
  }
}

customElements.define('context-menu-option', ContextMenuOption);

export default ContextMenuOption;