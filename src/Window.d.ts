import Theme from "./themes/Theme";

declare global {
  interface Window {
    theme: Theme;
  }
}