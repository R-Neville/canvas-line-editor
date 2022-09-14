import { applyStyles } from "./helpers";
import Theme from "./themes/Theme";
import Editor from "./components/Editor";
import SideBar from "./components/SideBar";

class EditorView extends HTMLElement {
  private _theme: Theme;
  private _editors: Editor[];
  private _currentIndex: number;
  private _menuBar: HTMLDivElement;
  private _contentWrapper: HTMLDivElement;
  private _sideBar: SideBar;
  
  constructor(theme: Theme) {
    super();

    this._theme = theme;
    this._editors = [];
    this._currentIndex = -1;
    this._menuBar = this.buildMenuBar();
    this._contentWrapper = this.buildContentWrapper();
    this._sideBar = new SideBar();

    this.appendChild(this._menuBar);
    this.appendChild(this._contentWrapper);

    this._contentWrapper.appendChild(this._sideBar);

    applyStyles(this, {
      display: "grid",
      gridTemplateRows: "max-content 1fr",
      height: "100vh",
    } as CSSStyleDeclaration);
  }

  openEditor() {
    const editor = new Editor(this._theme);
    this._editors.push(editor);
  }

  private buildMenuBar() {
    const menuBar = document.createElement("div");
    
    applyStyles(menuBar, {
      gridRow: "1",
      display: "flex",
      alignItems: "center",
      width: "100%",
      height: "50px",
      backgroundColor: "red",
    } as CSSStyleDeclaration);

    return menuBar;
  }

  private buildContentWrapper() {
    const wrapper = document.createElement("div");

    applyStyles(wrapper, {
      gridRow: "2",
      display: "grid",
      gridTemplateColumns: "max-content 1fr",
    } as CSSStyleDeclaration);

    return wrapper;
  }


  private addEditorAtIndex(editor: Editor, index: number) {
    this._editors.splice(index, 0, editor);
  }

}

customElements.define("editor-view", EditorView);

export default EditorView;