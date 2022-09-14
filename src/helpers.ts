export function applyStyles(el: HTMLElement, styles: CSSStyleDeclaration) {
  for (let prop in styles) {
    el.style[prop] = styles[prop];
  }
}