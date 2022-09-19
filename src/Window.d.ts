import ConfigManager from "./config/ConfigManager";
import Theme from "./themes/Theme";

declare global {
  interface Window {
    theme: Theme;
    configManager: ConfigManager;
  }
}