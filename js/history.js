// js/history.js — snapshot-based undo / redo manager

const History = {
  _undo: [],
  _redo: [],
  MAX: 50,

  _snap() {
    const keys = ['sw_expenses','sw_income','sw_investments','sw_categories',
                  'sw_banks','sw_bank_names','sw_funds'];
    const s = {};
    keys.forEach(k => { s[k] = localStorage.getItem(k); });
    return s;
  },

  push() {
    this._undo.push(this._snap());
    if (this._undo.length > this.MAX) this._undo.shift();
    this._redo = [];
    this._sync();
  },

  undo() {
    if (!this._undo.length) return false;
    this._redo.push(this._snap());
    this._restore(this._undo.pop());
    this._sync();
    return true;
  },

  redo() {
    if (!this._redo.length) return false;
    this._undo.push(this._snap());
    this._restore(this._redo.pop());
    this._sync();
    return true;
  },

  _restore(snap) {
    Object.entries(snap).forEach(([k, v]) => {
      if (v === null) localStorage.removeItem(k);
      else localStorage.setItem(k, v);
    });
  },

  _sync() {
    const u = document.getElementById('undoBtn');
    const r = document.getElementById('redoBtn');
    if (u) u.disabled = !this._undo.length;
    if (r) r.disabled = !this._redo.length;
  }
};
