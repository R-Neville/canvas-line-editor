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
    border: "#B2BABB",
  }
} as Theme;

export default defaultTheme;
