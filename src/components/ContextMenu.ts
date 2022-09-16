import ComponentTheme from '../themes/ComponentTheme';
import { applyStyles } from '../helpers';
import ContextMenuOption from './ContextMenuOption';

class ContextMenu extends HTMLElement {
  private _theme: ComponentTheme;
  private _caller: HTMLElement;

  constructor(caller: HTMLElement, theme: ComponentTheme) {
    super();

    this._caller = caller;
    this._theme = theme;

    applyStyles(this, {
      display: 'none',
      flexDirection: 'column',
      position: 'absolute',
      zIndex: "99",
      width: '200px'
    } as CSSStyleDeclaration);

    document.addEventListener('click', this.onClickAway.bind(this) as EventListener);
    document.addEventListener('contextmenu', this.onContextMenu.bind(this) as EventListener);
  }

  addOption(text: string, action: EventListener) {
    const option = new ContextMenuOption(text, action, this._theme);
    this.appendChild(option);
  }

  show(x: number, y: number) {
    this.style.left = x + 'px';
    this.style.top = y + 'px';
    this.style.display = 'flex';
  }

  private onClickAway(event: Event) {
    if (event.target !== this) {
      this.remove();
      document.removeEventListener('click', this.onClickAway);
    }
  }

  private onContextMenu(event: MouseEvent) {
    if ((event.target as HTMLElement).closest('dropdown-expander') !== this._caller) {
      this.remove();
      document.removeEventListener('contextmenu', this.onContextMenu);
    }
  }
}

customElements.define('context-menu', ContextMenu);

export default ContextMenu;