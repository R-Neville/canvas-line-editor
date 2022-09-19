import Theme from "./Theme";

const defaultTheme = {
  app: {
    bg: "#E5E8E8",
  },
  menuBar: {
    bg: "#17202A",
    fg: "#E5E8E8",
    highlightBg: "#273746",
  },
  sideBar: {
    bg: "#273746",
    fg: "#B2BABB",
    highlightBg: "#34495E",
  },
  splashScreen: {
    fg: "#212F3D",
    bg: "#E5E8E8",
  },
  editor: {
    bg: "#212F3D",
    highlightBg: "#2C3E50",
    fg: "#E5E8E8",
  },
  scrollBar: {
    bg: "#B2BABB",
  },
  lineNumber: {
    fg: "#B2BABB",
    highlightFg: "#E5E8E8",
  },
  lineElement: {
    fg: "#E5E8E8",
    highlightBg: "#273746",
  },
  contextMenu: {
    bg: "#E5E7E9",
    highlightBg: "#FFF",
    fg: "#000",
  },
  modal: {
    bg: "#E5E8E8",
    fg: "#212F3D",
  },
  error: {
    bg: "#F5B7B1",
    fg: "#C0392B",
  },
  success: {
    bg: "#ABEBC6",
    fg: "#145A32",
  },
  settingsView: {
    bg: "#E5E8E8",
    fg: "#212F3D",
    highlightFg: "#34495E",
  }
} as Theme;

export default defaultTheme;
