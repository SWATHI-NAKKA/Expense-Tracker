// js/storage.js — localStorage CRUD layer (categories/funds/banks are user-configurable)

const Storage = {
  KEYS: {
    expenses:    'sw_expenses',
    income:      'sw_income',
    investments: 'sw_investments',
    banks:       'sw_banks',
    categories:  'sw_categories',
    funds:       'sw_funds',
    bankNames:   'sw_bank_names',
    settings:    'sw_settings',
    customItems: 'sw_custom_items'
  },

  // ─── Internal helpers ───────────────────────────────────────────────────────

  _get(key) {
    try { return JSON.parse(localStorage.getItem(key) || '{}'); }
    catch { return {}; }
  },

  _getArr(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : null;
    } catch { return null; }
  },

  _set(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); return true; }
    catch { return false; }
  },

  // Deep clone to prevent mutating defaults
  _clone(obj) { return JSON.parse(JSON.stringify(obj)); },

  // ─── Categories (user-configurable) ────────────────────────────────────────

  getCategories() {
    return this._getArr(this.KEYS.categories) || this._clone(DEFAULT_CATEGORIES);
  },

  saveCategories(cats) { return this._set(this.KEYS.categories, cats); },

  // ─── Custom Items (quick-add only, never shown in grid) ────────────────────
  // Structure: { [catId]: [{ id, label }, …] }

  getCustomItems() {
    return this._get(this.KEYS.customItems);
  },

  saveCustomItems(data) { return this._set(this.KEYS.customItems, data); },

  getCustomItemsForCat(catId) {
    return this.getCustomItems()[catId] || [];
  },

  addCustomItem(catId, label) {
    const all  = this.getCustomItems();
    const list = all[catId] || [];
    const existing = list.find(i => i.label.toLowerCase() === label.toLowerCase());
    if (existing) return existing.id;
    const newItem = { id: 'item_custom_' + Date.now(), label };
    list.push(newItem);
    all[catId] = list;
    this.saveCustomItems(all);
    return newItem.id;
  },

  // ─── Investment Funds (user-configurable) ──────────────────────────────────

  getFunds() {
    return this._getArr(this.KEYS.funds) || this._clone(DEFAULT_FUNDS);
  },

  saveFunds(funds) { return this._set(this.KEYS.funds, funds); },

  // ─── Bank Account Names (user-configurable) ────────────────────────────────

  getBankNames() {
    return this._getArr(this.KEYS.bankNames) || this._clone(DEFAULT_BANKS);
  },

  saveBankNames(banks) { return this._set(this.KEYS.bankNames, banks); },

  // ─── Expenses ───────────────────────────────────────────────────────────────

  getExpenses(month) {
    const all = this._get(this.KEYS.expenses);
    return all[month] || {};
  },

  saveExpenses(month, data) {
    const all = this._get(this.KEYS.expenses);
    all[month] = data;
    return this._set(this.KEYS.expenses, all);
  },

  getAllExpenses() { return this._get(this.KEYS.expenses); },

  // ─── Income ─────────────────────────────────────────────────────────────────

  getIncome(month) {
    const all = this._get(this.KEYS.income);
    return all[month] || { salary: 0, bonus: 0 };
  },

  saveIncome(month, data) {
    const all = this._get(this.KEYS.income);
    all[month] = data;
    return this._set(this.KEYS.income, all);
  },

  getAllIncome() { return this._get(this.KEYS.income); },

  // ─── Investments ────────────────────────────────────────────────────────────

  getInvestment(month) {
    const all = this._get(this.KEYS.investments);
    return all[month] || {};
  },

  saveInvestment(month, data) {
    const all = this._get(this.KEYS.investments);
    all[month] = data;
    return this._set(this.KEYS.investments, all);
  },

  getAllInvestments() { return this._get(this.KEYS.investments); },

  // ─── Bank Balances (per-month snapshot) ────────────────────────────────────

  getBanks(month) {
    const all = this._get(this.KEYS.banks);
    return all[month] || {};
  },

  saveBanks(month, data) {
    const all = this._get(this.KEYS.banks);
    all[month] = data;
    return this._set(this.KEYS.banks, all);
  },

  getLatestBanks() {
    const all = this._get(this.KEYS.banks);
    const months = Object.keys(all).sort();
    return months.length ? all[months[months.length - 1]] : {};
  },

  // ─── Settings ───────────────────────────────────────────────────────────────

  getSetting(key, fallback) {
    const s = this._get(this.KEYS.settings);
    return key in s ? s[key] : fallback;
  },

  saveSetting(key, value) {
    const s = this._get(this.KEYS.settings);
    s[key] = value;
    return this._set(this.KEYS.settings, s);
  },

  // ─── Import / Export ────────────────────────────────────────────────────────

  exportAll() {
    return JSON.stringify({
      expenses:    this._get(this.KEYS.expenses),
      income:      this._get(this.KEYS.income),
      investments: this._get(this.KEYS.investments),
      banks:       this._get(this.KEYS.banks),
      categories:  this._getArr(this.KEYS.categories),
      funds:       this._getArr(this.KEYS.funds),
      bankNames:   this._getArr(this.KEYS.bankNames),
      customItems: this._get(this.KEYS.customItems),
      exportedAt:  new Date().toISOString()
    }, null, 2);
  },

  importAll(jsonStr) {
    const data = JSON.parse(jsonStr);
    if (data.expenses)    this._set(this.KEYS.expenses,    data.expenses);
    if (data.income)      this._set(this.KEYS.income,      data.income);
    if (data.investments) this._set(this.KEYS.investments, data.investments);
    if (data.banks)       this._set(this.KEYS.banks,       data.banks);
    if (Array.isArray(data.categories)) this._set(this.KEYS.categories, data.categories);
    if (Array.isArray(data.funds))      this._set(this.KEYS.funds,      data.funds);
    if (Array.isArray(data.bankNames))  this._set(this.KEYS.bankNames,  data.bankNames);
    if (data.customItems && typeof data.customItems === 'object') this._set(this.KEYS.customItems, data.customItems);
    return true;
  },

  clearExpenseData() {
    localStorage.removeItem(this.KEYS.expenses);
    localStorage.removeItem(this.KEYS.income);
    localStorage.removeItem(this.KEYS.investments);
    localStorage.removeItem(this.KEYS.banks);
  },

  // ─── Computed helpers ────────────────────────────────────────────────────────

  getTotalExpenses(month) {
    const exp = this.getExpenses(month);
    let total = 0;
    Object.values(exp).forEach(catExp => {
      if (catExp && typeof catExp === 'object') {
        Object.values(catExp).forEach(amt => { total += Number(amt || 0); });
      }
    });
    return total;
  },

  getTotalIncome(month) {
    const inc = this.getIncome(month);
    return Number(inc.salary || 0) + Number(inc.bonus || 0);
  },

  getCategoryTotal(month, catId) {
    const catExp = this.getExpenses(month)[catId] || {};
    return Object.values(catExp).reduce((sum, amt) => sum + Number(amt || 0), 0);
  },

  getAllMonths() {
    const expMonths = Object.keys(this._get(this.KEYS.expenses));
    const incMonths = Object.keys(this._get(this.KEYS.income));
    return [...new Set([...expMonths, ...incMonths])].sort();
  }
};
