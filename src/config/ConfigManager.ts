import Config from "./Config";

const CONFIG_KEY = "config";

class ConfigManager {
  private _defaults: Config;
  private _current: Config;

  constructor(defaults: Config) {
    this._defaults = defaults;

    const userConfig = this.load();
    if (userConfig) {
      this._current = userConfig;
    } else {
      this._current = this._defaults;
      this.save();
    }
  }

  get autoIndent() {
    return this._current.autoIndent;
  }

  get pairing() {
    return this._current.pairing;
  }

  get tabSize() {
    return this._current.tabSize;
  }

  set tabSize(value: number) {
    this._current.tabSize = value;
    this.save();
  }

  get lineHeight() {
    return this._current.lineHeight;
  }

  get fontSize() {
    return Math.round(this._current.lineHeight * 0.7);
  }

  set fontSize(value: number) {
    this._current.lineHeight = Math.round(value * 1.3);
    this.save();
  }

  toggleAutoIndent() {
    this._current.autoIndent = !this._current.autoIndent;
    this.save();
  }

  togglePairing() {
    this._current.pairing = !this._current.pairing;
    this.save();
  }

  private save() {
    const currentJSON = JSON.stringify(this._current);
    window.localStorage.setItem(CONFIG_KEY, currentJSON);
  }

  private load() {
    try {
      const configJSON = window.localStorage.getItem(CONFIG_KEY);
      if (configJSON) {
        return JSON.parse(configJSON) as Config;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }
}

export default ConfigManager;