import { applyStyles } from "./helpers";
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
import ContextMenu from "./components/ContextMenu";
import Modal from "./components/Modal";

class EditorView extends HTMLElement {
  private _editors: Editor[];
  private _currentIndex: number;
  private _sideBarVisible: boolean;
  private _menuBar: HTMLDivElement;
  private _contentWrapper: HTMLDivElement;
  private _sideBar: SideBar;
  private _splashScreen: SplashScreen;
  private _editorNames: Set<string>;
  private _contextMenu: ContextMenu | null;
  private _modal: Modal | null;

  constructor() {
    super();

    this._editors = [];
    this._currentIndex = -1;
    this._sideBarVisible = false;
    this._menuBar = this.buildMenuBar();
    this._contentWrapper = this.buildContentWrapper();
    this._sideBar = new SideBar();
    this._splashScreen = new SplashScreen();
    this._splashScreen.style.gridColumn = "2";
    this._editorNames = new Set();
    this._contextMenu = null;
    this._modal = null;

    this.appendChild(this._menuBar);
    this.appendChild(this._contentWrapper);

    this._contentWrapper.appendChild(this._sideBar);
    this._contentWrapper.appendChild(this._splashScreen);

    applyStyles(this, {
      ...universalStyles,
      display: "grid",
      gridTemplateRows: "max-content 1fr",
      height: "100vh",
      backgroundColor: window.theme.app.bg,
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
    this.addEventListener(
      "show-tab-context-menu",
      this.onShowTabContextMenu as EventListener
    );
    this.addEventListener(
      "rename-editor-requested",
      this.onRenameEditorRequested as EventListener
    );
    this.addEventListener("tab-moved", this.onTabMoved as EventListener);
  }

  openEditor() {
    const editor = new Editor();
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
      backgroundColor: window.theme.menuBar.bg,
    } as CSSStyleDeclaration);

    const sideBarIcon = new Icon(buildFileExplorerIconSVG(), "30px", true);
    const toggleSideBarOption = new MenuOption(sideBarIcon, () => {
      if (this._sideBarVisible) {
        this._sideBar.hide();
        this._sideBarVisible = false;
      } else {
        this._sideBar.show();
        this._sideBarVisible = true;
      }
    });
    menuBar.appendChild(toggleSideBarOption);

    const newEditorIcon = new Icon(buildPlusIconSVG(), "30px", true);
    const newEditorOption = new MenuOption(newEditorIcon, () => {
      this.newEditor();
    });
    menuBar.appendChild(newEditorOption);

    const settingsIcon = new Icon(buildSettingsIconSVG(), "30px", true);
    const settingsOption = new MenuOption(settingsIcon, () => {
      console.log("settings");
    });
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
    const editor = new Editor();
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
    const editorName = this.generateEditorName();
    this._editorNames.add(editorName);
    const tab = new Tab(editorName);
    tab.highlight();
    this._sideBar.addTabAtIndex(tab, this._currentIndex);
    if (this._editors.length > 1) {
      this._sideBar.show();
      this._sideBarVisible = true;
    }
  }

  private generateEditorName() {
    let i = this._editors.length || 1;
    let editorName: string | null = null;
    while (!editorName) {
      const candidate = `Editor-${i}`;
      if (!this._editorNames.has(candidate)) {
        editorName = candidate;
      }
      i++;
    }
    return editorName;
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
    const editorName = this._sideBar.getTabNameAtIndex(index);
    this._editorNames.delete(editorName);
    this._sideBar.removeTabAtIndex(index);
    editor.remove();
    if (this._currentIndex > 0 || this._editors.length === 0) {
      this._currentIndex--;
    }
    if (this._currentIndex >= 0) {
      this.showEditorAtIndex(this._currentIndex);
    } else {
      this._splashScreen.show();
    }
  }

  private destroyContextMenu() {
    if (this._contextMenu) {
      this._contextMenu.destroy();
      this._contextMenu = null;
    }
  }

  private destroyModal() {
    if (this._modal) {
      this._modal.destroy();
      this._modal = null;
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

  private onShowTabContextMenu(event: CustomEvent) {
    const { pageX, pageY, index, oldName } = event.detail;
    this.destroyContextMenu();
    const menu = new ContextMenu();
    menu.addOption("Rename", () => {
      const customEvent = new CustomEvent("rename-editor-requested", {
        bubbles: true,
        detail: {
          index,
          oldName,
        },
      });
      this.dispatchEvent(customEvent);
    });
    this.appendChild(menu);
    this._contextMenu = menu;
    this._contextMenu.show(pageX, pageY);
  }

  private onRenameEditorRequested(event: CustomEvent) {
    const { index, oldName } = event.detail;
    this.destroyModal();
    const modal = new Modal("Enter a new name for the editor:");
    const onInput = (event: InputEvent) => {
      const input = event.target as HTMLInputElement;
      const value = input.value;
      if (value.length === 0) {
        modal.lock();
        return;
      }
      if (this._editorNames.has(value)) {
        modal.lock();
        return;
      }
      modal.unlock();
    };
    modal.addInput(onInput as EventListener, oldName);
    modal.addAction("Cancel", () => {
      this.destroyModal();
    });
    modal.addAction("Confirm", () => {
      if (modal.valid) {
        const newName = modal.inputValue;
        this._editorNames.delete(oldName);
        this._editorNames.add(newName);
        this._sideBar.setTabNameAtIndex(index, newName);
        this.destroyModal();
      }
    });
    this._modal = modal;
    this.appendChild(modal);
  }

  private onTabMoved(event: CustomEvent) {
    const { oldIndex, newIndex } = event.detail;
    this._editors[this._currentIndex].hide();
    const editorToMove = this._editors[oldIndex];
    this._editors.splice(oldIndex, 1);
    this._editors.splice(newIndex, 0, editorToMove);
    this._currentIndex = newIndex;
    this._editors[this._currentIndex].show();
    this._sideBar.highlightTabAtIndex(this._currentIndex);
  }
}

customElements.define("editor-view", EditorView);

export default EditorView;
