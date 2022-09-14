import { applyStyles } from "./helpers";
import themes from "./themes";
import universalStyles from "./universalStyles";
import Editor from "./components/Editor";

applyStyles(document.body, {
  ...universalStyles,
  display: "grid",
  gridTemplateColumns: "1fr",
  gridTemplateRows: "1fr",
  padding: "1em",
  width: "100%",
  minHeight: "100vh",
  margin: "0px",
} as CSSStyleDeclaration);

const editor = new Editor(themes.defaultTheme);

const lines = [
  "line 1 - the first line",
  "line 2 - the second line",
  "line 3 - the third line",
  "line 4 - the forth line",
  "line 5 - the fifth line",
  "line 6 - the sixth line",
];

document.body.appendChild(editor);

lines.forEach(line => {
  editor.appendLine(line);
});
