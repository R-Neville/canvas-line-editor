export interface LMSelection {
  line: number;
  col: number;
}

class LineManager {
  private _line: number;
  private _col: number;
  private _currentLineCount: number;
  private _oldLineCount: number;
  private _selectionStart: LMSelection|null;
  private _selectionEnd: LMSelection|null;
  
  constructor() {
    this._line = 0;
    this._col = 0;
    this._currentLineCount = 0;
    this._oldLineCount = 0;
    this._selectionStart = null;
    this._selectionEnd = null
  }

  get line() {
    return this._line;
  }

  get col() {
    return this._col;
  }

  set col(value: number) {
    this._col = value;
  }

  get currentLineCount() {
    return this._currentLineCount;
  }

  set currentLineCount(value) {
    this._oldLineCount = this._currentLineCount;
    this._currentLineCount = value;
  }

  get oldLineCount() {
    return this._oldLineCount;
  }

  get caret() {
    return {
      line: this.line,
      col: this.col,
    };
  }

  get selectionStart() {
    return this._selectionStart;
  }

  set selectionStart(newValue: LMSelection|null) {
    this._selectionStart = newValue;
  }

  get selectionEnd() {
    return this._selectionEnd;
  }

  set selectionEnd(newValue: LMSelection|null) {
    this._selectionEnd = newValue;
  }

  updateCaretPos(line: number, col: number) {
    this._line = line; 
    this._col = col;
  }
}

export default LineManager;