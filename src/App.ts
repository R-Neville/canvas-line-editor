import { applyStyles } from "./helpers";
import Theme from "./themes/Theme";
import Editor from "./components/Editor";
import SideBar from "./components/SideBar";
import MenuOption from "./components/MenuOption";
import Icon from "./components/Icon";
import {
  buildFileExplorerIconSVG,
  buildPlusIconSVG,
  buildSettingsIconSVG,
} from "./icons";
import universalStyles from "./universalStyles";
import Tab from "./components/Tab";
import SplashScreen from "./components/SplashScreen";

class EditorView extends HTMLElement {
  private _theme: Theme;
  private _editors: Editor[];
  private _currentIndex: number;
  private _sideBarVisible: boolean;
  private _menuBar: HTMLDivElement;
  private _contentWrapper: HTMLDivElement;
  private _sideBar: SideBar;
  private _splashScreen: SplashScreen;

  constructor(theme: Theme) {
    super();

    this._theme = theme;
    this._editors = [];
    this._currentIndex = -1;
    this._sideBarVisible = false;
    this._menuBar = this.buildMenuBar();
    this._contentWrapper = this.buildContentWrapper();
    this._sideBar = new SideBar(this._theme);
    this._splashScreen = new SplashScreen(this._theme.splashScreen);
    this._splashScreen.style.gridColumn = "2";

    this.appendChild(this._menuBar);
    this.appendChild(this._contentWrapper);

    this._contentWrapper.appendChild(this._sideBar);
    this._contentWrapper.appendChild(this._splashScreen);

    applyStyles(this, {
      ...universalStyles,
      display: "grid",
      gridTemplateRows: "max-content 1fr",
      height: "100vh",
      backgroundColor: this._theme.app.bg,
    } as CSSStyleDeclaration);

    this.addEventListener("new-editor-requested", this.onNewEditorRequested);
    this.addEventListener(
      "switch-editor-requested",
      this.onSwitchEditorRequested as EventListener
    );
    this.addEventListener(
      "close-editor-requested",
      this.onCloseEditorRequested as EventListener
    );
  }

  openEditor() {
    const editor = new Editor(this._theme);
    this._editors.push(editor);
  }

  private buildMenuBar() {
    const menuBar = document.createElement("div");

    applyStyles(menuBar, {
      ...universalStyles,
      gridRow: "1",
      display: "flex",
      alignItems: "center",
      padding: "0.5em",
      width: "100%",
      backgroundColor: this._theme.menuBar.bg,
    } as CSSStyleDeclaration);

    const sideBarIcon = new Icon(buildFileExplorerIconSVG(), "30px", true);
    const toggleSideBarOption = new MenuOption(
      sideBarIcon,
      () => {
        if (this._sideBarVisible) {
          this._sideBar.hide();
          this._sideBarVisible = false;
        } else {
          this._sideBar.show();
          this._sideBarVisible = true;
        }
      },
      this._theme.menuBar
    );
    menuBar.appendChild(toggleSideBarOption);

    const newEditorIcon = new Icon(buildPlusIconSVG(), "30px", true);
    const newEditorOption = new MenuOption(
      newEditorIcon,
      () => {
        this.newEditor();
      },
      this._theme.menuBar
    );
    menuBar.appendChild(newEditorOption);

    const settingsIcon = new Icon(buildSettingsIconSVG(), "30px", true);
    const settingsOption = new MenuOption(
      settingsIcon,
      () => {
        console.log("settings");
      },
      this._theme.menuBar
    );
    settingsOption.style.marginLeft = "auto";
    menuBar.appendChild(settingsOption);

    return menuBar;
  }

  private buildContentWrapper() {
    const wrapper = document.createElement("div");

    applyStyles(wrapper, {
      ...universalStyles,
      gridRow: "2",
      display: "grid",
      gridTemplateColumns: "max-content 1fr",
      overflow: "hidden",
      maxHeight: "100%",
    } as CSSStyleDeclaration);

    return wrapper;
  }

  private newEditor() {
    const editor = new Editor(this._theme);
    editor.style.gridColumn = "2";
    editor.appendLine("");

    if (this._currentIndex >= 0) {
      this._editors[this._currentIndex].hide();
      this._sideBar.unHighlightTabAtIndex(this._currentIndex);
    } else {
      this._splashScreen.hide();
    }
    this._currentIndex += 1;
    this._editors.splice(this._currentIndex, 0, editor);
    this._contentWrapper.appendChild(editor);
    editor.show();
    const tab = new Tab("New Editor", this._theme.sideBar);
    tab.highlight();
    this._sideBar.addTabAtIndex(tab, this._currentIndex);
    if (this._editors.length > 1) {
      this._sideBar.show();
      this._sideBarVisible = true;
    }
  }

  private showEditorAtIndex(index: number) {
    if (this._currentIndex < 0) {
      this._splashScreen.hide();
    }
    this._editors[this._currentIndex].hide();
    this._sideBar.unHighlightTabAtIndex(this._currentIndex);
    this._currentIndex = index;
    this._editors[this._currentIndex].show();
    this._sideBar.highlightTabAtIndex(this._currentIndex);
  }

  private closeEditorAtIndex(index: number) {
    const editor = this._editors.splice(index, 1)[0];
    editor.hide();
    this._sideBar.removeTabAtIndex(index);
    editor.remove();
    if (this._currentIndex > this._editors.length - 1) {
      this._currentIndex--;
    }
    if (this._currentIndex >= 0) {
      this.showEditorAtIndex(this._currentIndex);
    } else {
      this._splashScreen.show();
    }
  }

  private onNewEditorRequested() {
    this.newEditor();
  }

  private onSwitchEditorRequested(event: CustomEvent) {
    const { index } = event.detail;
    if (index !== this._currentIndex) {
      this.showEditorAtIndex(index);
    }
  }

  private onCloseEditorRequested(event: CustomEvent) {
    const { index } = event.detail;
    this.closeEditorAtIndex(index);
  }
}

customElements.define("editor-view", EditorView);

export default EditorView;
