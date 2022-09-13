class LineManager {
  private _startingLineNumber: number;
  private _endingLineNumber: number;
  private _currentLineCount: number;
  private _oldLineCount: number;
  private _startingColNumber: number;
  private _endingColNumber: number;
  
  constructor() {
    this._startingLineNumber = 0;
    this._endingLineNumber = 0;
    this._currentLineCount = 0;
    this._startingColNumber = 0;
    this._endingColNumber = 0;
    this._oldLineCount = 0;
  }

  get lineStart() {
    return this._startingLineNumber;
  }

  set lineStart(value: number) {
    this._startingLineNumber = value;
  }

  get lineEnd() {
    return this._endingLineNumber;
  }

  set lineEnd(value: number) {
    this._endingLineNumber = value;
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

  get colStart() {
    return this._startingColNumber;
  }

  set colStart(value) {
    this._startingColNumber = value;
  }

  get colEnd() {
    return this._endingColNumber;
  }

  set colEnd(value) {
    this._endingColNumber = value;
  }

  get caret() {
    return {
      lineStart: this.lineStart,
      lineEnd: this.lineEnd,
      colStart: this.colStart,
      colEnd: this.colEnd,
    };
  }

  updateCaretPos(line: number, col: number) {
    this.lineStart = line; 
    this.lineEnd = line;
    this.colStart = col;
    this.colEnd = col;
  }
}

export default LineManager;