import { applyStyles } from "../../helpers";
import SettingsMenu from "./SettingsMenu";
import SettingsPage from "./SettingsPage";
import SettingsPageSection from "./SettingsPageSection";
import SettingInput from "./SettingInput";
import SettingCheckbox from "./SettingCheckbox";

class SettingsView extends HTMLElement {
  private _contentWrapper: HTMLDivElement;
  private _menu: SettingsMenu;
  private _generalPage: SettingsPage;

  constructor(onClose: EventListener) {
    super();

    this._contentWrapper = document.createElement("div");
    this._menu = new SettingsMenu();
    this._menu.addOption(
      "General",
      this.onGeneralSettingsOptionClick.bind(this)
    );
    this._generalPage = this.buildGeneralSettingsPage();

    this._contentWrapper.appendChild(this._menu);
    this._contentWrapper.appendChild(this._generalPage);
    this.appendChild(this._contentWrapper);

    applyStyles(this, {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      zIndex: "99",
      width: "100%",
      height: "100%",
      backgroundColor: "#000000AA",
    } as CSSStyleDeclaration);

    applyStyles(this._contentWrapper, {
      display: "flex",
      position: "relative",
      width: "50%",
      minWidth: "400px",
      height: "80%",
      minHeight: "300px",
      backgroundColor: window.theme.settingsView.bg,
    } as CSSStyleDeclaration);

    this.addEventListener("click", onClose);

    this._generalPage.show();
  }

  private buildGeneralSettingsPage() {
    const page = new SettingsPage();

    const editorFontSizeSection = new SettingsPageSection("Editor Font Size");
    const editorFontSizeInput = new SettingInput(
      window.configManager.fontSize.toString(),
      this.onEditorFontSizeInputBlur.bind(this)
    );
    editorFontSizeSection.setInput(editorFontSizeInput);
    page.addSection(editorFontSizeSection);

    const tabSizeSection = new SettingsPageSection("Tab Size");
    const tabSizeInput = new SettingInput(
      window.configManager.tabSize.toString(),
      this.onEditorTabSizeInputBlur.bind(this)
    );
    tabSizeSection.setInput(tabSizeInput);
    page.addSection(tabSizeSection);

    const autoIndexSection = new SettingsPageSection("Auto Indent");
    const autoIndentCheckbox = new SettingCheckbox(
      window.configManager.autoIndent,
      () => window.configManager.toggleAutoIndent(),
      ["Off", "On"]
    );
    autoIndexSection.setCheckbox(autoIndentCheckbox);
    page.addSection(autoIndexSection);

    const pairingSection = new SettingsPageSection("Pairing");
    const pairingCheckbox = new SettingCheckbox(
      window.configManager.pairing,
      () => window.configManager.togglePairing(),
      ["Off", "On"]
    );
    pairingSection.setCheckbox(pairingCheckbox);
    page.addSection(pairingSection);

    return page;
  }

  private onGeneralSettingsOptionClick() {
    this._generalPage.show();
  }

  private onEditorFontSizeInputBlur(event: Event) {
    const input = event.target as SettingInput;
    const valueInt = parseInt(input.value);

    if (valueInt === NaN) {
      input.showErrorStyles();
      return;
    }
    if (valueInt < 10) {
      input.showErrorStyles();
      return;
    }
    if (valueInt > 20) {
      input.showErrorStyles();
      return;
    }

    input.removeErrorStyles();

    window.configManager.fontSize = valueInt;

    const customEvent = new CustomEvent("font-size-changed", { bubbles: true });
    this.dispatchEvent(customEvent);
  }

  private onEditorTabSizeInputBlur(event: Event) {
    const input = event.target as SettingInput;
    const valueInt = parseInt(input.value);

    if (valueInt === NaN) {
      input.showErrorStyles();
      return;
    }
    if (valueInt < 2) {
      input.showErrorStyles();
      return;
    }
    if (valueInt > 16) {
      input.showErrorStyles();
      return;
    }

    input.removeErrorStyles();

    window.configManager.tabSize = valueInt;
  }
}

customElements.define("settings-view", SettingsView);

export default SettingsView;