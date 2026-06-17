// js/app.js — SpendWise (dark theme, top-nav, month-picker redesign)

// ─── Utilities ──────────────────────────────────────────────────────────────

function fmt(n) {
  const num = Math.round(Math.abs(Number(n) || 0));
  if (num === 0) return '₹0';
  const s = num.toString();
  let res = '';
  if (s.length > 3) {
    res = ',' + s.slice(-3);
    let rem = s.slice(0, -3);
    while (rem.length > 2) { res = ',' + rem.slice(-2) + res; rem = rem.slice(0, -2); }
    res = rem + res;
  } else { res = s; }
  return (Number(n) < 0 ? '-₹' : '₹') + res;
}

function fmtCr(n) {
  const v = Math.abs(Number(n) || 0);
  if (v >= 1e7)  return (n < 0 ? '-₹' : '₹') + (v / 1e7).toFixed(2) + ' Cr';
  if (v >= 1e5)  return (n < 0 ? '-₹' : '₹') + (v / 1e5).toFixed(2) + ' L';
  return fmt(n);
}

function monthLabel(ym) {
  const [y, m] = ym.split('-');
  return CONFIG.monthNames[parseInt(m) - 1] + ' ' + y;
}

function currentYM() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}

function prevMonth(ym) {
  const [y, m] = ym.split('-').map(Number);
  return m === 1 ? (y - 1) + '-12' : y + '-' + String(m - 1).padStart(2, '0');
}

function nextMonth(ym) {
  const [y, m] = ym.split('-').map(Number);
  return m === 12 ? (y + 1) + '-01' : y + '-' + String(m + 1).padStart(2, '0');
}

function pct(part, whole) { return whole ? Math.round((part / whole) * 100) : 0; }
function uid() { return '_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36); }
function esc(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function toast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show ' + type;
  setTimeout(() => { el.className = 'toast'; }, 2800);
}

// ─── Item emoji lookup ───────────────────────────────────────────────────────
function itemEmoji(label) {
  const l = (label || '').toLowerCase();
  // Transport
  if (/bus/.test(l))                          return '🚌';
  if (/metro|subway/.test(l))                 return '🚇';
  if (/train|rail/.test(l))                   return '🚂';
  if (/auto/.test(l))                         return '🛺';
  if (/cab|taxi|ola|uber|rapido/.test(l))     return '🚕';
  if (/bike|scooter|cycle|bicycle/.test(l))   return '🚲';
  if (/flight|airplane|plane/.test(l))        return '✈️';
  if (/fuel|petrol|diesel/.test(l))           return '⛽';
  if (/parking/.test(l))                      return '🅿️';
  if (/ferry|boat|ship/.test(l))              return '⛴️';
  // Food
  if (/fruit/.test(l))                        return '🍎';
  if (/vegetable|veggie/.test(l))             return '🥦';
  if (/milk|dairy/.test(l))                   return '🥛';
  if (/egg/.test(l))                          return '🥚';
  if (/chicken|mutton/.test(l))               return '🍗';
  if (/fish|seafood/.test(l))                 return '🐟';
  if (/rice|wheat|flour/.test(l))             return '🌾';
  if (/bread|bakery/.test(l))                 return '🍞';
  if (/sweet|candy|chocolate/.test(l))        return '🍬';
  if (/snack|chips/.test(l))                  return '🍿';
  if (/coffee|cafe/.test(l))                  return '☕';
  if (/tea/.test(l))                          return '🍵';
  if (/pizza/.test(l))                        return '🍕';
  if (/burger/.test(l))                       return '🍔';
  if (/ice.?cream/.test(l))                   return '🍦';
  if (/swiggy|zomato|delivery/.test(l))       return '🛵';
  if (/restaurant|dining|dine/.test(l))       return '🍽️';
  if (/grocery|grocer/.test(l))               return '🛒';
  // Recharges & Subscriptions
  if (/mobile|phone|sim|recharge/.test(l))    return '📱';
  if (/internet|broadband|wifi|fiber/.test(l))return '🌐';
  if (/netflix|prime|hotstar|disney|ott/.test(l)) return '🎬';
  if (/spotify|podcast/.test(l))              return '🎵';
  if (/youtube/.test(l))                      return '▶️';
  if (/dth|cable|tv/.test(l))                 return '📺';
  if (/game|gaming|steam/.test(l))            return '🎮';
  if (/subscription|sub/.test(l))             return '📋';
  // Bills & Utilities
  if (/electric|eb|power/.test(l))            return '⚡';
  if (/water/.test(l))                        return '💧';
  if (/gas|lpg/.test(l))                      return '🔥';
  if (/rent/.test(l))                         return '🏠';
  if (/maintenance|repair/.test(l))           return '🔧';
  if (/insurance/.test(l))                    return '🛡️';
  if (/loan|emi/.test(l))                     return '🏦';
  // Shopping
  if (/cloth|dress|shirt|pant|kurta|saree/.test(l)) return '👗';
  if (/shoe|footwear|slipper|sandal/.test(l)) return '👟';
  if (/bag|purse/.test(l))                    return '👜';
  if (/laptop|computer/.test(l))              return '💻';
  if (/book/.test(l))                         return '📚';
  if (/jewel|gold|silver/.test(l))            return '💍';
  if (/kitchen|cook/.test(l))                 return '🍳';
  if (/furniture|sofa|bed/.test(l))           return '🛋️';
  if (/toy/.test(l))                          return '🧸';
  // Personal care
  if (/haircut|salon|hair|barber/.test(l))    return '✂️';
  if (/gym|fitness|workout/.test(l))          return '💪';
  if (/doctor|hospital|clinic/.test(l))       return '🏥';
  if (/medicine|tablet|pharma/.test(l))       return '💊';
  if (/skincare|beauty|makeup|cosmetic/.test(l)) return '💄';
  if (/spa|massage/.test(l))                  return '🧖';
  // Entertainment
  if (/movie|cinema|film/.test(l))            return '🎬';
  if (/concert|show|event/.test(l))           return '🎤';
  if (/travel|trip|tour|holiday|vacation/.test(l)) return '🌴';
  if (/sport|cricket|football|tennis/.test(l)) return '⚽';
  // Family & Friends
  if (/gift|present/.test(l))                 return '🎁';
  if (/birthday/.test(l))                     return '🎂';
  if (/wedding|marriage/.test(l))             return '💒';
  if (/party/.test(l))                        return '🥳';
  if (/festival|puja|pooja|diwali/.test(l))   return '🎊';
  if (/donation|charity/.test(l))             return '💝';
  if (/friend/.test(l))                       return '👫';
  if (/family/.test(l))                       return '👨‍👩‍👧';
  // Finance
  if (/invest|sip|mutual/.test(l))            return '📈';
  if (/saving/.test(l))                       return '🐷';
  if (/tax/.test(l))                          return '🧾';
  if (/misc|other/.test(l))                   return '📦';
  return '💰';
}

// ─── App ────────────────────────────────────────────────────────────────────

const App = {
  view: 'dashboard',
  month: currentYM(),
  pickerYear: new Date().getFullYear(),
  historyYear: new Date().getFullYear(),
  hideData: false,
  charts: {},
  _drag: {},
  _monthlyData: {},
  _saveTimer: null,
  _statusTimer: null,
  _bankBuf: {},
  _invBuf: { sips: {} },
  _quickCat: null,
  _sugIdx: -1,
  _breakdownView: 'grid',
  _openSections: new Set(),
  _trendRange: '6m',
  _trendYear: null,
  _invTab: 'mutual_fund',
  _bankSaveTimer: null,
  _invSaveTimer: null,
  _dragBankId: null,
  _bankSearchResults: [],
  _fundSearchResults: {},
  _catSortByAmount: false,

  _applyUserMigration() {
    // ── v1: split Bus & Metro; rename Fruits & Veg; remove unwanted grocery items ──
    if (!Storage.getSetting('migration_v1', false)) {
      const cats   = Storage.getCategories();
      const allExp = Storage._get(Storage.KEYS.expenses);
      let changed  = false;

      const transport = cats.find(c => /transport/i.test(c.label));
      if (transport) {
        const idx = transport.items.findIndex(i => /bus/i.test(i.label) && /metro/i.test(i.label));
        if (idx >= 0) {
          const old = transport.items[idx];
          const busId = uid(), metroId = uid();
          transport.items.splice(idx, 1, { id: busId, label: 'Bus' }, { id: metroId, label: 'Metro' });
          Object.values(allExp).forEach(mExp => {
            if (mExp[transport.id]?.[old.id] !== undefined) {
              mExp[transport.id][busId] = mExp[transport.id][old.id];
              delete mExp[transport.id][old.id];
            }
          });
          changed = true;
        }
      }

      const REMOVE_KW = ['vegetable', 'oil', 'spice', 'condiment', 'snack', 'beverage'];
      const groceries = cats.find(c => /grocer/i.test(c.label));
      if (groceries) {
        groceries.items = groceries.items.filter(item => {
          const l = (item.label || '').toLowerCase();
          if (/fruit/i.test(l) && /veg/i.test(l)) { item.label = 'Fruits'; changed = true; return true; }
          if (REMOVE_KW.some(kw => l.includes(kw))) {
            Object.values(allExp).forEach(mExp => { if (mExp[groceries.id]) delete mExp[groceries.id][item.id]; });
            changed = true; return false;
          }
          return true;
        });
      }

      if (changed) { Storage.saveCategories(cats); Storage._set(Storage.KEYS.expenses, allExp); }
      Storage.saveSetting('migration_v1', true);
    }

    // ── v2: rename Groceries & Cooking → Groceries & Food; remove Rice/Dal/Flour ──
    if (!Storage.getSetting('migration_v2', false)) {
      const cats2   = Storage.getCategories();
      const allExp2 = Storage._get(Storage.KEYS.expenses);
      let changed2  = false;

      const groc2 = cats2.find(c => /grocer/i.test(c.label));
      if (groc2) {
        if (/cooking/i.test(groc2.label)) { groc2.label = 'Groceries & Food'; changed2 = true; }
        const REMOVE2 = ['rice', 'dal', 'flour'];
        groc2.items = groc2.items.filter(item => {
          const l = (item.label || '').toLowerCase();
          if (REMOVE2.some(kw => l.includes(kw))) {
            Object.values(allExp2).forEach(mExp => { if (mExp[groc2.id]) delete mExp[groc2.id][item.id]; });
            changed2 = true; return false;
          }
          return true;
        });
      }

      if (changed2) { Storage.saveCategories(cats2); Storage._set(Storage.KEYS.expenses, allExp2); }
      Storage.saveSetting('migration_v2', true);
    }

    // ── v3: ensure "Other" bank card exists for all users ────────────────────
    if (!Storage.getSetting('migration_v3', false)) {
      const banks3 = Storage.getBankNames();
      if (banks3.length > 0 && !banks3.find(b => b.id === 'bank_other')) {
        banks3.push({ id: 'bank_other', label: 'Other', emoji: '🏧' });
        Storage.saveBankNames(banks3);
      }
      Storage.saveSetting('migration_v3', true);
    }
  },

  init() {
    this._applyUserMigration();
    this.initTheme();
    this.renderMonthPicker();
    this.navigate('dashboard');
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') { e.preventDefault(); this.undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); this.redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && this.view === 'monthly') { e.preventDefault(); this.quickAdd(); }
    });
  },

  undo() {
    if (this._saveTimer !== null) {
      clearTimeout(this._saveTimer);
      this._saveTimer = null;
      Storage.saveExpenses(this.month, this._monthlyData);
    }
    if (History.undo()) {
      this._monthlyData = {};
      this._bankBuf = {};
      this._invBuf  = { sips: {} };
      this.renderView(this.view);
      toast('Undone', 'success');
    }
  },

  redo() {
    if (this._saveTimer !== null) {
      clearTimeout(this._saveTimer);
      this._saveTimer = null;
      Storage.saveExpenses(this.month, this._monthlyData);
    }
    if (History.redo()) {
      this._monthlyData = {};
      this._bankBuf = {};
      this._invBuf  = { sips: {} };
      this.renderView(this.view);
      toast('Redone', 'success');
    }
  },

  // ─── THEME ────────────────────────────────────────────────────────────────

  initTheme() {
    const saved = localStorage.getItem('sw_theme') || 'dark';
    this.theme = saved;
    if (saved === 'light') document.documentElement.classList.add('light');
    this._applyThemeBtn();
  },

  toggleTheme() {
    const goLight = !document.documentElement.classList.contains('light');
    document.documentElement.classList.toggle('light', goLight);
    this.theme = goLight ? 'light' : 'dark';
    localStorage.setItem('sw_theme', this.theme);
    this._applyThemeBtn();
    // Re-render to update chart colours
    this.renderView(this.view);
  },

  _applyThemeBtn() {
    const btn = document.getElementById('themeBtn');
    if (!btn) return;
    const light = this.theme === 'light';
    btn.textContent = light ? '🌙' : '☀️';
    btn.title = light ? 'Switch to dark mode' : 'Switch to light mode';
  },

  // ─── CHART COLOR HELPERS ──────────────────────────────────────────────────
  _ct()  { return this.theme === 'light' ? '#6b7280' : '#8892a4'; },  // text
  _cg()  { return this.theme === 'light' ? '#e2e8f0' : '#252d42'; },  // grid

  // ─── NAV ──────────────────────────────────────────────────────────────────

  navigate(view) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(n => n.classList.remove('active'));
    document.getElementById('view-' + view).classList.add('active');
    const navEl = document.querySelector('.nav-tab[data-view="' + view + '"]');
    if (navEl) navEl.classList.add('active');
    this.view = view;

    // Show month bar only for views that use the selected month
    const showBar = ['monthly', 'investments'].includes(view);
    document.getElementById('monthBar').style.display = showBar ? '' : 'none';
    document.querySelector('.main').style.paddingTop = showBar ? '108px' : '58px';

    this.renderView(view);
  },

  renderView(view) {
    const map = {
      dashboard:   () => this.renderDashboard(),
      monthly:     () => this.renderMonthly(),
      income:      () => this.renderIncome(),
      investments: () => this.renderInvestments(),
      history:     () => this.renderHistory(),
      settings:    () => this.renderSettings()
    };
    if (map[view]) map[view]();
  },

  // ─── MONTH PICKER ─────────────────────────────────────────────────────────

  renderMonthPicker() {
    document.getElementById('pickerYearDisplay').textContent = this.pickerYear;
    const [selY, selM] = this.month.split('-').map(Number);
    const pills = CONFIG.monthNames.map((name, i) => {
      const m = i + 1;
      const ym = this.pickerYear + '-' + String(m).padStart(2, '0');
      const active = (this.pickerYear === selY && m === selM) ? 'active' : '';
      return `<button class="month-pill ${active}" onclick="App.selectMonth('${ym}')">${name}</button>`;
    }).join('');
    document.getElementById('monthPills').innerHTML = pills;
  },

  changePickerYear(dir) {
    this.pickerYear += dir;
    this.renderMonthPicker();
  },

  selectMonth(ym) {
    if (this._saveTimer !== null) {
      clearTimeout(this._saveTimer);
      this._saveTimer = null;
      Storage.saveExpenses(this.month, this._monthlyData);
    }
    this.month = ym;
    const [y] = ym.split('-').map(Number);
    this.pickerYear = y;
    this._monthlyData = {};
    this._bankBuf    = {};
    this._invBuf     = { sips: {} };
    this.renderMonthPicker();
    this.renderView(this.view);
  },

  // ─── HIDE DATA ────────────────────────────────────────────────────────────

  toggleHideData() {
    this.hideData = !this.hideData;
    document.body.classList.toggle('data-hidden', this.hideData);
    const btn = document.getElementById('hideBtn');
    btn.classList.toggle('on', this.hideData);
    btn.innerHTML = this.hideData ? '🔓 Reveal' : '🔒 Hide';
  },

  // ─── DASHBOARD ────────────────────────────────────────────────────────────

  renderDashboard() {
    const curMo     = currentYM();
    const lastMo    = prevMonth(curMo);
    const prevMo    = prevMonth(lastMo);
    const allMonths = Storage.getAllMonths();
    const cats      = Storage.getCategories();

    // ── All-time totals ──────────────────────────────────────────
    const income   = allMonths.reduce((s, mo) => s + Storage.getTotalIncome(mo), 0);
    const expenses = allMonths.reduce((s, mo) => s + Storage.getTotalExpenses(mo), 0);
    const savings  = income - expenses;

    // ── Bank balance ─────────────────────────────────────────────
    const bankNames       = Storage.getBankNames();
    const allBankData     = Storage._get(Storage.KEYS.banks);
    const bankMonths      = Object.keys(allBankData).sort();
    const latestBankMonth = bankMonths[bankMonths.length - 1] || null;
    const banks           = latestBankMonth ? allBankData[latestBankMonth] : {};
    const bankTotal       = bankNames.reduce((s, b) => s + Number(banks[b.id] || 0), 0);

    // ── Last-month vs prev-month deltas ──────────────────────────
    const lastExp = Storage.getTotalExpenses(lastMo);
    const prevExp = Storage.getTotalExpenses(prevMo);
    const lastInc = Storage.getTotalIncome(lastMo);
    const prevInc = Storage.getTotalIncome(prevMo);
    const deltaExp = lastExp - prevExp;
    const deltaInc = lastInc - prevInc;
    const deltaSav = (lastInc - lastExp) - (prevInc - prevExp);

    // ── Current month snapshot ────────────────────────────────────
    const curExp = Storage.getTotalExpenses(curMo);
    const curInc = Storage.getTotalIncome(curMo);

    // ── Investments ───────────────────────────────────────────────
    const funds         = Storage.getFunds();
    const allInv        = Storage.getAllInvestments();
    const totalInvested = funds.reduce((s, f) =>
      s + Object.values(allInv).reduce((ss, m) => ss + Number(m.sips?.[f.id] || 0), 0), 0);
    const curMonthInv   = funds.reduce((s, f) => s + Number(Storage.getInvestment(curMo).sips?.[f.id] || 0), 0);
    const lastMonthInv  = funds.reduce((s, f) => s + Number(Storage.getInvestment(lastMo).sips?.[f.id] || 0), 0);
    const deltaInv      = curMonthInv - lastMonthInv;

    // ── Merged all-time expenses ──────────────────────────────────
    const expMerged = {}, catMonthCounts = {};
    allMonths.forEach(mo => {
      const moExp = Storage.getExpenses(mo);
      Object.entries(moExp).forEach(([catId, items]) => {
        if (!expMerged[catId]) expMerged[catId] = {};
        let hasData = false;
        Object.entries(items).forEach(([itemId, val]) => {
          expMerged[catId][itemId] = (expMerged[catId][itemId] || 0) + Number(val || 0);
          if (Number(val) > 0) hasData = true;
        });
        if (hasData) catMonthCounts[catId] = (catMonthCounts[catId] || 0) + 1;
      });
    });

    let catTotals = cats.map(cat => ({
      cat,
      total: Object.values(expMerged[cat.id] || {}).reduce((s, v) => s + Number(v || 0), 0),
      monthCount: catMonthCounts[cat.id] || 0
    }));
    if (this._catSortByAmount) catTotals = [...catTotals].sort((a, b) => b.total - a.total);
    const totalExp = catTotals.reduce((s, x) => s + x.total, 0);

    // ── Top 5 items all-time ──────────────────────────────────────
    const allItems = [];
    cats.forEach(cat => {
      cat.items.forEach(item => {
        const total = allMonths.reduce((s, mo) =>
          s + Number((Storage.getExpenses(mo)[cat.id] || {})[item.id] || 0), 0);
        if (total > 0) allItems.push({ label: item.label, catLabel: cat.label, color: cat.color, total, emoji: itemEmoji(item.label) });
      });
    });
    allItems.sort((a, b) => b.total - a.total);
    const top5    = allItems.slice(0, 5);
    const top5Max = top5[0]?.total || 1;

    // ── Delta badge helper ────────────────────────────────────────
    const deltaBadge = (delta, lowerIsBetter = false) => {
      if (!delta) return '';
      const good  = lowerIsBetter ? delta < 0 : delta > 0;
      const arrow = delta > 0 ? '↑' : '↓';
      return `<span class="sum-delta ${good ? 'delta-good' : 'delta-bad'}">${arrow} ${fmtCr(Math.abs(delta))} vs prev month</span>`;
    };

    // ── Render HTML ───────────────────────────────────────────────
    const el = document.getElementById('view-dashboard');
    Object.keys(this.charts).filter(k => k.startsWith('cat_')).forEach(k => {
      this.charts[k].destroy(); delete this.charts[k];
    });

    el.innerHTML = `
      <div class="content-wrap">

        <!-- ── 5 Summary Cards ── -->
        <div class="summary-cards summary-cards-5">
          <div class="sum-card sum-card-income">
            <div class="sum-card-icon">💰</div>
            <div class="sum-label">Total Income</div>
            <div class="sum-value amt">${fmtCr(income)}</div>
            <div class="sum-sub">Salary + Bonus · All Time</div>
          </div>
          <div class="sum-card sum-card-expense">
            <div class="sum-card-icon">💸</div>
            <div class="sum-label">Total Expenses</div>
            <div class="sum-value amt">${fmtCr(expenses)}</div>
            <div class="sum-sub">${income ? pct(expenses, income) + '% of income' : 'No income set'}</div>
          </div>
          <div class="sum-card sum-card-savings ${savings < 0 ? 'negative' : ''}">
            <div class="sum-card-icon">${savings < 0 ? '📉' : '🐷'}</div>
            <div class="sum-label">${savings < 0 ? 'Overspent' : 'Savings'}</div>
            <div class="sum-value amt">${fmtCr(savings)}</div>
            <div class="sum-sub">${income ? pct(Math.max(savings, 0), income) + '% saved' : '—'}</div>
          </div>
          <div class="sum-card sum-card-bank">
            <div class="sum-card-icon">🏦</div>
            <div class="sum-label">Bank Balance</div>
            <div class="sum-value amt">${fmtCr(bankTotal)}</div>
            <div class="sum-sub">${latestBankMonth ? 'As of ' + monthLabel(latestBankMonth) : 'Not recorded yet'}</div>
            <div class="sum-sub">${bankNames.length} account${bankNames.length !== 1 ? 's' : ''}</div>
          </div>
          <div class="sum-card sum-card-invest">
            <div class="sum-card-icon">📈</div>
            <div class="sum-label">Total Invested</div>
            <div class="sum-value amt">${fmtCr(totalInvested)}</div>
            <div class="sum-sub">${curMonthInv > 0 ? 'This month: ' + fmtCr(curMonthInv) : 'SIPs · All Time'}</div>
          </div>
        </div>


        <!-- ── Main layout ── -->
        <div class="dash-layout">

          <!-- Left: Category breakdown -->
          <div class="dash-main">
            <div class="breakdown-header">
              <div class="dash-section-title">Expense Breakdown — All Time</div>
              <div class="dash-header-right">
                ${this._breakdownView === 'graph' ? `
                  <button class="vsw-btn-text" onclick="App.expandAllSections()">Expand All</button>
                  <span class="vsw-sep">|</span>
                  <button class="vsw-btn-text" onclick="App.collapseAllSections()">Collapse All</button>
                ` : `
                  <button class="vsw-btn-text ${this._catSortByAmount ? 'active' : ''}" onclick="App.toggleCatSort()">↕ Sort by Amount</button>
                `}
                <div class="view-switch">
                  <button class="vsw-btn ${this._breakdownView==='grid'?'active':''}" onclick="App.setBreakdownView('grid')">⊞ Grid</button>
                  <button class="vsw-btn ${this._breakdownView==='graph'?'active':''}" onclick="App.setBreakdownView('graph')">☰ Graph</button>
                </div>
              </div>
            </div>
            ${catTotals.every(x => x.total === 0)
              ? `<div class="section-card"><div class="empty-state">No expenses recorded yet.<br>
                 <button onclick="App.navigate('monthly')">+ Add Expenses</button></div></div>`
              : this._breakdownView === 'grid'
                ? `<div class="cat-grid">${catTotals.map(x => this._renderCatCardView(x.cat, x.total, totalExp, x.monthCount, expMerged)).join('')}</div>`
                : this._renderBreakdownGraph(catTotals, totalExp)
            }
          </div>

          <!-- Right: Donut + Top 5 -->
          <div class="dash-side">
            <div class="chart-panel">
              <div class="chart-title">All-Time Split</div>
              ${totalExp === 0
                ? `<div style="text-align:center;color:var(--text-muted);padding:30px 0;font-size:13px">No data yet</div>`
                : `<div class="chart-wrap"><canvas id="chartDonut"></canvas></div>`}
            </div>
            ${top5.length > 0 ? `
            <div class="top5-card">
              <div class="top5-title">🏆 Top Expenses — All Time</div>
              <div class="top5-list">
                ${top5.map((item, i) => `
                  <div class="top5-row">
                    <span class="top5-rank">${i + 1}</span>
                    <span class="top5-emoji">${item.emoji}</span>
                    <div class="top5-info">
                      <div class="top5-name">${esc(item.label)}</div>
                      <div class="top5-bar-track">
                        <div class="top5-bar-fill" style="width:${pct(item.total, top5Max)}%;background:${item.color}"></div>
                      </div>
                    </div>
                    <span class="top5-amount amt" style="color:${item.color}">${fmtCr(item.total)}</span>
                  </div>`).join('')}
              </div>
            </div>` : ''}
          </div>
        </div>

        <!-- ── Trend chart ── -->
        <div class="section-chart-card trend-card">
          <div class="trend-header">
            <div class="chart-title" style="margin:0">Income vs Expenses</div>
            <div class="trend-controls">
              <select class="trend-year-select" onchange="App.setTrendYear(this.value)">
                <option value="">All Years</option>
                ${[...new Set([...allMonths, curMo].map(m => m.slice(0,4)))].sort().reverse()
                  .map(y => `<option value="${y}" ${this._trendYear===y?'selected':''}>${y}</option>`).join('')}
              </select>
              <div class="trend-range-toggle" style="${this._trendYear ? 'opacity:.35;pointer-events:none' : ''}">
                <button class="trng-btn ${this._trendRange==='6m'?'active':''}" onclick="App.setTrendRange('6m')">6M</button>
                <button class="trng-btn ${this._trendRange==='12m'?'active':''}" onclick="App.setTrendRange('12m')">12M</button>
                <button class="trng-btn ${this._trendRange==='all'?'active':''}" onclick="App.setTrendRange('all')">All</button>
              </div>
            </div>
          </div>
          <div class="trend-chart-wrap"><canvas id="chartTrend"></canvas></div>
        </div>

      </div>`;

    // ── Donut chart with center total ─────────────────────────────
    if (totalExp > 0) {
      const nonZero = catTotals.filter(x => x.total > 0);
      const _self = this;
      const centerPlugin = {
        id: 'centerTotal',
        afterDraw(chart) {
          const { ctx } = chart;
          const meta = chart.getDatasetMeta(0);
          if (!meta.data.length) return;
          const cx = meta.data[0].x;
          const cy = meta.data[0].y;
          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = '600 10px Inter, sans-serif';
          ctx.fillStyle = _self._ct();
          ctx.fillText('ALL TIME', cx, cy - 13);
          ctx.font = '800 14px Inter, sans-serif';
          ctx.fillStyle = _self.theme === 'light' ? '#1a202c' : '#e2e8f0';
          ctx.fillText(fmtCr(totalExp), cx, cy + 8);
          ctx.restore();
        }
      };
      setTimeout(() => {
        if (this.charts.donut) this.charts.donut.destroy();
        const ctx = document.getElementById('chartDonut');
        if (!ctx) return;
        this.charts.donut = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: nonZero.map(x => x.cat.label),
            datasets: [{ data: nonZero.map(x => x.total), backgroundColor: nonZero.map(x => x.cat.color + 'cc'), borderColor: nonZero.map(x => x.cat.color), borderWidth: 2 }]
          },
          options: {
            responsive: true, maintainAspectRatio: true, cutout: '65%',
            animation: { duration: 800, easing: 'easeInOutQuart' },
            plugins: {
              legend: { position: 'bottom', labels: { color: this._ct(), font: { size: 11 }, padding: 8, boxWidth: 12 } },
              tooltip: { callbacks: { label: c => ' ' + c.label + ': ' + fmtCr(c.raw) + ' (' + pct(c.raw, totalExp) + '%)' } }
            }
          },
          plugins: [centerPlugin]
        });
      }, 60);
    }

    // ── Trend chart ────────────────────────────────────────────────
    const range = this._trendRange || '6m';
    let trendMonths = [];
    if (this._trendYear) {
      // Year view: show all 12 months of the selected year
      for (let mo = 1; mo <= 12; mo++) {
        trendMonths.push(this._trendYear + '-' + String(mo).padStart(2, '0'));
      }
    } else if (range === 'all') {
      trendMonths = [...allMonths];
      if (!trendMonths.includes(curMo)) trendMonths.push(curMo);
      trendMonths.sort();
    } else {
      const count = range === '12m' ? 12 : 6;
      let m = curMo;
      for (let i = 0; i < count; i++) { trendMonths.unshift(m); m = prevMonth(m); }
    }
    const nonZeroTrend = trendMonths.filter(mo => Storage.getTotalExpenses(mo) > 0 || Storage.getTotalIncome(mo) > 0);
    const avgMonthlyExp = nonZeroTrend.length
      ? Math.round(nonZeroTrend.reduce((s, mo) => s + Storage.getTotalExpenses(mo), 0) / nonZeroTrend.length)
      : 0;

    setTimeout(() => {
      if (this.charts.trend) this.charts.trend.destroy();
      const ctx = document.getElementById('chartTrend');
      if (!ctx) return;

      const months = trendMonths;

      const incD = months.map(mo => Storage.getTotalIncome(mo));
      const expD = months.map(mo => Storage.getTotalExpenses(mo));
      // Savings only meaningful when income exists — clamp to 0 otherwise
      const savD = months.map((_, i) => incD[i] > 0 ? incD[i] - expD[i] : 0);
      const avgD = months.map(() => avgMonthlyExp);

      // Show savings line only when at least one month has income data
      const hasSavingsData = incD.some(v => v > 0);

      const incBg = months.map(mo => mo === curMo ? '#22d3eecc' : '#22d3ee66');
      const expBg = months.map(mo => mo === curMo ? '#f87171cc' : '#f8717166');

      const datasets = [
        {
          label: 'Income', data: incD, type: 'bar',
          backgroundColor: incBg, borderColor: '#22d3ee',
          borderWidth: 1.5, borderRadius: 6, order: 3
        },
        {
          label: 'Expenses', data: expD, type: 'bar',
          backgroundColor: expBg, borderColor: '#f87171',
          borderWidth: 1.5, borderRadius: 6, order: 3
        }
      ];

      if (hasSavingsData) {
        datasets.push({
          label: 'Savings', data: savD, type: 'line',
          borderColor: '#a5b4fc', backgroundColor: 'transparent',
          fill: false, tension: 0.4, pointRadius: 5, borderWidth: 2,
          pointBackgroundColor: savD.map(v => v >= 0 ? '#4ade80' : '#f87171'),
          pointBorderColor: savD.map(v => v >= 0 ? '#4ade80' : '#f87171'),
          segment: { borderColor: ctx => ctx.p1.parsed.y < 0 ? '#f87171aa' : '#a5b4fc' },
          order: 1
        });
      }

      if (avgMonthlyExp > 0) {
        datasets.push({
          label: 'Avg Expense', data: avgD, type: 'line',
          borderColor: '#f59e0b', borderDash: [5, 4], borderWidth: 1.5,
          pointRadius: 0, fill: false, tension: 0, order: 2
        });
      }

      this.charts.trend = new Chart(ctx, {
        type: 'bar',
        data: { labels: months.map(monthLabel), datasets },
        options: {
          responsive: true, maintainAspectRatio: false,
          animation: { duration: 600 },
          plugins: {
            legend: { labels: { color: this._ct(), font: { size: 11 }, boxWidth: 14, padding: 16 } },
            tooltip: {
              callbacks: {
                label: c => ' ' + c.dataset.label + ': ₹' + Number(c.raw).toLocaleString('en-IN')
              }
            }
          },
          scales: {
            x: { ticks: { color: this._ct() }, grid: { color: this._cg() } },
            y: {
              min: 0,
              ticks: {
                color: this._ct(),
                callback: v => {
                  const av = Math.abs(v);
                  if (av >= 1e7) return '₹' + (v / 1e7).toFixed(1) + 'Cr';
                  if (av >= 1e5) return '₹' + (v / 1e5).toFixed(1) + 'L';
                  if (av >= 1000) return '₹' + Math.round(v / 1000) + 'k';
                  return '₹' + v;
                }
              },
              grid: { color: this._cg() }
            }
          }
        }
      });
    }, 60);

    if (this._breakdownView === 'graph') {
      setTimeout(() => this._openSections.forEach(catId => this._renderSectionItemHTML(catId)), 80);
    }
  },

  _renderCatCardView(cat, total, grandTotal, monthCount, expMerged) {
    const pctOfTotal = grandTotal ? pct(total, grandTotal) : 0;
    const emoji = CAT_EMOJIS[cat.id] || itemEmoji(cat.label);
    const isDim = total === 0;
    let topItem = null;
    if (total > 0 && expMerged?.[cat.id]) {
      let topAmt = 0;
      cat.items.forEach(item => {
        const v = Number(expMerged[cat.id][item.id] || 0);
        if (v > topAmt) { topAmt = v; topItem = { label: item.label, total: v }; }
      });
    }
    return `
      <div class="cat-card ${isDim ? 'cat-card-dim' : ''}" style="background:linear-gradient(135deg,${cat.color}55 0%,${cat.color}22 100%);border-color:${cat.color}88;cursor:default;">
        <div class="cat-card-top">
          <div class="cat-card-emoji-bg">${emoji}</div>
          <div class="cat-card-info">
            <div class="cat-card-name">${esc(cat.label)}</div>
            <div class="cat-card-total amt" style="color:${cat.color}">${fmtCr(total)}</div>
            ${total > 0
              ? `<div class="cat-card-items-count">${pctOfTotal}% of total</div>`
              : `<div class="cat-card-items-count" style="opacity:.4">No data yet</div>`}
          </div>
        </div>
        ${topItem ? `
        <div class="cat-card-top-item">
          <span class="cat-card-top-label">Top: ${esc(topItem.label)}</span>
          <span class="cat-card-top-amt" style="color:${cat.color}">${fmtCr(topItem.total)}</span>
        </div>` : '<div style="height:8px"></div>'}
        <div class="cat-card-bar-wrap">
          <div class="cat-card-bar-fill" style="width:${pctOfTotal}%;background:${cat.color}99"></div>
        </div>
      </div>`;
  },

  setBreakdownView(v) {
    this._breakdownView = v;
    if (v === 'graph') {
      Storage.getCategories().forEach(c => this._openSections.add(c.id));
    } else {
      this._openSections.clear();
    }
    this.renderView(this.view);
  },

  expandAllSections() {
    Storage.getCategories().forEach(c => this._openSections.add(c.id));
    this.renderView(this.view);
  },

  collapseAllSections() {
    this._openSections.clear();
    this.renderView(this.view);
  },

  setTrendRange(range) {
    this._trendRange = range;
    this.renderDashboard();
  },

  setTrendYear(year) {
    this._trendYear = year || null;
    this.renderDashboard();
  },

  toggleCatSort() {
    this._catSortByAmount = !this._catSortByAmount;
    this.renderDashboard();
  },

  _renderBreakdownGraph(catTotals, totalExp) {
    return `<div class="graph-accordion">
      ${catTotals.map(({ cat, total, monthCount }) => {
        const isOpen   = this._openSections.has(cat.id);
        const pctBar   = totalExp ? pct(total, totalExp) : 0;
        const monthTxt = monthCount === 0 ? '' : monthCount === 1 ? 'Over 1 month' : 'Across ' + monthCount + ' months';
        const itemTxt  = cat.items.length > 0 ? cat.items.length + ' item' + (cat.items.length !== 1 ? 's' : '') : '';
        const metaParts = [total > 0 ? pctBar + '% of total' : null, monthTxt || null, itemTxt || null].filter(Boolean);
        return `
          <div class="gsec ${isOpen ? 'open' : ''}" id="gsec-${cat.id}" style="border-left-color:${cat.color};background:linear-gradient(135deg,${cat.color}22 0%,${cat.color}08 100%);border-color:${cat.color}55">
            <div class="gsec-header" onclick="App.toggleSection('${cat.id}')">
              <span class="gsec-chevron">${isOpen ? '▲' : '▼'}</span>
              <span class="gsec-emoji" style="font-size:16px;opacity:.7">${CAT_EMOJIS[cat.id] || ''}</span>
              <span class="gsec-name">${esc(cat.label)}</span>
              <span class="gsec-total amt" style="color:${cat.color}">${total > 0 ? fmtCr(total) : '—'}</span>
              <span class="gsec-meta">${metaParts.join(' · ')}</span>
            </div>
            <div class="gsec-body">
              <div class="gsec-items-wrap" id="gsecItemWrap-${cat.id}" style="display:${isOpen ? 'block' : 'none'}"></div>
            </div>
          </div>`;
      }).join('')}
    </div>`;
  },

  toggleSection(catId) {
    const isNowOpen = !this._openSections.has(catId);
    if (isNowOpen) this._openSections.add(catId);
    else           this._openSections.delete(catId);

    const sec      = document.getElementById('gsec-' + catId);
    const chevron  = sec?.querySelector('.gsec-chevron');
    const itemWrap = document.getElementById('gsecItemWrap-' + catId);
    if (!sec) return;

    sec.classList.toggle('open', isNowOpen);
    if (chevron) chevron.textContent = isNowOpen ? '▲' : '▼';

    if (isNowOpen) {
      itemWrap.style.display = 'block';
      setTimeout(() => this._renderSectionItemHTML(catId), 30);
    } else {
      itemWrap.style.display = 'none';
      itemWrap.innerHTML = '';
    }
  },

  _renderSectionItemHTML(catId) {
    const cats = Storage.getCategories();
    const cat  = cats.find(c => c.id === catId);
    if (!cat) return;
    const allMonths = Storage.getAllMonths();
    const wrap = document.getElementById('gsecItemWrap-' + catId);
    if (!wrap) return;

    const itemTotals = cat.items.map(item => ({
      label: item.label,
      emoji: itemEmoji(item.label),
      total: allMonths.reduce((s, mo) => s + Number((Storage.getExpenses(mo)[catId] || {})[item.id] || 0), 0)
    })).filter(x => x.total > 0).sort((a, b) => b.total - a.total);

    if (!itemTotals.length) {
      wrap.innerHTML = '<div style="color:var(--text-muted);font-size:12px;padding:8px 4px 4px">No item data yet</div>';
      return;
    }

    const grandTotal = itemTotals.reduce((s, x) => s + x.total, 0);
    wrap.innerHTML = `<div class="item-bars">
      ${itemTotals.map((item, i) => {
        const barPct = pct(item.total, grandTotal);
        return `<div class="item-bar-row" style="--delay:${i * 0.07}s">
          <div class="item-bar-label">
            <div class="item-bar-label-name">${esc(item.label)}</div>
            <div class="item-bar-label-pct" style="color:${cat.color}">${barPct}%</div>
          </div>
          <div class="item-bar-track">
            <div class="item-bar-fill" style="--bar-pct:${barPct}%;background:${cat.color}bb;border:1px solid ${cat.color}"></div>
            <span class="item-bar-emoji" style="--pct:${barPct}%;--delay:${i * 0.07}s">${item.emoji}</span>
          </div>
          <div class="item-bar-amount" style="color:${cat.color}">${fmtCr(item.total)}</div>
        </div>`;
      }).join('')}
    </div>`;

    requestAnimationFrame(() => requestAnimationFrame(() => {
      wrap.querySelectorAll('.item-bar-fill, .item-bar-emoji').forEach(el => el.classList.add('slide-in'));
    }));
  },

  // ─── QUICK ADD ────────────────────────────────────────────────────────────

  selectQuickCat(catId, rerender = true) {
    this._quickCat = catId;
    // Update chip styles
    document.querySelectorAll('.cat-chip').forEach(el => el.classList.remove('active'));
    const chip = document.getElementById('qchip-' + catId);
    if (chip) chip.classList.add('active');
    // Repopulate item dropdown
    const cats = Storage.getCategories();
    const cat  = cats.find(c => c.id === catId);
    const sel  = document.getElementById('qItem');
    if (sel && cat) {
      const customItems = Storage.getCustomItemsForCat(catId);
      const customOpts  = customItems.map(i =>
        `<option value="${cat.id}|${i.id}" class="custom-remembered">${esc(i.label)}</option>`
      ).join('');
      sel.innerHTML = cat.items.map(i =>
        `<option value="${cat.id}|${i.id}">${esc(i.label)}</option>`
      ).join('') + customOpts +
        `<option value="${cat.id}|__other__" class="other-option">＋ Other (type custom)…</option>`;
    }
    // Hide custom input when category changes
    const otherInput = document.getElementById('qOtherLabel');
    if (otherInput) { otherInput.style.display = 'none'; otherInput.value = ''; }
  },

  onItemSelectChange() {
    const sel        = document.getElementById('qItem');
    const otherInput = document.getElementById('qOtherLabel');
    if (!otherInput || !sel) return;
    const [, itemId] = (sel.value || '').split('|');
    if (itemId === '__other__') {
      otherInput.style.display = 'block';
      otherInput.focus();
    } else {
      otherInput.style.display = 'none';
      otherInput.value = '';
    }
  },

  quickAdd() {
    const amt     = Number(document.getElementById('qAmt')?.value || 0);
    const selVal  = document.getElementById('qItem')?.value || '';
    if (amt <= 0 || !selVal) return toast('Enter amount and select a category item', 'error');

    let [catId, itemId] = selVal.split('|');
    const cats = Storage.getCategories();
    const cat  = cats.find(c => c.id === catId);

    let customLabel = '';
    if (itemId === '__other__') {
      customLabel = (document.getElementById('qOtherLabel')?.value || '').trim();
      if (!customLabel) return toast('Type a name for the custom item', 'error');
      // Save to separate custom-items store — never touches cat.items / grid
      itemId = Storage.addCustomItem(catId, customLabel);
    }

    // Look up label: regular item first, then custom items store
    const item = cat?.items.find(i => i.id === itemId)
      || Storage.getCustomItemsForCat(catId).find(i => i.id === itemId);
    const exp  = Storage.getExpenses(this.month);
    if (!exp[catId]) exp[catId] = {};
    History.push();
    exp[catId][itemId] = Number(exp[catId][itemId] || 0) + amt;
    this._showSaveStatus('saving');
    Storage.saveExpenses(this.month, exp);
    this._showSaveStatus('saved');
    document.getElementById('qAmt').value  = '';
    document.getElementById('qDesc').value = '';
    const otherInput = document.getElementById('qOtherLabel');
    if (otherInput) { otherInput.value = ''; otherInput.style.display = 'none'; }
    toast('Added ' + fmt(amt) + ' → ' + (item?.label || cat?.label || 'item'));
    this.renderView(this.view);
    // Reset category + subcategory selection after add
    document.querySelectorAll('.cat-chip').forEach(el => el.classList.remove('active'));
    this._quickCat = null;
    const qItem = document.getElementById('qItem');
    if (qItem) qItem.innerHTML = '<option value="">— Select subcategory —</option>';
  },

  onDescKeyDown(e) {
    const box = document.getElementById('descSuggestions');
    if (e.key === 'Escape') {
      if (box) { box.innerHTML = ''; box.style.display = 'none'; }
      this._sugIdx = -1;
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const items = box ? Array.from(box.querySelectorAll('.desc-sug-item')) : [];
      if (!items.length) return;
      this._sugIdx = e.key === 'ArrowDown'
        ? Math.min(this._sugIdx + 1, items.length - 1)
        : Math.max(this._sugIdx - 1, 0);
      items.forEach((el, i) => el.classList.toggle('sug-active', i === this._sugIdx));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const items = box ? Array.from(box.querySelectorAll('.desc-sug-item')) : [];
      const t = items[this._sugIdx >= 0 ? this._sugIdx : 0];
      if (t) { this.applySuggestion(t.dataset.catId, t.dataset.itemId, t.dataset.label); }
      else { document.getElementById('qAmt')?.focus(); }
    }
  },

  onDescInput(val) {
    const box = document.getElementById('descSuggestions');
    if (!box) return;
    const q = val.trim().toLowerCase();
    this._sugIdx = -1;
    if (q.length < 2) { box.innerHTML = ''; box.style.display = 'none'; return; }

    const cats        = Storage.getCategories();
    const customAll   = Storage.getCustomItems();
    const matches     = [];
    cats.forEach(cat => {
      cat.items.forEach(item => {
        if ((item.label || '').toLowerCase().includes(q)) {
          matches.push({ catId: cat.id, itemId: item.id, itemLabel: item.label, catLabel: cat.label, catColor: cat.color });
        }
      });
      // Also search custom (quick-add only) items
      (customAll[cat.id] || []).forEach(item => {
        if ((item.label || '').toLowerCase().includes(q)) {
          matches.push({ catId: cat.id, itemId: item.id, itemLabel: item.label, catLabel: cat.label, catColor: cat.color });
        }
      });
    });

    if (!matches.length) { box.innerHTML = ''; box.style.display = 'none'; return; }

    box.style.display = 'block';
    box.innerHTML = matches.slice(0, 6).map(m => {
      const safeLabel = (m.itemLabel || '').replace(/"/g, '&quot;');
      return `<div class="desc-sug-item"
        data-cat-id="${m.catId}" data-item-id="${m.itemId}" data-label="${safeLabel}"
        onmousedown="event.preventDefault();App.applySuggestion(this.dataset.catId,this.dataset.itemId,this.dataset.label)">
        <span class="sug-label">${m.itemLabel}</span>
        <span class="sug-cat" style="color:${m.catColor}">${m.catLabel}</span>
      </div>`;
    }).join('');
  },

  applySuggestion(catId, itemId, label) {
    this._sugIdx = -1;
    const descInput = document.getElementById('qDesc');
    if (descInput) descInput.value = label;
    const box = document.getElementById('descSuggestions');
    if (box) { box.innerHTML = ''; box.style.display = 'none'; }
    this.selectQuickCat(catId);
    setTimeout(() => {
      const sel = document.getElementById('qItem');
      if (sel) sel.value = catId + '|' + itemId;
      document.getElementById('qAmt')?.focus();
    }, 30);
  },

  // ─── MONTHLY ENTRY ────────────────────────────────────────────────────────

  renderMonthly() {
    const ym   = this.month;
    const cats = Storage.getCategories();
    const exp  = Storage.getExpenses(ym);

    this._monthlyData = {};
    cats.forEach(cat => {
      this._monthlyData[cat.id] = Object.assign({}, exp[cat.id] || {});
    });

    const firstCat = cats[0];
    const catChips = cats.map(c =>
      `<button class="cat-chip" id="qchip-${c.id}" tabindex="-1"
         style="--chip-color:${c.color};color:${c.color};border-color:${c.color};"
         onclick="App.selectQuickCat('${c.id}')">${c.label}</button>`
    ).join('');
    const itemOpts = firstCat
      ? firstCat.items.map(i => `<option value="${firstCat.id}|${i.id}">${i.label}</option>`).join('')
      : '';

    const totalExp    = Storage.getTotalExpenses(ym);
    const monthLabel  = CONFIG.monthNames[parseInt(ym.split('-')[1]) - 1];
    const monthFull   = CONFIG.monthFull[parseInt(ym.split('-')[1]) - 1];
    const totalBudget = cats.reduce((s, cat) => s + Number(exp[cat.id]?.expected || 0), 0);
    const budgetPct   = totalBudget ? Math.min(Math.round(totalExp / totalBudget * 100), 100) : 0;
    const overAll     = totalBudget && totalExp > totalBudget;

    const el = document.getElementById('view-monthly');
    el.innerHTML = `
      <div class="content-wrap">

        <!-- Hero spending summary -->
        <div class="monthly-hero">
          <div class="monthly-hero-left">
            <div class="monthly-hero-label">Total Spent — ${monthFull}</div>
            <div class="monthly-hero-amount amt ${overAll ? 'over' : ''}" id="heroAmount">${fmt(totalExp)}</div>
            ${totalBudget ? `<div class="monthly-hero-budget ${overAll ? 'over' : ''}" id="heroBudget">
              ${overAll ? '⚠ Over budget by ' + fmt(totalExp - totalBudget) : fmt(totalBudget - totalExp) + ' remaining of ' + fmt(totalBudget) + ' budget'}
            </div>` : '<div class="monthly-hero-budget" id="heroBudget"></div>'}
          </div>
          ${totalBudget ? `<div class="monthly-hero-ring">
            <svg viewBox="0 0 64 64" class="hero-ring-svg">
              <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="8"/>
              <circle cx="32" cy="32" r="26" fill="none" stroke="${overAll ? 'var(--red)' : 'var(--primary)'}" stroke-width="8"
                stroke-dasharray="${Math.round(163.4 * budgetPct / 100)} 163.4"
                stroke-linecap="round" transform="rotate(-90 32 32)"/>
            </svg>
            <span class="hero-ring-pct">${budgetPct}%</span>
          </div>` : ''}
        </div>

        <!-- Category totals bar -->
        <div class="monthly-bar" id="mbar">
          ${cats.map(cat => {
            const total = cat.items.reduce((s, i) => s + Number(exp[cat.id]?.[i.id] || 0), 0);
            return `<div class="mbar-item" data-cat-id="${cat.id}" style="border-top:3px solid ${cat.color};cursor:pointer;" title="Jump to ${cat.label}"
              onclick="App.scrollToCard('${cat.id}')">
              <div class="mbar-label" style="color:${cat.color}">${cat.label}</div>
              <div class="mbar-value amt" id="msb-${cat.id}">${fmt(total)}</div>
            </div>`;
          }).join('')}
          <div class="mbar-item mbar-grand">
            <div class="mbar-label">Total</div>
            <div class="mbar-value amt" id="msb-grand">${fmt(totalExp)}</div>
          </div>
        </div>

        <!-- Breakdown Chart + Quick Add -->
        <div class="monthly-top-row">
          <div class="chart-panel monthly-breakdown">
            <div class="chart-title">Breakdown — ${monthLabel}</div>
            ${totalExp === 0
              ? `<div class="no-chart-msg">No expenses yet</div>`
              : `<div class="chart-wrap"><canvas id="chartMonthlyDonut"></canvas></div>`}
          </div>
          <div class="monthly-quick-add">
            <div class="quick-add-header">
              <div class="quick-add-title">Log Your Spending</div>
            </div>
            <div class="quick-desc-wrap">
              <input class="quick-input" id="qDesc" placeholder="Search to auto-select…"
                oninput="App.onDescInput(this.value)" autocomplete="off"
                onkeydown="App.onDescKeyDown(event)" />
              <div class="desc-suggestions" id="descSuggestions"></div>
            </div>
            <input class="quick-input" id="qAmt" type="number" min="0" placeholder="Amount (₹)"
              onkeydown="if(event.key==='-'||event.key==='e'){event.preventDefault();}else if(event.key==='Enter'){event.preventDefault();App.quickAdd();}else if(event.key==='Tab'){event.preventDefault();document.getElementById('qItem')?.focus();}" />
            <div class="cat-chips-wrap"><div class="cat-chips" id="qChips">${catChips}</div></div>
            <select class="item-select" id="qItem"
              onchange="App.onItemSelectChange()"
              onkeydown="if(event.key==='Enter'){event.preventDefault();App.quickAdd();}">${itemOpts}</select>
            <input class="quick-input" id="qOtherLabel" placeholder="Type custom subcategory name…" autocomplete="off"
              style="display:none;margin-top:6px;"
              onkeydown="if(event.key==='Enter'){event.preventDefault();App.quickAdd();}" />
            <button class="btn-quick-add" onclick="App.quickAdd()">+ Add Expense</button>
          </div>
        </div>

        <!-- Category cards -->
        <div class="cat-grid" id="catGrid">
          ${cats.map(cat => this._renderCatCard(cat, exp)).join('')}
          <div class="cat-add-section-card" onclick="App.showAddSection()">
            <div class="cas-icon">＋</div>
            <div class="cas-label">Add Section</div>
          </div>
        </div>

      </div>`;

    if (cats.length > 0) this.selectQuickCat(cats[0].id, false);

    // Animate hero total count-up
    const heroEl = document.getElementById('heroAmount');
    if (heroEl && totalExp > 0) {
      heroEl.textContent = fmt(0);
      setTimeout(() => this._animateCount(heroEl, totalExp), 60);
    }

    // Monthly breakdown donut
    if (totalExp > 0) {
      const truncLbl = s => s.length > 28 ? s.slice(0, 26) + '…' : s;
      const nonZero = cats.map(cat => ({
        label: cat.label, color: cat.color,
        total: cat.items.reduce((s, i) => s + Number(exp[cat.id]?.[i.id] || 0), 0)
      })).filter(x => x.total > 0);
      setTimeout(() => {
        if (this.charts.monthlyDonut) this.charts.monthlyDonut.destroy();
        const ctx = document.getElementById('chartMonthlyDonut');
        if (!ctx) return;
        this.charts.monthlyDonut = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: nonZero.map(x => truncLbl(x.label)),
            datasets: [{ data: nonZero.map(x => x.total), backgroundColor: nonZero.map(x => x.color + 'cc'), borderColor: nonZero.map(x => x.color), borderWidth: 2 }]
          },
          options: {
            responsive: true, maintainAspectRatio: true, cutout: '62%', aspectRatio: 1.3,
            layout: { padding: { left: 8, right: 16 } },
            plugins: {
              legend: { position: 'right', labels: { color: this._ct(), font: { size: 12 }, padding: 14, boxWidth: 14 } },
              tooltip: { callbacks: { title: i => nonZero[i[0].dataIndex]?.label || i[0].label, label: c => ': ' + fmt(c.raw) + ' (' + pct(c.raw, totalExp) + '%)' } }
            }
          }
        });
      }, 0);
    }
  },

  _getCatEmoji(cat) {
    if (cat.emoji) return cat.emoji;
    if (CAT_EMOJIS[cat.id]) return CAT_EMOJIS[cat.id];
    const l = (cat.label || '').toLowerCase();
    if (/entertain|movie|cinema|game|event|concert/.test(l)) return '🎬';
    if (/grocery|groceries|cook|cooking|dairy|vegetable|fruit/.test(l)) return '🛒';
    if (/dining|restaurant|food|eat|snack|bakery|cafe|juice/.test(l)) return '🍽️';
    if (/transport|car|bus|fuel|petrol|commute|cab|auto|bike/.test(l)) return '🚗';
    if (/trip|travel|vacation|holiday|flight|hotel/.test(l)) return '✈️';
    if (/shop|shopping|cloth|fashion|apparel/.test(l)) return '🛍️';
    if (/bill|utility|electric|water|internet|gas/.test(l)) return '💡';
    if (/family|friend|person|gift|relative/.test(l)) return '👨‍👩‍👧';
    if (/personal|care|beauty|gym|fitness|spa|grooming/.test(l)) return '🌸';
    if (/health|medical|doctor|medicine|pharmacy/.test(l)) return '🏥';
    if (/phone|recharge|mobile|data|sim/.test(l)) return '📱';
    if (/invest|saving|stock|mutual|fund/.test(l)) return '📈';
    if (/education|school|course|book|learn/.test(l)) return '📚';
    if (/home|house|rent|maintenance|repair/.test(l)) return '🏠';
    return '💰';
  },

  _renderCatCard(cat, exp) {
    const catData     = exp[cat.id] || {};
    // Custom items that have a value this month (hidden in other months)
    const customItems = Storage.getCustomItemsForCat(cat.id)
      .filter(i => Number(catData[i.id] || 0) > 0);
    const allItems    = [...cat.items, ...customItems];
    const total       = allItems.reduce((s, i) => s + Number(catData[i.id] || 0), 0);
    const subtitle    = allItems.length
      ? `${allItems.length} expense${allItems.length > 1 ? 's' : ''} · ${allItems.map(i => i.label || 'Untitled').join(', ')}`
      : '';

    const rowsHtml = cat.items.map(item => this._renderCatRow(cat.id, item, catData[item.id])).join('')
      + customItems.map(item => this._renderCatRow(cat.id, item, catData[item.id], true)).join('');

    const catEmoji   = this._getCatEmoji(cat);
    const budget     = Number(catData.expected || 0);
    const pctUsed    = budget ? Math.min(Math.round(total / budget * 100), 100) : 0;
    const overBudget = budget && total > budget;
    const budgetBar  = budget ? `
      <div class="cat-budget-wrap" id="cbudget-${cat.id}">
        <div class="cat-budget-track">
          <div class="cat-budget-fill ${overBudget ? 'over' : ''}" style="width:${pctUsed}%;background:${overBudget ? 'var(--red)' : cat.color}"></div>
        </div>
        <span class="cat-budget-label ${overBudget ? 'over' : ''}" onclick="App.editBudget('${cat.id}')" title="Edit budget">
          ${overBudget ? '⚠ ' : ''}${pctUsed}% of ${fmt(budget)}
        </span>
      </div>` : `<div class="cat-budget-wrap" id="cbudget-${cat.id}"></div>`;
    const actionBtns = `
      <button class="cat-edit-btn" onclick="App.editCatName('${cat.id}')" title="Edit section">✏️</button>
      ${cat.userAdded ? `<button class="cat-del-btn" onclick="App.deleteCatCard('${cat.id}')" title="Delete section">🗑</button>` : ''}`;
    return `
      <div class="cat-card" data-cat-id="${cat.id}" draggable="true"
        style="background:linear-gradient(135deg,${cat.color}55 0%,${cat.color}22 100%);border-color:${cat.color}60;"
        ondragstart="App.onCatDragStart(event,'${cat.id}')"
        ondragover="App.onCatDragOver(event,'${cat.id}')"
        ondragleave="App.onCatDragLeave(event)"
        ondrop="App.onCatDrop(event,'${cat.id}')"
        ondragend="App.onCatDragEnd(event)">
        <div class="cat-card-top">
          <div class="cat-icon-box" aria-hidden="true">${catEmoji}</div>
          <div class="cat-card-info">
            <div class="cat-header-row">
              <span class="cat-card-name" id="cname-${cat.id}">${cat.label}</span>
              ${actionBtns}
              <span class="cat-card-total amt" id="ctotal-${cat.id}" style="color:${cat.color}">${fmt(total)}</span>
            </div>
            <div class="cat-card-items-count">${subtitle}</div>
          </div>
          <button class="cat-add-btn" onclick="App.addCatRow('${cat.id}')" title="Add expense">+</button>
        </div>
        ${budgetBar}
        <div class="cat-card-rows" id="crow-${cat.id}">
          ${rowsHtml}
        </div>
      </div>`;
  },

  _renderCatRow(catId, item, value, isCustom = false) {
    const safeLabel = (item.label || '').replace(/"/g, '&quot;');
    const labelField = isCustom
      ? `<span class="cat-row-name-custom" title="Custom entry">${esc(item.label)}</span>`
      : `<input type="text" class="cat-row-name-inp" draggable="false"
          id="lbl-${catId}-${item.id}"
          value="${safeLabel}" placeholder="New expense"
          onchange="App.updateItemLabel('${catId}','${item.id}',this.value)"
          onkeydown="if(event.key==='Enter'){event.preventDefault();document.getElementById('inp-${catId}-${item.id}')?.focus();}" />`;
    return `
      <div class="cat-row${isCustom ? ' cat-row-custom' : ''}" id="crow-${catId}-${item.id}" draggable="${!isCustom}">
        <span class="cat-row-drag" title="${isCustom ? '' : 'Drag to reorder'}" style="${isCustom ? 'opacity:0;pointer-events:none' : ''}">⠿</span>
        <span class="cat-row-sep">₹</span>
        <input type="number" min="0" class="item-inp" draggable="false"
          id="inp-${catId}-${item.id}"
          value="${value || ''}" placeholder="0"
          onkeydown="if(event.key==='-'||event.key==='e'){event.preventDefault();}"
          oninput="App.onItemInput('${catId}','${item.id}',this.value)" />
        ${labelField}
        <button class="btn-del-row" draggable="false" onclick="App.removeCatRow('${catId}','${item.id}',${isCustom})" title="Remove">🗑</button>
      </div>`;
  },

  updateItemLabel(catId, itemId, newLabel) {
    const cats = Storage.getCategories();
    const cat  = cats.find(c => c.id === catId);
    if (!cat) return;
    const item = cat.items.find(i => i.id === itemId);
    if (item) { History.push(); item.label = newLabel.trim(); Storage.saveCategories(cats); }
  },

  addCatRow(catId) {
    const cats = Storage.getCategories();
    const cat  = cats.find(c => c.id === catId);
    if (!cat) return;

    // Re-use an existing item not yet shown this month
    let item = cat.items.find(i => !document.getElementById('inp-' + catId + '-' + i.id));

    if (!item) {
      // Create a brand-new item
      History.push();
      item = { id: 'item_' + Date.now(), label: '' };
      cat.items.push(item);
      Storage.saveCategories(cats);
    }

    const container = document.getElementById('crow-' + catId);
    if (!container) return;

    const hint = container.querySelector('.cat-empty-hint');
    if (hint) hint.remove();

    container.insertAdjacentHTML('beforeend', this._renderCatRow(catId, item, ''));

    const lblInp = document.getElementById('lbl-' + catId + '-' + item.id);
    const amtInp = document.getElementById('inp-' + catId + '-' + item.id);
    if (lblInp && !item.label) lblInp.focus();
    else if (amtInp) amtInp.focus();
  },

  removeCatRow(catId, itemId, isCustom = false) {
    const existingVal = Number(this._monthlyData?.[catId]?.[itemId] || 0);
    if (existingVal > 0) {
      const inp  = document.getElementById(`inp-${catId}-${itemId}`);
      const lbl  = document.getElementById(`lbl-${catId}-${itemId}`);
      const name = lbl?.value?.trim() || document.querySelector(`#crow-${catId}-${itemId} .cat-row-name-custom`)?.textContent?.trim() || 'this expense';
      if (!confirm(`Remove "${name}" (₹${existingVal.toLocaleString('en-IN')})? This cannot be undone.`)) return;
    }
    History.push();
    if (this._monthlyData[catId]) delete this._monthlyData[catId][itemId];

    const cats = Storage.getCategories();
    const cat  = cats.find(c => c.id === catId);

    if (isCustom) {
      // Only clear the expense value — keep the custom item in the dropdown store
      const exp = Storage.getExpenses(this.month);
      if (exp[catId]) { delete exp[catId][itemId]; Storage.saveExpenses(this.month, exp); }
    } else if (cat) {
      cat.items = cat.items.filter(i => i.id !== itemId);
      Storage.saveCategories(cats);
      // Also clear expense value
      const exp = Storage.getExpenses(this.month);
      if (exp[catId]) { delete exp[catId][itemId]; Storage.saveExpenses(this.month, exp); }
    }

    // Recalculate category total (includes custom items via getCategoryTotal)
    const catTotal = Storage.getCategoryTotal(this.month, catId);
    const ctot = document.getElementById('ctotal-' + catId);
    if (ctot) ctot.textContent = fmt(catTotal);
    const msb = document.getElementById('msb-' + catId);
    if (msb) msb.textContent = fmt(catTotal);

    const grand    = Storage.getTotalExpenses(this.month);
    const grandEl  = document.getElementById('msb-grand');
    if (grandEl) grandEl.textContent = fmt(grand);
    this._updateHeroTotal();

    document.getElementById('crow-' + catId + '-' + itemId)?.remove();
    this._updateMonthlyChart();
  },

  showAddSection() {
    document.getElementById('_addSecModal')?.remove();
    this._asmEmoji = '💰';
    const COLORS  = ['#ea580c','#0891b2','#dc2626','#16a34a','#9f1239','#1d4ed8','#7c3aed','#be185d','#b45309','#0f766e','#4338ca','#15803d'];
    const cats    = Storage.getCategories();
    this._asmColor = COLORS[cats.length % COLORS.length];
    const PALETTE = ['🏠','🚗','🍽️','🛍️','💡','📱','🎬','✈️','🏥','📚','💰','🎯',
                     '🌸','⚽','🎸','🏋️','🍔','☕','🎮','💻','🌿','🎁','💊','🛒',
                     '🍱','🎓','⚡','🏖️','🐾','🎪','🧴','🎨'];
    const overlay = document.createElement('div');
    overlay.id    = '_addSecModal';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal add-sec-modal">
        <h3>Add New Section</h3>
        <div class="asm-row">
          <span class="asm-emoji-big" id="asmEmoji">💰</span>
          <input class="quick-input asm-name-inp" id="asmName"
                 placeholder="e.g. Pets, Medical, Hobbies…" maxlength="30"
                 oninput="App._asmOnInput(this.value)"
                 onkeydown="if(event.key==='Enter')App._submitAddSection()" />
        </div>
        <div class="asm-palette-label">Choose color</div>
        <div class="asm-color-row" id="asmColorRow">
          ${COLORS.map(c => `<button class="asm-color-btn${c===this._asmColor?' asm-color-active':''}" data-c="${c}" style="background:${c}" onclick="App._asmPickColor(this.dataset.c)" title="${c}"></button>`).join('')}
        </div>
        <div class="asm-palette-label">Choose emoji</div>
        <div class="asm-palette">
          ${PALETTE.map(e => `<button class="asm-emoji-btn" data-e="${e}" onclick="App._asmPickEmoji(this.dataset.e)">${e}</button>`).join('')}
        </div>
        <div class="modal-actions">
          <button onclick="document.getElementById('_addSecModal').remove()">Cancel</button>
          <button onclick="App._submitAddSection()">Add Section</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    setTimeout(() => document.getElementById('asmName')?.focus(), 50);
  },

  _asmPickColor(color) {
    this._asmColor = color;
    document.querySelectorAll('#asmColorRow .asm-color-btn').forEach(b => b.classList.toggle('asm-color-active', b.dataset.c === color));
  },

  _getEmojiFromLabel(label) {
    const l = (label || '').toLowerCase();
    if (/entertain|movie|cinema|game|event|concert/.test(l)) return '🎬';
    if (/grocer|cook|dairy|vegetable|fruit/.test(l))         return '🛒';
    if (/dining|restaurant|food|eat|delivery|cafe|juice/.test(l)) return '🍔';
    if (/transport|car|bus|fuel|petrol|commute|cab|bike/.test(l)) return '🚗';
    if (/trip|travel|vacation|holiday|flight|hotel/.test(l)) return '✈️';
    if (/shop|shopping|cloth|fashion/.test(l))               return '🛍️';
    if (/bill|utility|electric|water|internet|gas/.test(l))  return '💡';
    if (/family|friend|gift|relative/.test(l))               return '🎁';
    if (/personal|care|beauty|gym|fitness|spa|grooming/.test(l)) return '🌸';
    if (/health|medical|doctor|medicine|pharmacy/.test(l))   return '💊';
    if (/phone|recharge|mobile|data|sim/.test(l))            return '📱';
    if (/invest|saving|stock|mutual|fund/.test(l))           return '📈';
    if (/education|school|course|book|learn/.test(l))        return '📚';
    if (/home|house|rent|maintenance|repair/.test(l))        return '🏠';
    if (/pet|dog|cat|animal/.test(l))                        return '🐾';
    if (/sport|football|cricket|gym|workout/.test(l))        return '⚽';
    if (/music|guitar|concert|sing/.test(l))                 return '🎸';
    return '💰';
  },

  _asmHighlight(emoji) {
    document.querySelectorAll('.asm-emoji-btn').forEach(btn => {
      btn.classList.toggle('asm-active', btn.dataset.e === emoji);
    });
  },

  _asmOnInput(val) {
    const suggested    = this._getEmojiFromLabel(val);
    this._asmEmoji     = suggested;
    const preview      = document.getElementById('asmEmoji');
    if (preview) preview.textContent = suggested;
    this._asmHighlight(suggested);
  },

  _asmPickEmoji(emoji) {
    this._asmEmoji = emoji;
    const preview  = document.getElementById('asmEmoji');
    if (preview) preview.textContent = emoji;
    this._asmHighlight(emoji);
  },

  _submitAddSection() {
    const nameEl = document.getElementById('asmName');
    const name   = (nameEl?.value || '').trim();
    if (!name) { nameEl?.focus(); return; }
    document.getElementById('_addSecModal')?.remove();
    History.push();
    const cats  = Storage.getCategories();
    const color = this._asmColor || '#7c3aed';
    cats.push({ id: 'cat_' + Date.now(), label: name, color, emoji: this._asmEmoji, items: [], userAdded: true });
    Storage.saveCategories(cats);
    this.renderView(this.view);
    toast('"' + name + '" section added');
  },

  editCatName(catId) {
    const cats = Storage.getCategories();
    const cat  = cats.find(c => c.id === catId);
    if (!cat) return;
    document.getElementById('_editSecModal')?.remove();
    this._ecmEmoji = this._getCatEmoji(cat);
    this._ecmColor = cat.color || '#7c3aed';
    const COLORS  = ['#ea580c','#0891b2','#dc2626','#16a34a','#9f1239','#1d4ed8','#7c3aed','#be185d','#b45309','#0f766e','#4338ca','#15803d'];
    const PALETTE = ['🏠','🚗','🍽️','🛍️','💡','📱','🎬','✈️','🏥','📚','💰','🎯',
                     '🌸','⚽','🎸','🏋️','🍔','☕','🎮','💻','🌿','🎁','💊','🛒',
                     '🍱','🎓','⚡','🏖️','🐾','🎪','🧴','🎨'];
    const safeName = cat.label.replace(/"/g,'&quot;');
    const overlay  = document.createElement('div');
    overlay.id     = '_editSecModal';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal add-sec-modal">
        <h3>Edit Section</h3>
        <div class="asm-row">
          <span class="asm-emoji-big" id="ecmEmoji">${this._ecmEmoji}</span>
          <input class="quick-input asm-name-inp" id="ecmName"
                 value="${safeName}" maxlength="30"
                 onkeydown="if(event.key==='Enter')App._submitEditSection('${catId}');if(event.key==='Escape')document.getElementById('_editSecModal').remove()" />
        </div>
        <div class="asm-palette-label">Choose color</div>
        <div class="asm-color-row" id="ecmColorRow">
          ${COLORS.map(c => `<button class="asm-color-btn${c===this._ecmColor?' asm-color-active':''}" data-c="${c}" style="background:${c}" onclick="App._ecmPickColor(this.dataset.c)" title="${c}"></button>`).join('')}
        </div>
        <div class="asm-palette-label">Choose emoji</div>
        <div class="asm-palette" id="ecmPalette">
          ${PALETTE.map(e => `<button class="asm-emoji-btn" data-e="${e}" onclick="App._ecmPickEmoji(this.dataset.e)">${e}</button>`).join('')}
        </div>
        <div class="modal-actions">
          <button onclick="document.getElementById('_editSecModal').remove()">Cancel</button>
          <button onclick="App._submitEditSection('${catId}')">Save</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    setTimeout(() => {
      this._ecmHighlight(this._ecmEmoji);
      const inp = document.getElementById('ecmName');
      if (inp) { inp.focus(); inp.select(); }
    }, 50);
  },

  _ecmPickColor(color) {
    this._ecmColor = color;
    document.querySelectorAll('#ecmColorRow .asm-color-btn').forEach(b => b.classList.toggle('asm-color-active', b.dataset.c === color));
  },

  _ecmPickEmoji(emoji) {
    this._ecmEmoji = emoji;
    const preview  = document.getElementById('ecmEmoji');
    if (preview) preview.textContent = emoji;
    this._ecmHighlight(emoji);
  },

  _ecmHighlight(emoji) {
    document.querySelectorAll('#ecmPalette .asm-emoji-btn').forEach(btn => {
      btn.classList.toggle('asm-active', btn.dataset.e === emoji);
    });
  },

  _submitEditSection(catId) {
    const nameEl = document.getElementById('ecmName');
    const name   = (nameEl?.value || '').trim();
    if (!name) { nameEl?.focus(); return; }
    document.getElementById('_editSecModal')?.remove();
    History.push();
    const cats = Storage.getCategories();
    const cat  = cats.find(c => c.id === catId);
    if (!cat) return;
    cat.label = name;
    cat.emoji = this._ecmEmoji;
    cat.color = this._ecmColor;
    Storage.saveCategories(cats);
    const nameSpan = document.getElementById('cname-' + catId);
    if (nameSpan) nameSpan.textContent = name;
    const iconBox  = document.querySelector(`[data-cat-id="${catId}"] .cat-icon-box`);
    if (iconBox)  iconBox.textContent = this._ecmEmoji;
    const mbarItem = document.querySelector(`#mbar [data-cat-id="${catId}"]`);
    if (mbarItem) { mbarItem.style.borderTopColor = this._ecmColor; }
    const mbarLbl  = mbarItem?.querySelector('.mbar-label');
    if (mbarLbl)  { mbarLbl.textContent = name; mbarLbl.style.color = this._ecmColor; }
    const card = document.querySelector(`.cat-card[data-cat-id="${catId}"]`);
    if (card) {
      card.style.background = `linear-gradient(135deg,${this._ecmColor}55 0%,${this._ecmColor}22 100%)`;
      card.style.borderColor = this._ecmColor + '60';
    }
    const totalEl = document.getElementById('ctotal-' + catId);
    if (totalEl) totalEl.style.color = this._ecmColor;
    toast('Section updated');
  },

  deleteCatCard(catId) {
    const cats = Storage.getCategories();
    const cat  = cats.find(c => c.id === catId);
    if (!cat) return;
    document.getElementById('_delCatModal')?.remove();
    const safeName = cat.label.replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const overlay  = document.createElement('div');
    overlay.id     = '_delCatModal';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal del-cat-modal">
        <div class="del-warn-header">
          <div class="del-warn-icon">!</div>
          <span class="del-warn-title">Warning</span>
          <button class="del-warn-close" onclick="document.getElementById('_delCatModal').remove()">×</button>
        </div>
        <div class="del-warn-body">
          <p>Are you sure you want to delete <strong>"${safeName}"</strong>?<br>
             All expense data inside this section will be permanently removed.</p>
        </div>
        <div class="del-warn-footer">
          <button class="del-cat-no"  onclick="document.getElementById('_delCatModal').remove()">No, Keep It</button>
          <button class="del-cat-yes" onclick="App._doDeleteCat('${catId}')">Yes, Delete</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  },

  _doDeleteCat(catId) {
    document.getElementById('_delCatModal')?.remove();
    History.push();
    let cats = Storage.getCategories();
    cats = cats.filter(c => c.id !== catId);
    this._showSaveStatus('saving');
    Storage.saveCategories(cats);
    const allExp = Storage._get(Storage.KEYS.expenses);
    Object.values(allExp).forEach(mExp => { delete mExp[catId]; });
    Storage._set(Storage.KEYS.expenses, allExp);
    this._showSaveStatus('saved');
    this.renderView(this.view);
    toast('Section deleted');
  },

  // ── Section drag-and-drop ──────────────────────────────────────────────────

  onCatDragStart(e, catId) {
    // inputs and buttons handle their own events; rows use stopPropagation
    if (e.target.closest('input') || e.target.closest('button')) {
      e.preventDefault();
      return;
    }
    this._drag = { type: 'cat', catId };
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', catId);
    setTimeout(() => {
      const el = document.querySelector(`[data-cat-id="${catId}"]`);
      if (el) el.classList.add('dragging');
    }, 0);
  },

  onCatDragOver(e, catId) {
    if (!this._drag) return;
    if (this._drag.type === 'cat') {
      if (this._drag.catId === catId) return;
    } else if (this._drag.type === 'row') {
      if (this._drag.catId === catId) return;
    } else return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
  },

  onCatDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      e.currentTarget.classList.remove('drag-over');
    }
  },

  onCatDrop(e, targetCatId) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    if (!this._drag) return;

    if (this._drag.type === 'cat') {
      if (this._drag.catId === targetCatId) return;
      History.push();
      const cats    = Storage.getCategories();
      const fromIdx = cats.findIndex(c => c.id === this._drag.catId);
      const toIdx   = cats.findIndex(c => c.id === targetCatId);
      if (fromIdx < 0 || toIdx < 0) return;
      const [moved] = cats.splice(fromIdx, 1);
      cats.splice(toIdx, 0, moved);
      Storage.saveCategories(cats);
      const grid      = document.getElementById('catGrid');
      const draggedEl = grid.querySelector(`[data-cat-id="${this._drag.catId}"]`);
      const targetEl  = grid.querySelector(`[data-cat-id="${targetCatId}"]`);
      if (draggedEl && targetEl) {
        if (fromIdx < toIdx) targetEl.after(draggedEl);
        else targetEl.before(draggedEl);
      }
      // Mirror reorder in the summary bar
      const mbar        = document.getElementById('mbar');
      const draggedMbar = mbar?.querySelector(`[data-cat-id="${this._drag.catId}"]`);
      const targetMbar  = mbar?.querySelector(`[data-cat-id="${targetCatId}"]`);
      if (draggedMbar && targetMbar) {
        if (fromIdx < toIdx) targetMbar.after(draggedMbar);
        else targetMbar.before(draggedMbar);
      }
    } else if (this._drag.type === 'row') {
      const { catId: srcCatId, itemId: srcItemId } = this._drag;
      if (srcCatId === targetCatId) return;
      this._moveRowToCard(srcCatId, srcItemId, targetCatId, null);
    }
  },

  onCatDragEnd(e) {
    document.querySelectorAll('.cat-card').forEach(el =>
      el.classList.remove('dragging', 'drag-over'));
    this._drag = {};
  },

  // ── Row drag-and-drop ──────────────────────────────────────────────────────

  onRowDragStart(e, catId, itemId) {
    // Inputs/buttons are draggable=false so they won't trigger this;
    // stopPropagation prevents the parent card's dragstart from overwriting _drag
    e.stopPropagation();
    this._drag = { type: 'row', catId, itemId };
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId);
    setTimeout(() => {
      const el = document.getElementById('crow-' + catId + '-' + itemId);
      if (el) el.classList.add('dragging');
    }, 0);
  },

  onRowDragOver(e, catId, itemId) {
    if (!this._drag || this._drag.type !== 'row') return;
    if (this._drag.catId === catId && this._drag.itemId === itemId) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
  },

  onRowDragLeave(e) {
    if (!this._drag || this._drag.type !== 'row') return;
    if (!e.currentTarget.contains(e.relatedTarget)) {
      e.currentTarget.classList.remove('drag-over');
    }
  },

  onRowDrop(e, catId, itemId) {
    if (!this._drag || this._drag.type !== 'row') return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');

    const { catId: srcCatId, itemId: srcItemId } = this._drag;
    if (srcCatId === catId && srcItemId === itemId) return;

    if (srcCatId === catId) {
      // Same-card reorder
      History.push();
      const cats = Storage.getCategories();
      const cat  = cats.find(c => c.id === catId);
      if (!cat) return;
      const fromIdx = cat.items.findIndex(i => i.id === srcItemId);
      const toIdx   = cat.items.findIndex(i => i.id === itemId);
      if (fromIdx < 0 || toIdx < 0) return;
      const [moved] = cat.items.splice(fromIdx, 1);
      cat.items.splice(toIdx, 0, moved);
      Storage.saveCategories(cats);
      const draggedEl = document.getElementById('crow-' + catId + '-' + srcItemId);
      const targetEl  = document.getElementById('crow-' + catId + '-' + itemId);
      if (draggedEl && targetEl) {
        if (fromIdx < toIdx) targetEl.after(draggedEl);
        else targetEl.before(draggedEl);
      }
    } else {
      // Cross-card: insert before the target row
      this._moveRowToCard(srcCatId, srcItemId, catId, itemId);
    }
  },

  _moveRowToCard(srcCatId, srcItemId, targetCatId, beforeItemId) {
    History.push();
    const cats      = Storage.getCategories();
    const srcCat    = cats.find(c => c.id === srcCatId);
    const targetCat = cats.find(c => c.id === targetCatId);
    if (!srcCat || !targetCat) return;

    const srcIdx = srcCat.items.findIndex(i => i.id === srcItemId);
    if (srcIdx < 0) return;
    const [movedItem] = srcCat.items.splice(srcIdx, 1);

    if (beforeItemId) {
      const toIdx = targetCat.items.findIndex(i => i.id === beforeItemId);
      targetCat.items.splice(toIdx < 0 ? targetCat.items.length : toIdx, 0, movedItem);
    } else {
      targetCat.items.push(movedItem);
    }

    // Migrate expense values across all months
    const allExp = Storage._get(Storage.KEYS.expenses);
    Object.keys(allExp).forEach(month => {
      const mExp = allExp[month];
      if (mExp[srcCatId]?.[srcItemId] !== undefined) {
        if (!mExp[targetCatId]) mExp[targetCatId] = {};
        mExp[targetCatId][srcItemId] = mExp[srcCatId][srcItemId];
        delete mExp[srcCatId][srcItemId];
      }
    });
    Storage._set(Storage.KEYS.expenses, allExp);

    // Sync _monthlyData buffer
    if (this._monthlyData[srcCatId]?.[srcItemId] !== undefined) {
      if (!this._monthlyData[targetCatId]) this._monthlyData[targetCatId] = {};
      this._monthlyData[targetCatId][srcItemId] = this._monthlyData[srcCatId][srcItemId];
      delete this._monthlyData[srcCatId][srcItemId];
    }

    Storage.saveCategories(cats);
    this.renderMonthly();
    toast('Moved to ' + (targetCat.label || 'section'));
  },

  onRowDragEnd(e) {
    document.querySelectorAll('.cat-row').forEach(el =>
      el.classList.remove('dragging', 'drag-over'));
    this._drag = {};
  },

  onItemInput(catId, itemId, value) {
    if (!this._saveTimer) History.push();
    if (!this._monthlyData[catId]) this._monthlyData[catId] = {};
    this._monthlyData[catId][itemId] = Math.max(0, Number(value) || 0);

    // Sum all keys in monthlyData for this cat (includes custom items)
    const d     = this._monthlyData[catId] || {};
    const total = Object.values(d).reduce((s, v) => s + Number(v || 0), 0);

    const ctot = document.getElementById('ctotal-' + catId);
    if (ctot) ctot.textContent = fmt(total);
    const msb = document.getElementById('msb-' + catId);
    if (msb) msb.textContent = fmt(total);

    let grand = 0;
    Object.values(this._monthlyData).forEach(cd => {
      Object.values(cd || {}).forEach(v => { grand += Number(v || 0); });
    });
    const grandEl = document.getElementById('msb-grand');
    if (grandEl) grandEl.textContent = fmt(grand);
    this._updateHeroTotal();

    clearTimeout(this._saveTimer);
    clearTimeout(this._chartTimer);
    this._showSaveStatus('saving');
    this._chartTimer = setTimeout(() => this._updateMonthlyChart(), 300);
    this._saveTimer = setTimeout(() => {
      Storage.saveExpenses(this.month, this._monthlyData);
      this._saveTimer = null;
      this._showSaveStatus('saved');
    }, 600);
  },

  _animateCount(el, target, duration = 900) {
    if (!el || target <= 0) return;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target);
    };
    requestAnimationFrame(tick);
  },

  _updateHeroTotal() {
    const amtEl = document.getElementById('heroAmount');
    if (!amtEl) return;
    const cats = Storage.getCategories();
    let grand = 0;
    cats.forEach(c => {
      const cd = this._monthlyData[c.id] || {};
      grand += c.items.reduce((s, i) => s + Number(cd[i.id] || 0), 0);
    });
    amtEl.textContent = fmtCr(grand);
    const exp = Storage.getExpenses(this.month);
    const totalBudget = cats.reduce((s, cat) => s + Number(exp[cat.id]?.expected || 0), 0);
    const overAll = totalBudget && grand > totalBudget;
    const budgetPct = totalBudget ? Math.min(Math.round(grand / totalBudget * 100), 100) : 0;
    amtEl.className = 'monthly-hero-amount amt' + (overAll ? ' over' : '');
    const budgetEl = document.getElementById('heroBudget');
    if (budgetEl && totalBudget) {
      budgetEl.className = 'monthly-hero-budget' + (overAll ? ' over' : '');
      budgetEl.textContent = overAll
        ? '⚠ Over budget by ' + fmt(grand - totalBudget)
        : fmt(totalBudget - grand) + ' remaining of ' + fmt(totalBudget) + ' budget';
    }
    const ring = document.querySelector('.hero-ring-svg circle:last-child');
    if (ring && totalBudget) {
      ring.setAttribute('stroke', overAll ? 'var(--red)' : 'var(--primary)');
      ring.setAttribute('stroke-dasharray', Math.round(163.4 * budgetPct / 100) + ' 163.4');
    }
    const pctEl = document.querySelector('.hero-ring-pct');
    if (pctEl && totalBudget) pctEl.textContent = budgetPct + '%';
  },

  _showSaveStatus(state) {
    const el = document.getElementById('autoSaveStatus');
    if (!el) return;
    clearTimeout(this._statusTimer);
    el.className = 'autosave-status visible' + (state === 'saved' ? ' saved' : '');
    el.textContent = state === 'saving' ? 'Saving...' : '✓ Saved';
    if (state === 'saved') {
      this._statusTimer = setTimeout(() => {
        el.classList.remove('visible', 'saved');
      }, 2000);
    }
  },

  _updateMonthlyChart() {
    const cats  = Storage.getCategories();
    const exp   = this._monthlyData || {};
    let grand   = 0;
    const truncLbl = s => s.length > 28 ? s.slice(0, 26) + '…' : s;
    const nonZero = cats.map(cat => {
      const total = cat.items.reduce((s, i) => s + Number((exp[cat.id] || {})[i.id] || 0), 0);
      grand += total;
      return { label: cat.label, shortLabel: truncLbl(cat.label), color: cat.color, total };
    }).filter(x => x.total > 0);

    const panel   = document.querySelector('.monthly-breakdown');
    const titleEl = panel?.querySelector('.chart-title');
    const title   = titleEl?.textContent || '';

    if (grand === 0) {
      if (this.charts.monthlyDonut) { this.charts.monthlyDonut.destroy(); this.charts.monthlyDonut = null; }
      if (panel) panel.innerHTML = `<div class="chart-title">${title}</div><div class="no-chart-msg">No expenses yet</div>`;
      return;
    }

    if (this.charts.monthlyDonut) {
      this.charts.monthlyDonut.data.labels = nonZero.map(x => x.shortLabel);
      this.charts.monthlyDonut.data.datasets[0].data  = nonZero.map(x => x.total);
      this.charts.monthlyDonut.data.datasets[0].backgroundColor = nonZero.map(x => x.color + 'cc');
      this.charts.monthlyDonut.data.datasets[0].borderColor     = nonZero.map(x => x.color);
      this.charts.monthlyDonut.update('none');
    } else {
      if (panel) panel.innerHTML = `<div class="chart-title">${title}</div><div class="chart-wrap"><canvas id="chartMonthlyDonut"></canvas></div>`;
      const ctx = document.getElementById('chartMonthlyDonut');
      if (!ctx) return;
      this.charts.monthlyDonut = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: nonZero.map(x => x.shortLabel),
          datasets: [{ data: nonZero.map(x => x.total), backgroundColor: nonZero.map(x => x.color + 'cc'), borderColor: nonZero.map(x => x.color), borderWidth: 2 }]
        },
        options: {
          responsive: true, maintainAspectRatio: true, cutout: '62%', aspectRatio: 1.3,
          layout: { padding: { left: 8, right: 16 } },
          plugins: {
            legend: { position: 'right', labels: { color: this._ct(), font: { size: 12 }, padding: 14, boxWidth: 14 } },
            tooltip: { callbacks: { title: i => nonZero[i[0].dataIndex]?.label || i[0].label, label: c => ': ' + fmtCr(c.raw) + ' (' + pct(c.raw, grand) + '%)' } }
          }
        }
      });
    }
  },

  editBudget(catId) {
    const exp = Storage.getExpenses(this.month);
    if (!exp[catId]) exp[catId] = {};
    const current = Number(exp[catId].expected || 0);
    const raw = prompt(`Set monthly budget for this category (₹):\nLeave empty or 0 to remove budget.`, current || '');
    if (raw === null) return;
    History.push();
    const val = Number(raw) || 0;
    if (val > 0) exp[catId].expected = val; else delete exp[catId].expected;
    this._showSaveStatus('saving');
    Storage.saveExpenses(this.month, exp);
    this._showSaveStatus('saved');
    this.renderView(this.view);
  },

  copyLastMonth() {
    const prev    = prevMonth(this.month);
    const prevExp = Storage.getExpenses(prev);
    const hasData = Object.values(prevExp).some(d => Object.values(d).some(v => Number(v) > 0));
    if (!hasData) return toast('No data found in ' + CONFIG.monthNames[parseInt(prev.split('-')[1]) - 1], 'error');
    const curExp  = Storage.getExpenses(this.month);
    const hasCurrentData = Object.values(curExp).some(d => Object.values(d).some(v => Number(v) > 0));
    if (hasCurrentData && !confirm('This will overwrite existing amounts for this month. Continue?')) return;
    History.push();
    this._showSaveStatus('saving');
    Storage.saveExpenses(this.month, JSON.parse(JSON.stringify(prevExp)));
    this._showSaveStatus('saved');
    const mn = CONFIG.monthNames[parseInt(prev.split('-')[1]) - 1];
    toast('Copied from ' + mn);
    this.renderView(this.view);
  },

  scrollToCard(catId) {
    const card = document.querySelector(`.cat-card[data-cat-id="${catId}"]`);
    if (!card) return;
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.style.transition = 'box-shadow .2s';
    card.style.boxShadow = '0 0 0 3px rgba(255,255,255,.5)';
    setTimeout(() => { card.style.boxShadow = ''; }, 900);
  },

  saveMonthly() {
    const cats = Storage.getCategories();
    cats.forEach(cat => {
      if (!this._monthlyData[cat.id]) this._monthlyData[cat.id] = {};
      cat.items.forEach(item => {
        const inp = document.getElementById(`inp-${cat.id}-${item.id}`);
        if (inp) this._monthlyData[cat.id][item.id] = Number(inp.value) || 0;
      });
    });
    Storage.saveExpenses(this.month, this._monthlyData);
    toast('Saved expenses for ' + monthLabel(this.month));
  },

  changeMonth(dir) {
    if (this._saveTimer !== null) {
      clearTimeout(this._saveTimer);
      this._saveTimer = null;
      Storage.saveExpenses(this.month, this._monthlyData);
    }
    this.month = dir === -1 ? prevMonth(this.month) : nextMonth(this.month);
    const [y] = this.month.split('-').map(Number);
    this.pickerYear = y;
    this._monthlyData = {};
    this.renderMonthPicker();
    this.renderMonthly();
  },

  // ─── INCOME ───────────────────────────────────────────────────────────────

  renderIncome() {
    // Collect all tracked income months (union of expense + income keys)
    const allMonths = Storage.getAllMonths();
    // Also include income-only months from getAllIncome
    const incomeOnly = Object.keys(Storage.getAllIncome());
    incomeOnly.forEach(m => { if (!allMonths.includes(m)) allMonths.push(m); });
    allMonths.sort();

    // ── Totals ──
    let totSalary = 0, totBonus = 0, totExpenses = 0;
    allMonths.forEach(m => {
      const inc = Storage.getIncome(m);
      totSalary   += Number(inc.salary || 0);
      totBonus    += Number(inc.bonus  || 0);
      totExpenses += Storage.getTotalExpenses(m);
    });
    const totIncome  = totSalary + totBonus;
    const netSavings = totIncome - totExpenses;
    const savRate    = totIncome ? Math.round((Math.max(netSavings, 0) / totIncome) * 100) : 0;

    // ── Averages ──
    const n = allMonths.length || 1;
    const avgInc = Math.round(totIncome   / n);
    const avgExp = Math.round(totExpenses / n);
    const avgSav = Math.round(netSavings  / n);

    // ── Best savings month ──
    let bestMo = '', bestSav = -Infinity;
    allMonths.forEach(m => {
      const inc = Storage.getIncome(m);
      const sal = Number(inc.salary || 0);
      const bon = Number(inc.bonus  || 0);
      const sav = sal + bon - Storage.getTotalExpenses(m);
      if (sav > bestSav) { bestSav = sav; bestMo = m; }
    });

    // ── Gauge deg ──
    const gaugeDeg = Math.round(savRate * 3.6); // 0–360

    // ── Savings rate label ──
    let rateEmoji = '—';
    if (savRate >= 30) rateEmoji = '🟢 Great';
    else if (savRate >= 15) rateEmoji = '🟡 Good';
    else if (savRate > 0)  rateEmoji = '🔴 Low';

    // ── Gauge color ──
    const gaugeColor = savRate >= 30 ? '#22c55e' : savRate >= 15 ? '#f59e0b' : '#ef4444';

    const el = document.getElementById('view-income');
    el.innerHTML = `
<div class="income-page">

  <!-- ── Hero ── -->
  <div class="income-hero">
    <div class="income-hero-left">
      <div class="income-hero-icon">💰</div>
      <div>
        <div class="income-hero-title">Income &amp; Savings</div>
        <div class="income-hero-sub">Track your earnings, expenses &amp; wealth growth across ${allMonths.length} month${allMonths.length !== 1 ? 's' : ''}</div>
      </div>
    </div>
  </div>

  <!-- ── KPI Cards ── -->
  <div class="income-kpi-grid">
    <div class="income-kpi kpi-income">
      <div class="kpi-icon-wrap">💰</div>
      <div>
        <div class="kpi-label">Total Income</div>
        <div class="kpi-value amt" id="kpi-val-income">${fmtCr(totIncome)}</div>
        <div class="kpi-trend">${allMonths.length} months tracked</div>
      </div>
    </div>
    <div class="income-kpi kpi-salary">
      <div class="kpi-icon-wrap">💼</div>
      <div>
        <div class="kpi-label">Salary</div>
        <div class="kpi-value amt">${fmtCr(totSalary)}</div>
        <div class="kpi-trend">${totIncome ? pct(totSalary, totIncome) : 0}% of income</div>
      </div>
    </div>
    <div class="income-kpi kpi-bonus">
      <div class="kpi-icon-wrap">🎁</div>
      <div>
        <div class="kpi-label">Bonus / Other</div>
        <div class="kpi-value amt">${fmtCr(totBonus)}</div>
        <div class="kpi-trend">${totIncome ? pct(totBonus, totIncome) : 0}% of income</div>
      </div>
    </div>
    <div class="income-kpi kpi-expense">
      <div class="kpi-icon-wrap">💸</div>
      <div>
        <div class="kpi-label">Total Spent</div>
        <div class="kpi-value amt" id="kpi-val-expense">${fmtCr(totExpenses)}</div>
        <div class="kpi-trend">${totIncome ? pct(totExpenses, totIncome) : 0}% of income</div>
      </div>
    </div>
    <div class="income-kpi ${netSavings >= 0 ? 'kpi-savings' : 'kpi-savings-neg'}">
      <div class="kpi-icon-wrap">${netSavings >= 0 ? '🏦' : '⚠️'}</div>
      <div>
        <div class="kpi-label">Net Savings</div>
        <div class="kpi-value amt" id="kpi-val-savings">${fmtCr(netSavings)}</div>
        <div class="kpi-trend" id="kpi-pct-savings">${totIncome ? savRate + '% saved' : '—'}</div>
      </div>
    </div>
  </div>

  <!-- ── Insights Row ── -->
  <div class="income-insights-row">

    <!-- Savings Rate Gauge -->
    <div class="insight-card">
      <div class="insight-label">💹 Savings Rate</div>
      <div class="insight-gauge-wrap">
        <div class="insight-gauge" style="background: conic-gradient(${gaugeColor} 0deg ${gaugeDeg}deg, var(--border) ${gaugeDeg}deg 360deg); --gauge-deg:${gaugeDeg}deg;">
          <div class="insight-gauge-inner">
            <div class="insight-gauge-val">${savRate}%</div>
          </div>
        </div>
      </div>
      <div class="insight-sub">${rateEmoji}</div>
    </div>

    <!-- Monthly Averages -->
    <div class="insight-card">
      <div class="insight-label">📊 Monthly Averages</div>
      <div class="insight-avg-rows">
        <div class="insight-avg-row">
          <div class="insight-avg-icon">💰</div>
          <div class="insight-avg-name">Income avg</div>
          <div class="insight-avg-val" style="color:#22d3ee">${fmtCr(avgInc)}</div>
        </div>
        <div class="insight-avg-row">
          <div class="insight-avg-icon">💸</div>
          <div class="insight-avg-name">Expense avg</div>
          <div class="insight-avg-val" style="color:#f87171">${fmtCr(avgExp)}</div>
        </div>
        <div class="insight-avg-row">
          <div class="insight-avg-icon">🏦</div>
          <div class="insight-avg-name">Savings avg</div>
          <div class="insight-avg-val" style="color:${avgSav >= 0 ? '#4ade80' : '#f87171'}">${fmtCr(avgSav)}</div>
        </div>
      </div>
    </div>

    <!-- Best Savings Month -->
    <div class="insight-card">
      <div class="insight-label">🏆 Best Savings Month</div>
      ${bestSav > 0
        ? `<div class="insight-best-month">
            <div class="insight-best-name">${monthLabel(bestMo)}</div>
            <div class="insight-best-val" style="color:#4ade80">${fmtCr(bestSav)}</div>
           </div>`
        : `<div class="insight-empty">No savings data yet</div>`
      }
    </div>
  </div>

  <!-- ── Monthly Breakdown Table ── -->
  <div class="income-table-card">
    <div class="income-table-header">
      <div class="income-table-title">📅 Monthly Breakdown</div>
      <div class="inc-year-nav">
        <div class="inc-year-pill">
          <button class="inc-year-btn" onclick="App.setIncTableYear(${this._incTableYear - 1})" title="Previous year">‹</button>
          <span class="inc-year-label">📆 ${this._incTableYear}</span>
          <button class="inc-year-btn" onclick="App.setIncTableYear(${this._incTableYear + 1})" title="Next year">›</button>
        </div>
        <button class="btn-add-month-big" onclick="App.showAddMonthModal()">＋ Add Month</button>
      </div>
    </div>
    <div class="table-wrap">
      <table class="data-table income-table-new">
        <thead>
          <tr>
            <th>Month</th>
            <th class="text-right">💼 Salary (₹)</th>
            <th class="text-right">🎁 Bonus (₹)</th>
            <th class="text-right">💰 Total Income</th>
            <th class="text-right">💸 Expenses</th>
            <th class="text-right">🏦 Savings</th>
            <th class="text-right">Rate</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${(() => {
            const yrMonths = allMonths.filter(m => m.startsWith(String(this._incTableYear)));
            if (!yrMonths.length) return `<tr><td colspan="8" style="text-align:center;padding:28px;color:var(--text-muted);font-size:13px">No data for ${this._incTableYear}</td></tr>`;
            return yrMonths.map(m => {
              const inc = Storage.getIncome(m);
              const sal = Number(inc.salary || 0);
              const bon = Number(inc.bonus  || 0);
              const tot = sal + bon;
              const exp = Storage.getTotalExpenses(m);
              const sav = tot - exp;
              const mRate = tot ? Math.round((Math.max(sav, 0) / tot) * 100) : 0;
              const isEmpty = sal === 0 && bon === 0 && exp === 0;
              const rateColor = mRate >= 30 ? '#22c55e' : mRate >= 15 ? '#f59e0b' : '#ef4444';
              const dotColor  = sav >= 0 ? '#22c55e' : '#ef4444';
              const shortMo   = CONFIG.monthNames[parseInt(m.split('-')[1]) - 1];
              return `
                <tr data-income-month="${esc(m)}" class="income-row${isEmpty ? ' income-row-empty' : ''}">
                  <td>
                    <div class="inc-month-label">
                      <span class="inc-month-dot" style="background:${dotColor}"></span>
                      ${shortMo}
                    </div>
                  </td>
                  <td class="text-right">
                    <input type="number" class="table-input" value="${sal || ''}" placeholder="0"
                      onchange="App.saveIncomeRow('${esc(m)}','salary',this.value)" />
                  </td>
                  <td class="text-right">
                    <input type="number" class="table-input" value="${bon || ''}" placeholder="0"
                      onchange="App.saveIncomeRow('${esc(m)}','bonus',this.value)" />
                  </td>
                  <td class="text-right c-income w-bold amt inc-total">${fmt(tot)}</td>
                  <td class="text-right c-expense amt">${fmt(exp)}</td>
                  <td class="text-right ${sav >= 0 ? 'c-savings' : 'c-neg'} w-bold amt inc-sav">${fmt(sav)}</td>
                  <td class="text-right">
                    <div class="inc-rate-wrap">
                      <div class="inc-rate-bar" style="width:${mRate}px;max-width:60px;background:${rateColor}"></div>
                      <span class="inc-rate-txt">${mRate}%</span>
                    </div>
                  </td>
                  <td>
                    <button class="btn-del-income" onclick="App.deleteIncomeMonth('${esc(m)}')" title="Delete month">🗑</button>
                  </td>
                </tr>`;
            }).join('');
          })()}
        </tbody>
        <tfoot>
          ${(() => {
            const yrMonths = allMonths.filter(m => m.startsWith(String(this._incTableYear)));
            let yrSal = 0, yrBon = 0, yrExp = 0;
            yrMonths.forEach(m => {
              const inc = Storage.getIncome(m);
              yrSal += Number(inc.salary || 0);
              yrBon += Number(inc.bonus  || 0);
              yrExp += Storage.getTotalExpenses(m);
            });
            const yrInc = yrSal + yrBon;
            const yrSav = yrInc - yrExp;
            return `
              <tr class="income-total-row">
                <td><strong>${this._incTableYear} Total</strong></td>
                <td class="text-right c-income w-bold amt"><strong>${fmt(yrSal)}</strong></td>
                <td class="text-right c-income w-bold amt"><strong>${fmt(yrBon)}</strong></td>
                <td class="text-right c-income w-bold amt"><strong>${fmt(yrInc)}</strong></td>
                <td class="text-right c-expense w-bold amt"><strong>${fmt(yrExp)}</strong></td>
                <td class="text-right ${yrSav >= 0 ? 'c-savings' : 'c-neg'} w-bold amt"><strong>${fmt(yrSav)}</strong></td>
                <td></td><td></td>
              </tr>`;
          })()}
        </tfoot>
      </table>
    </div>
  </div>

</div>`;
  },

  saveIncomeRow(month, field, value) {
    History.push();
    const inc = Storage.getIncome(month);
    inc[field] = Number(value) || 0;
    Storage.saveIncome(month, inc);

    // Update just the row's calculated cells without re-rendering the whole table
    const sal = Number(inc.salary || 0);
    const bon = Number(inc.bonus  || 0);
    const tot = sal + bon;
    const exp = Storage.getTotalExpenses(month);
    const sav = tot - exp;
    const mRate = tot ? Math.round((Math.max(sav, 0) / tot) * 100) : 0;
    const rateColor = mRate >= 30 ? '#22c55e' : mRate >= 15 ? '#f59e0b' : '#ef4444';
    const row = document.querySelector(`tr[data-income-month="${month}"]`);
    if (row) {
      row.querySelector('.inc-total').textContent = fmt(tot);
      const savCell = row.querySelector('.inc-sav');
      if (savCell) {
        savCell.textContent = fmt(sav);
        savCell.className = 'text-right ' + (sav >= 0 ? 'c-savings' : 'c-neg') + ' w-bold amt inc-sav';
      }
      const rateBar = row.querySelector('.inc-rate-bar');
      if (rateBar) { rateBar.style.width = mRate + 'px'; rateBar.style.background = rateColor; }
      const rateTxt = row.querySelector('.inc-rate-txt');
      if (rateTxt) rateTxt.textContent = mRate + '%';
    }

    // Refresh the KPI summary cards
    const allMonths = Storage.getAllMonths();
    const incomeOnly = Object.keys(Storage.getAllIncome());
    incomeOnly.forEach(m => { if (!allMonths.includes(m)) allMonths.push(m); });
    let totSalary = 0, totBonus = 0, totExpenses = 0;
    allMonths.forEach(m => {
      const i = Storage.getIncome(m);
      totSalary   += Number(i.salary || 0);
      totBonus    += Number(i.bonus  || 0);
      totExpenses += Storage.getTotalExpenses(m);
    });
    const totIncome  = totSalary + totBonus;
    const netSavings = totIncome - totExpenses;
    const savRate    = totIncome ? Math.round((Math.max(netSavings, 0) / totIncome) * 100) : 0;

    const incEl = document.getElementById('kpi-val-income');
    if (incEl) incEl.textContent = fmtCr(totIncome);
    const expEl = document.getElementById('kpi-val-expense');
    if (expEl) expEl.textContent = fmtCr(totExpenses);
    const savEl = document.getElementById('kpi-val-savings');
    if (savEl) savEl.textContent = fmtCr(netSavings);
    const savPctEl = document.getElementById('kpi-pct-savings');
    if (savPctEl) savPctEl.textContent = totIncome ? savRate + '% saved' : '—';
  },

  setIncTableYear(yr) {
    this._incTableYear = yr;
    this.renderIncome();
  },

  addIncomeRow() {
    this.showAddMonthModal();
  },

  _incPickerYear: new Date().getFullYear(),
  _incPickerSelected: null,
  _incTableYear: new Date().getFullYear(),

  showAddMonthModal() {
    document.getElementById('_incAddModal')?.remove();

    const allMonths  = Storage.getAllMonths();
    const incomeOnly = Object.keys(Storage.getAllIncome());
    incomeOnly.forEach(m => { if (!allMonths.includes(m)) allMonths.push(m); });
    const tracked    = new Set(allMonths);
    const curYM      = currentYM();
    const sortedT    = [...tracked].sort();
    const suggested  = sortedT.length ? nextMonth(sortedT[sortedT.length - 1]) : curYM;

    this._incPickerYear     = parseInt(suggested.split('-')[0]);
    this._incPickerSelected = tracked.has(suggested) ? null : suggested;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = '_incAddModal';
    overlay.style.display = 'flex';
    overlay.innerHTML = `<div class="month-picker-modal" id="_incPickerBox">${this._renderMonthPicker(tracked, curYM)}</div>`;
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  },

  _renderMonthPicker(tracked, curYM) {
    const SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const yr    = this._incPickerYear;
    const sel   = this._incPickerSelected;
    const tiles = SHORT.map((name, i) => {
      const ym       = yr + '-' + String(i + 1).padStart(2, '0');
      const isTracked= tracked ? tracked.has(ym) : false;
      const isSel    = ym === sel;
      const isCur    = ym === curYM;
      let cls = 'mp-tile';
      if (isTracked) cls += ' mp-tracked';
      else if (isSel) cls += ' mp-selected';
      else if (isCur) cls += ' mp-current';
      return `<button class="${cls}" ${isTracked ? 'disabled title="Already tracked"' : `onclick="App._mpSelect('${ym}')"`}>${name}</button>`;
    }).join('');

    const selLabel = sel ? `<span class="mp-chosen">${monthLabel(sel)}</span>` : `<span class="mp-chosen mp-none">No month selected</span>`;

    return `
      <div class="mp-header">
        <div class="mp-title">📅 Pick a Month</div>
        <button class="mp-close" onclick="document.getElementById('_incAddModal').remove()">✕</button>
      </div>
      <div class="mp-year-nav">
        <button class="mp-year-btn" onclick="App._mpChangeYear(-1)">◀</button>
        <span class="mp-year-label">${yr}</span>
        <button class="mp-year-btn" onclick="App._mpChangeYear(1)">▶</button>
      </div>
      <div class="mp-grid">${tiles}</div>
      <div class="mp-footer">
        <div class="mp-sel-wrap">${selLabel}</div>
        <div class="mp-actions">
          <button class="btn-secondary" onclick="document.getElementById('_incAddModal').remove()">Cancel</button>
          <button class="btn-primary" ${sel ? '' : 'disabled'} onclick="App.confirmAddMonth()">Add Month</button>
        </div>
      </div>`;
  },

  _mpChangeYear(delta) {
    this._incPickerYear += delta;
    const allMonths  = Storage.getAllMonths();
    const incomeOnly = Object.keys(Storage.getAllIncome());
    incomeOnly.forEach(m => { if (!allMonths.includes(m)) allMonths.push(m); });
    const tracked = new Set(allMonths);
    const box = document.getElementById('_incPickerBox');
    if (box) box.innerHTML = this._renderMonthPicker(tracked, currentYM());
  },

  _mpSelect(ym) {
    this._incPickerSelected = ym;
    const allMonths  = Storage.getAllMonths();
    const incomeOnly = Object.keys(Storage.getAllIncome());
    incomeOnly.forEach(m => { if (!allMonths.includes(m)) allMonths.push(m); });
    const tracked = new Set(allMonths);
    const box = document.getElementById('_incPickerBox');
    if (box) box.innerHTML = this._renderMonthPicker(tracked, currentYM());
  },

  confirmAddMonth() {
    const month = this._incPickerSelected;
    if (!month) return toast('Select a month first', 'error');
    if (!/^\d{4}-\d{2}$/.test(month)) return toast('Invalid month format', 'error');
    const mo = parseInt(month.split('-')[1]);
    if (mo < 1 || mo > 12) return toast('Invalid month', 'error');
    History.push();
    Storage.saveIncome(month, { salary: 0, bonus: 0 });
    document.getElementById('_incAddModal')?.remove();
    this.renderIncome();
    toast('✅ ' + monthLabel(month) + ' added');
  },

  _confirmAddMonthLegacy() {
    const sel = document.getElementById('_incMonthSel');
    if (!sel) return;
    let month = sel.value;
    if (month === '__custom__') {
      const custom = document.getElementById('_incMonthCustom');
      month = (custom ? custom.value : '').trim();
    }
    if (!/^\d{4}-\d{2}$/.test(month)) return toast('Invalid format. Use YYYY-MM (e.g. 2025-06)', 'error');
    const [y, mo] = month.split('-').map(Number);
    if (mo < 1 || mo > 12) return toast('Invalid month. Month must be 01–12', 'error');
    History.push();
    Storage.saveIncome(month, { salary: 0, bonus: 0 });
    const modal = document.getElementById('_incAddModal');
    if (modal) modal.remove();
    this.renderIncome();
    toast('Month ' + monthLabel(month) + ' added', 'success');
  },

  deleteIncomeMonth(month) {
    const inc = Storage.getIncome(month);
    const total = Number(inc.salary || 0) + Number(inc.bonus || 0);
    if (total > 0) {
      if (!confirm('Delete ' + monthLabel(month) + '? Income data (' + fmt(total) + ') will be lost.')) return;
    }
    History.push();
    const allInc = Storage._get(Storage.KEYS.income);
    delete allInc[month];
    Storage._set(Storage.KEYS.income, allInc);
    this.renderIncome();
    toast(monthLabel(month) + ' removed', 'success');
  },

  // ─── INVESTMENTS ──────────────────────────────────────────────────────────

  _bankLogo(b) {
    const e = b.emoji || (b.label && b.label.toLowerCase().includes('cash') ? '💵' : b.label && b.label.toLowerCase().includes('trad') ? '📊' : '🏦');
    // Always prefer config (authoritative) over stale stored logoUrl
    const configEntry = b.domain ? WORLDWIDE_BANKS.find(w => w.domain === b.domain) : null;
    const logoUrl = (configEntry && configEntry.logoUrl) || b.logoUrl || '';
    const domain  = b.domain;
    if (logoUrl) {
      // Official bank website logo → Clearbit fallback → emoji
      return `<img class="inv-bank-logo-img" src="${logoUrl}" alt="" loading="lazy" onerror="this.onerror=null;this.src='https://logo.clearbit.com/${domain}';this.onerror=function(){this.style.display='none';this.nextElementSibling.style.display='flex'}"><span class="inv-bank-logo-emoji" style="display:none">${e}</span>`;
    }
    if (domain) {
      // Clearbit HD logo → Google favicon → emoji
      return `<img class="inv-bank-logo-img" src="https://logo.clearbit.com/${domain}" alt="" loading="lazy" onerror="this.onerror=null;this.src='https://www.google.com/s2/favicons?domain=${domain}&sz=256';this.onerror=function(){this.style.display='none';this.nextElementSibling.style.display='flex'}"><span class="inv-bank-logo-emoji" style="display:none">${e}</span>`;
    }
    return `<span class="inv-bank-logo-emoji">${e}</span>`;
  },

  renderInvestments() {
    const ym        = this.month;
    const inv       = Storage.getInvestment(ym);
    const banks     = Storage.getBanks(ym);
    const bankNames = Storage.getBankNames();
    const funds     = Storage.getFunds();
    const allInv    = Storage.getAllInvestments();

    this._bankBuf = {};
    bankNames.forEach(b => { this._bankBuf[b.id] = Number(banks[b.id] || 0); });
    this._invBuf = { sips: {} };
    funds.forEach(f => { this._invBuf.sips[f.id] = Number(inv.sips?.[f.id] || 0); });

    const bankTotal = bankNames.reduce((s, b) => s + (this._bankBuf[b.id] || 0), 0);

    const prevYM = prevMonth(ym);
    const prevInv = Storage.getInvestment(prevYM);

    const fundTotals = {};
    funds.forEach(f => {
      fundTotals[f.id] = Object.values(allInv).reduce((s, m) => s + Number(m.sips?.[f.id] || 0), 0);
    });
    const totalFundInvested = Object.values(fundTotals).reduce((s, v) => s + v, 0);

    const catTotals = { stock: 0, mutual_fund: 0, crypto: 0, us: 0 };
    funds.forEach(f => {
      const t = (f.type === 'indian') ? 'mutual_fund' : (catTotals.hasOwnProperty(f.type) ? f.type : 'mutual_fund');
      catTotals[t] += fundTotals[f.id] || 0;
    });

    const totalPortfolio = bankTotal + totalFundInvested;
    const tab = this._invTab || 'mutual_fund';
    const BANK_TYPES = { primary: '🟢 Primary', savings: '🔵 Savings', investment: '💹 Investment', trading: '📊 Trading', cash: '💵 Cash', other: '⚙️ Other' };

    const el = document.getElementById('view-investments');
    el.innerHTML = `
      <div class="inv-page">

        <!-- Hero -->
        <div class="inv-hero">
          <div class="inv-hero-left">
            <div class="inv-hero-eyebrow">📊 Portfolio Overview</div>
            <div class="inv-hero-total amt">${fmtCr(totalPortfolio)}</div>
            <div class="inv-hero-sub">Total Portfolio · ${monthLabel(ym)}</div>
            <div class="inv-hero-stats">
              <span>🏦 Banks <strong class="amt">${fmtCr(bankTotal)}</strong></span>
              <span>📈 Invested <strong class="amt">${fmtCr(totalFundInvested)}</strong></span>
            </div>
          </div>
          <div class="inv-hero-right">
            ${this._renderAllocationRing(bankTotal, catTotals, totalPortfolio)}
          </div>
        </div>

        <!-- KPI Cards -->
        <div class="inv-kpi-grid">
          ${[
            { key: 'bank',        label: 'Banks',        emoji: '🏦', val: bankTotal,             color: '#60a5fa' },
            { key: 'stock',       label: 'Stocks',       emoji: '📈', val: catTotals.stock,        color: '#4ade80' },
            { key: 'mutual_fund', label: 'Mutual Funds', emoji: '💹', val: catTotals.mutual_fund,  color: '#a78bfa' },
            { key: 'crypto',      label: 'Crypto',       emoji: '🪙', val: catTotals.crypto,       color: '#fbbf24' },
            { key: 'us',          label: 'US Stocks',    emoji: '🌐', val: catTotals.us,           color: '#38bdf8' },
          ].map(k => `
            <div class="inv-kpi" style="--kpi-color:${k.color}">
              <div class="inv-kpi-icon">${k.emoji}</div>
              <div class="inv-kpi-val amt">${fmtCr(k.val || 0)}</div>
              <div class="inv-kpi-label">${k.label}</div>
            </div>`).join('')}
        </div>

        <!-- Banks Section -->
        <div class="inv-section-card">
          <div class="inv-section-header">
            <div class="inv-section-title-wrap">
              <span class="inv-section-icon">🏦</span>
              <div>
                <div class="inv-section-title">Bank & Cash Balances</div>
                <div class="inv-section-sub">Balances for ${monthLabel(ym)} · Bank cards shared across all months · drag to reorder</div>
              </div>
            </div>
            <div class="inv-autosave-badge" id="bankAutoSaveBadge" style="display:none">✓ Saved</div>
          </div>

          <!-- Bank Search / Add -->
          <div class="inv-bank-search-wrap">
            <div class="inv-bank-search-inner" style="position:relative">
              <span class="inv-bank-search-icon">🔍</span>
              <input type="text" class="inv-bank-search" id="invBankSearchInput"
                placeholder="Search worldwide banks to add (e.g. SBI, HDFC, Chase)…"
                oninput="App.invBankSearch(this.value)"
                onblur="setTimeout(()=>App._hideBankDropdown(),200)" />
              <div class="inv-bank-dropdown" id="invBankDropdown" style="display:none"></div>
            </div>
          </div>

          ${bankNames.length === 0
            ? `<div style="padding:4px 22px 18px"><div class="empty-state-inline">Search above to add your first bank account.</div></div>`
            : `
            <div class="inv-banks-grid" id="invBanksGrid">
              ${bankNames.map((b, i) => `
                <div class="inv-bank-card" draggable="true" data-bank-id="${b.id}"
                  ondragstart="App.bankDragStart('${b.id}')"
                  ondragover="App.bankDragOver('${b.id}',event)"
                  ondrop="App.bankDrop('${b.id}')">
                  <div class="inv-bank-card-top">
                    <div class="inv-bank-drag-handle">⠿</div>
                    <button class="inv-bank-del-btn" onclick="App.deleteBankFromInv('${b.id}')" title="Remove">×</button>
                  </div>
                  <div class="inv-bank-logo-wrap">${this._bankLogo(b)}</div>
                  <input type="text" class="inv-bank-name-inp" value="${esc(b.label)}"
                    onblur="App.renameBankEntry('${b.id}',this.value)"
                    onkeydown="if(event.key==='Enter')this.blur()" />
                  <select class="inv-bank-type-sel" onchange="App.setBankType('${b.id}',this.value)">
                    ${Object.entries(BANK_TYPES).map(([v,l]) => `<option value="${v}"${(b.bankType||'other')===v?' selected':''}>${l}</option>`).join('')}
                  </select>
                  <input type="number" class="inv-bank-input" value="${this._bankBuf[b.id] || ''}" placeholder="0"
                    oninput="App.saveBankField('${b.id}',this.value)" />
                </div>`).join('')}
              <div class="inv-bank-card inv-bank-total-card">
                <div class="inv-bank-logo-wrap"><span style="font-size:28px">💰</span></div>
                <div class="inv-bank-total-label">Total</div>
                <div class="inv-bank-total amt" id="bankTotal">${fmt(bankTotal)}</div>
              </div>
            </div>`}
        </div>

        <!-- SIP Calculator (between banks and investments) -->
        ${this._renderSIPCalc()}

        <!-- Investments Section -->
        <div class="inv-section-card">
          <div class="inv-section-header">
            <div class="inv-section-title-wrap">
              <span class="inv-section-icon">📊</span>
              <div>
                <div class="inv-section-title">Monthly Investments</div>
                <div class="inv-section-sub">${monthLabel(ym)}</div>
              </div>
            </div>
            <div class="inv-autosave-badge" id="invAutoSaveBadge" style="display:none">✓ Saved</div>
          </div>

          <div class="inv-tabs">
            ${[
              { type: 'stock',       label: 'Stocks',       emoji: '📈' },
              { type: 'mutual_fund', label: 'Mutual Funds', emoji: '💹' },
              { type: 'crypto',      label: 'Crypto',       emoji: '🪙' },
              { type: 'us',          label: 'US Stocks',    emoji: '🌐' },
            ].map(t => {
              const cnt = funds.filter(f => f.type === t.type || (t.type === 'mutual_fund' && f.type === 'indian')).length;
              return `<button class="inv-tab${tab === t.type ? ' active' : ''}" data-tab="${t.type}" onclick="App.setInvTab('${t.type}')">
                ${t.emoji} ${t.label}${cnt > 0 ? ` <span class="inv-tab-badge">${cnt}</span>` : ''}
              </button>`;
            }).join('')}
          </div>

          ${[
            { type: 'stock',       label: 'Stocks',       emoji: '📈', color: '#4ade80' },
            { type: 'mutual_fund', label: 'Mutual Funds', emoji: '💹', color: '#a78bfa' },
            { type: 'crypto',      label: 'Crypto',       emoji: '🪙', color: '#fbbf24' },
            { type: 'us',          label: 'US Stocks',    emoji: '🌐', color: '#38bdf8' },
          ].map(t => {
            const tf = funds.filter(f => f.type === t.type || (t.type === 'mutual_fund' && f.type === 'indian'));
            const searchList = INV_SEARCH[t.type] || [];
            return `
              <div class="inv-tab-panel${tab === t.type ? ' active' : ''}" id="inv-panel-${t.type}">

                <!-- Inline Fund Search / Add -->
                <div class="inv-fund-search-wrap">
                  <div class="inv-fund-search-inner" style="position:relative">
                    <span class="inv-fund-search-icon">${t.emoji}</span>
                    <input type="text" class="inv-fund-search-inp" id="inv-fund-inp-${t.type}"
                      placeholder="Search & add ${t.label} (e.g. ${searchList[0] || ''})"
                      oninput="App.invFundSearch('${t.type}',this.value)"
                      onblur="setTimeout(()=>App._hideFundDropdown('${t.type}'),200)" />
                    <div class="inv-fund-dropdown" id="inv-fund-dd-${t.type}" style="display:none"></div>
                  </div>
                </div>

                ${tf.length === 0
                  ? `<div class="inv-empty-funds">No ${t.label} added yet. Use the search above ↑</div>`
                  : `<div class="inv-funds-list">
                    ${tf.map(f => {
                      const prevAmt = Number(prevInv.sips?.[f.id] || 0);
                      return `
                        <div class="inv-fund-row">
                          <span class="inv-fund-icon" style="color:${t.color}">${t.emoji}</span>
                          <div class="inv-fund-info">
                            <div class="inv-fund-name">${esc(f.label)}</div>
                            <div class="inv-fund-meta">
                              All-time <span class="amt">${fmtCr(fundTotals[f.id] || 0)}</span>
                              ${prevAmt > 0 ? `<span class="inv-fund-prev-sep">·</span> Prev <span class="inv-fund-prev amt" title="Fill from previous month" onclick="App._fillPrev('${f.id}',${prevAmt})">${fmt(prevAmt)}</span>` : ''}
                            </div>
                          </div>
                          <div class="inv-fund-actions">
                            <input type="number" class="inv-fund-input" id="fund-inp-${f.id}" value="${this._invBuf.sips[f.id] || ''}" placeholder="₹0"
                              oninput="App.saveInvField('${f.id}',this.value)" />
                            <button class="inv-fund-del" onclick="App.deleteFundEntry('${f.id}')" title="Remove fund">🗑</button>
                          </div>
                        </div>`;
                    }).join('')}
                  </div>`}
              </div>`;
          }).join('')}
        </div>

        <!-- All-Time Fund Totals -->
        ${funds.length > 0 ? this._renderInvFundTotals(funds, fundTotals, totalFundInvested) : ''}

      </div>`;

    this.calcSIP();
  },

  setInvTab(type) {
    this._invTab = type;
    document.querySelectorAll('.inv-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === type));
    document.querySelectorAll('.inv-tab-panel').forEach(p => p.classList.toggle('active', p.id === 'inv-panel-' + type));
  },

  // Bank drag & drop
  bankDragStart(bankId) { this._dragBankId = bankId; },
  bankDragOver(bankId, ev) { ev.preventDefault(); document.querySelectorAll('.inv-bank-card').forEach(c => c.classList.remove('drag-over')); const el = document.querySelector(`[data-bank-id="${bankId}"]`); if (el) el.classList.add('drag-over'); },
  bankDrop(targetId) {
    document.querySelectorAll('.inv-bank-card').forEach(c => c.classList.remove('drag-over'));
    if (!this._dragBankId || this._dragBankId === targetId) return;
    const banks = Storage.getBankNames();
    const fromIdx = banks.findIndex(b => b.id === this._dragBankId);
    const toIdx   = banks.findIndex(b => b.id === targetId);
    if (fromIdx < 0 || toIdx < 0) return;
    const [moved] = banks.splice(fromIdx, 1);
    banks.splice(toIdx, 0, moved);
    History.push();
    Storage.saveBankNames(banks);
    this._dragBankId = null;
    this.renderInvestments();
  },

  setBankType(bankId, type) {
    const banks = Storage.getBankNames();
    const b = banks.find(x => x.id === bankId);
    if (b) { b.bankType = type; Storage.saveBankNames(banks); }
  },

  _showDeleteModal(itemName, onConfirm) {
    const old = document.getElementById('_deleteModal');
    if (old) old.remove();
    const div = document.createElement('div');
    div.id = '_deleteModal';
    div.className = 'modal-overlay';
    div.innerHTML = `
      <div class="modal" style="max-width:420px;text-align:center">
        <div style="font-size:40px;margin-bottom:12px">🗑️</div>
        <h3 style="margin-bottom:8px">Confirm Delete</h3>
        <p style="margin-bottom:4px">Want to delete</p>
        <p style="font-weight:700;color:var(--text);font-size:15px;margin-bottom:4px">"${esc(itemName)}"?</p>
        <p style="margin-top:0;color:var(--text-muted);font-size:12px">This action cannot be undone.</p>
        <div class="modal-actions" style="justify-content:center;gap:12px;margin-top:20px">
          <button id="_delNoBtn">No, Cancel</button>
          <button id="_delYesBtn" class="btn-danger-confirm">Yes, Delete</button>
        </div>
      </div>`;
    document.body.appendChild(div);
    document.getElementById('_delNoBtn').onclick = () => div.remove();
    div.addEventListener('click', e => { if (e.target === div) div.remove(); });
    document.getElementById('_delYesBtn').onclick = () => { div.remove(); onConfirm(); };
  },

  deleteBankFromInv(bankId) {
    const banks = Storage.getBankNames();
    const b = banks.find(x => x.id === bankId);
    if (!b) return;
    this._showDeleteModal(b.label, () => {
      History.push();
      Storage.saveBankNames(banks.filter(x => x.id !== bankId));
      toast('Account removed');
      this.renderInvestments();
    });
  },

  // Fund inline search
  invFundSearch(type, query) {
    const dd = document.getElementById('inv-fund-dd-' + type);
    if (!dd) return;
    const q = (query || '').trim().toLowerCase();
    if (!q) { dd.style.display = 'none'; return; }
    const list = INV_SEARCH[type] || [];
    const existing = Storage.getFunds().map(f => f.label.toLowerCase());
    const results = list.filter(n => n.toLowerCase().includes(q) && !existing.includes(n.toLowerCase())).slice(0, 8);
    // Also allow custom entry
    const customEntry = query.trim();
    if (customEntry && !results.find(r => r.toLowerCase() === customEntry.toLowerCase())) {
      results.push('✏️ Add "' + customEntry + '"');
    }
    if (!results.length) { dd.style.display = 'none'; return; }
    this._fundSearchResults[type] = results;
    dd.style.display = 'block';
    dd.innerHTML = results.map((name, i) => `
      <div class="inv-bank-opt" onmousedown="App.addFundFromSearch('${type}',${i})">
        <span class="inv-bank-opt-emoji">${type === 'stock' ? '📈' : type === 'mutual_fund' ? '💹' : type === 'crypto' ? '🪙' : '🌐'}</span>
        <span class="inv-bank-opt-name">${esc(name)}</span>
      </div>`).join('');
  },

  _hideFundDropdown(type) {
    const dd = document.getElementById('inv-fund-dd-' + type);
    if (dd) dd.style.display = 'none';
  },

  addFundFromSearch(type, idx) {
    const results = this._fundSearchResults[type] || [];
    let name = results[idx];
    if (!name) return;
    // Strip the "✏️ Add" prefix if it's a custom entry
    if (name.startsWith('✏️ Add "') && name.endsWith('"')) name = name.slice(9, -1);
    const funds = Storage.getFunds();
    if (funds.find(f => f.label.toLowerCase() === name.toLowerCase())) {
      toast(name + ' already exists', 'error'); return;
    }
    History.push();
    funds.push({ id: 'fund' + uid(), label: name, type });
    Storage.saveFunds(funds);
    const inp = document.getElementById('inv-fund-inp-' + type);
    if (inp) inp.value = '';
    toast('✅ ' + name + ' added!');
    this.renderInvestments();
  },

  deleteFundEntry(fundId) {
    const funds = Storage.getFunds();
    const f = funds.find(x => x.id === fundId);
    if (!f) return;
    this._showDeleteModal(f.label, () => {
      History.push();
      Storage.saveFunds(funds.filter(x => x.id !== fundId));
      this.renderInvestments();
      toast('Fund removed');
    });
  },

  _fillPrev(fundId, amount) {
    if (!this._invBuf.sips) this._invBuf.sips = {};
    this._invBuf.sips[fundId] = amount;
    const inp = document.getElementById('fund-inp-' + fundId);
    if (inp) { inp.value = amount; inp.focus(); }
    this._autoSaveInv();
  },

  _renderAllocationRing(bankTotal, catTotals, totalPortfolio) {
    if (totalPortfolio === 0) return `<div class="inv-alloc-empty">Add data to see<br>portfolio allocation</div>`;
    const pct = v => Math.max(0, Math.round((v || 0) / totalPortfolio * 100));
    const segs = [
      { p: pct(bankTotal),               c: '#60a5fa', l: 'Banks'  },
      { p: pct(catTotals.stock || 0),    c: '#4ade80', l: 'Stocks' },
      { p: pct(catTotals.mutual_fund||0),c: '#a78bfa', l: 'MF'     },
      { p: pct(catTotals.crypto || 0),   c: '#fbbf24', l: 'Crypto' },
      { p: pct(catTotals.us || 0),       c: '#38bdf8', l: 'US'     },
    ].filter(s => s.p > 0);
    let grad = '', cum = 0;
    segs.forEach(s => {
      const end = Math.min(100, cum + s.p);
      grad += `${s.c} ${cum}% ${end}%, `;
      cum = end;
    });
    grad = grad.replace(/, $/, '');
    const best = [...segs].sort((a, b) => b.p - a.p)[0];
    return `
      <div class="inv-alloc-wrap">
        <div class="inv-alloc-donut" style="background:conic-gradient(${grad || 'var(--border) 0% 100%'})">
          <div class="inv-alloc-inner">
            <div class="inv-alloc-pct">${best?.p || 0}%</div>
            <div class="inv-alloc-lbl">${best?.l || ''}</div>
          </div>
        </div>
        <div class="inv-alloc-legend">
          ${segs.map(s => `
            <div class="inv-alloc-leg-item">
              <span style="background:${s.c}"></span>${s.l} <strong>${s.p}%</strong>
            </div>`).join('')}
        </div>
      </div>`;
  },

  _renderSIPCalc() {
    return `
      <div class="inv-sip-calc">
        <div class="inv-sip-hero">
          <div class="inv-sip-hero-icon">📈</div>
          <div>
            <div class="inv-sip-title">Wealth Projector</div>
            <div class="inv-sip-sub">Step-Up SIP Calculator — see how your money grows</div>
          </div>
          <div class="inv-sip-result-highlight">
            <div class="inv-sip-result-lbl">Projected Value</div>
            <div class="inv-sip-result-big" id="sip-r-total">—</div>
          </div>
        </div>
        <div class="inv-sip-body">
          <div class="inv-sip-sliders">
            ${[
              { id: 'sip-monthly', name: 'Monthly SIP',        valId: 'sip-v-monthly', min: 500,  max: 100000, step: 500,  val: 5000, unit: '₹' },
              { id: 'sip-step',    name: 'Annual Step-Up',      valId: 'sip-v-step',    min: 0,    max: 50,     step: 1,    val: 10,   unit: '%' },
              { id: 'sip-return',  name: 'Expected Return p.a.',valId: 'sip-v-return',  min: 1,    max: 30,     step: 0.5,  val: 12,   unit: '%' },
              { id: 'sip-years',   name: 'Time Period',          valId: 'sip-v-years',   min: 1,    max: 40,     step: 1,    val: 10,   unit: 'yr' },
            ].map(s => `
              <div class="inv-sip-row">
                <div class="inv-sip-row-top">
                  <span class="inv-sip-row-name">${s.name}</span>
                  <div class="inv-sip-val-wrap">
                    <span class="inv-sip-val-prefix">${s.unit === '₹' ? '₹' : ''}</span>
                    <input type="number" class="inv-sip-val-inp" id="${s.valId}"
                      min="${s.min}" max="${s.max}" step="${s.step}" value="${s.val}"
                      oninput="App.syncSIPFromInput('${s.id}','${s.valId}','${s.unit}')" />
                    <span class="inv-sip-val-suffix">${s.unit !== '₹' ? s.unit : ''}</span>
                  </div>
                </div>
                <input type="range" class="inv-sip-slider" id="${s.id}"
                  min="${s.min}" max="${s.max}" step="${s.step}" value="${s.val}"
                  oninput="App.syncSIPFromSlider('${s.id}','${s.valId}')" />
              </div>`).join('')}
          </div>
          <div class="inv-sip-results-col">
            <div class="inv-sip-res-card inv-sip-invested">
              <div class="inv-sip-res-icon">💰</div>
              <div class="inv-sip-res-label">Invested</div>
              <div class="inv-sip-res-val" id="sip-r-invested">—</div>
            </div>
            <div class="inv-sip-res-card inv-sip-returns">
              <div class="inv-sip-res-icon">✨</div>
              <div class="inv-sip-res-label">Returns</div>
              <div class="inv-sip-res-val" id="sip-r-returns">—</div>
            </div>
            <div class="inv-sip-gain-bar" id="sip-gain-bar">
              <div class="inv-sip-gain-fill" id="sip-gain-fill" style="width:50%"></div>
              <div class="inv-sip-gain-label" id="sip-gain-label">50% gains</div>
            </div>
          </div>
        </div>
      </div>`;
  },

  _renderInvFundTotals(funds, fundTotals, totalFundInvested) {
    const typeLabel = t => {
      if (t === 'indian' || t === 'mutual_fund') return '💹 Mutual Fund';
      if (t === 'stock')  return '📈 Stock';
      if (t === 'crypto') return '🪙 Crypto';
      if (t === 'us')     return '🌐 US Stock';
      return t;
    };
    return `
      <div class="inv-section-card" style="overflow:hidden">
        <div class="inv-section-header">
          <div class="inv-section-title-wrap">
            <span class="inv-section-icon">📋</span>
            <div><div class="inv-section-title">All-Time Fund Totals</div></div>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Fund Name</th>
                <th>Category</th>
                <th class="text-right">Total Invested</th>
              </tr>
            </thead>
            <tbody>
              ${funds.map(f => `
                <tr>
                  <td>${esc(f.label)}</td>
                  <td style="color:var(--text-muted)">${typeLabel(f.type)}</td>
                  <td class="text-right c-inv w-bold amt">${fmt(fundTotals[f.id] || 0)}</td>
                </tr>`).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2"><strong>Grand Total Invested</strong></td>
                <td class="text-right c-inv w-bold amt"><strong>${fmt(totalFundInvested)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>`;
  },

  invBankSearch(query) {
    const dd = document.getElementById('invBankDropdown');
    if (!dd) return;
    const q = (query || '').trim().toLowerCase();
    if (!q) { dd.style.display = 'none'; return; }
    const results = WORLDWIDE_BANKS.filter(b => b.name.toLowerCase().includes(q)).slice(0, 8);
    if (!results.length) { dd.style.display = 'none'; return; }
    this._bankSearchResults = results;
    dd.style.display = 'block';
    dd.innerHTML = results.map((b, i) => {
      const ddSrc = b.logoUrl || (b.domain ? `https://logo.clearbit.com/${b.domain}` : '');
      const ddFallback = b.domain ? `https://www.google.com/s2/favicons?domain=${b.domain}&sz=128` : '';
      const logoImg = ddSrc
        ? `<img class="inv-bank-opt-logo" src="${ddSrc}" alt="" onerror="this.onerror=null;this.src='${ddFallback}';this.onerror=function(){this.style.display='none';this.nextElementSibling.style.display='inline'}"><span class="inv-bank-opt-emoji" style="display:none">${b.emoji || '🏦'}</span>`
        : `<span class="inv-bank-opt-emoji">${b.emoji || '🏦'}</span>`;
      return `
        <div class="inv-bank-opt" onmousedown="App.addBankFromInvIdx(${i})">
          ${logoImg}
          <span class="inv-bank-opt-name">${esc(b.name)}</span>
          ${b.country ? `<span class="inv-bank-opt-country">${b.country}</span>` : ''}
        </div>`;
    }).join('');
  },

  _hideBankDropdown() {
    const dd = document.getElementById('invBankDropdown');
    if (dd) dd.style.display = 'none';
  },

  addBankFromInvIdx(idx) {
    const b = this._bankSearchResults?.[idx];
    if (!b) return;
    const banks = Storage.getBankNames();
    if (banks.find(x => x.label.toLowerCase() === b.name.toLowerCase())) {
      toast(b.name + ' already exists', 'error'); return;
    }
    History.push();
    banks.push({ id: 'bank' + uid(), label: b.name, emoji: b.emoji, domain: b.domain || '', logoUrl: b.logoUrl || '', bankType: 'other' });
    Storage.saveBankNames(banks);
    const inp = document.getElementById('invBankSearchInput');
    if (inp) inp.value = '';
    this._hideBankDropdown();
    toast(b.emoji + ' ' + b.name + ' added!');
    this.renderInvestments();
  },

  saveBankField(bankId, value) {
    this._bankBuf[bankId] = Number(value) || 0;
    const bankNames = Storage.getBankNames();
    const total = bankNames.reduce((s, b) => s + (this._bankBuf[b.id] || 0), 0);
    const el = document.getElementById('bankTotal');
    if (el) el.textContent = fmt(total);
    // Auto-save debounced
    clearTimeout(this._bankSaveTimer);
    this._bankSaveTimer = setTimeout(() => this._autoSaveBanks(), 600);
  },

  _autoSaveBanks() {
    Storage.saveBanks(this.month, Object.assign({}, this._bankBuf));
    const badge = document.getElementById('bankAutoSaveBadge');
    if (badge) { badge.style.display = ''; setTimeout(() => { badge.style.display = 'none'; }, 2000); }
  },

  saveBanks() {
    History.push();
    Storage.saveBanks(this.month, Object.assign({}, this._bankBuf));
    toast('Bank balances saved for ' + monthLabel(this.month));
  },

  saveInvField(fundId, value) {
    if (!this._invBuf.sips) this._invBuf.sips = {};
    this._invBuf.sips[fundId] = Number(value) || 0;
    clearTimeout(this._invSaveTimer);
    this._invSaveTimer = setTimeout(() => this._autoSaveInv(), 600);
  },

  _autoSaveInv() {
    const existing = Storage.getInvestment(this.month);
    Storage.saveInvestment(this.month, Object.assign({}, existing, { sips: this._invBuf.sips || {} }));
    const badge = document.getElementById('invAutoSaveBadge');
    if (badge) { badge.style.display = ''; setTimeout(() => { badge.style.display = 'none'; }, 2000); }
  },

  saveInvestments() {
    History.push();
    const existing = Storage.getInvestment(this.month);
    Storage.saveInvestment(this.month, Object.assign({}, existing, { sips: this._invBuf.sips || {} }));
    toast('Investments saved for ' + monthLabel(this.month));
    this.renderInvestments();
  },

  changeInvMonth(dir) {
    this.month = dir === -1 ? prevMonth(this.month) : nextMonth(this.month);
    const [y] = this.month.split('-').map(Number);
    this.pickerYear = y;
    this._bankBuf = {};
    this._invBuf  = { sips: {} };
    this.renderMonthPicker();
    this.renderInvestments();
  },

  syncSIPFromSlider(sliderId, valId) {
    const slider = document.getElementById(sliderId);
    const inp = document.getElementById(valId);
    if (slider && inp) inp.value = slider.value;
    this.calcSIP();
  },

  syncSIPFromInput(sliderId, valId, unit) {
    const slider = document.getElementById(sliderId);
    const inp = document.getElementById(valId);
    if (slider && inp) {
      let v = Number(inp.value);
      v = Math.max(Number(slider.min), Math.min(Number(slider.max), v));
      slider.value = v;
      inp.value = v;
    }
    this.calcSIP();
  },

  calcSIP() {
    const monthly = Number(document.getElementById('sip-monthly')?.value || 5000);
    const stepPct = Number(document.getElementById('sip-step')?.value   || 10);
    const retPct  = Number(document.getElementById('sip-return')?.value || 12);
    const years   = Number(document.getElementById('sip-years')?.value  || 10);

    const setInp = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
    setInp('sip-v-monthly', monthly);
    setInp('sip-v-step',    stepPct);
    setInp('sip-v-return',  retPct);
    setInp('sip-v-years',   years);

    const lbl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    const monthlyRate = retPct / 12 / 100;
    let totalValue = 0, totalInvested = 0, monthlyAmt = monthly;
    for (let y = 0; y < years; y++) {
      for (let m = 0; m < 12; m++) {
        totalValue = (totalValue + monthlyAmt) * (1 + monthlyRate);
        totalInvested += monthlyAmt;
      }
      monthlyAmt *= (1 + stepPct / 100);
    }

    const returns = totalValue - totalInvested;
    const gainPct = totalValue > 0 ? Math.round(returns / totalValue * 100) : 0;
    lbl('sip-r-invested', fmtCr(totalInvested));
    lbl('sip-r-returns',  fmtCr(returns));
    lbl('sip-r-total',    fmtCr(totalValue));

    const fill = document.getElementById('sip-gain-fill');
    const gainLbl = document.getElementById('sip-gain-label');
    if (fill) fill.style.width = gainPct + '%';
    if (gainLbl) gainLbl.textContent = gainPct + '% gains on total';
  },

  // ─── HISTORY ──────────────────────────────────────────────────────────────

  renderHistory() {
    const cats      = Storage.getCategories();
    const allMonths = Storage.getAllMonths();
    const years     = [...new Set(allMonths.map(m => m.split('-')[0]))].sort().reverse();

    if (!years.includes(String(this.historyYear))) {
      this.historyYear = years[0] ? parseInt(years[0]) : new Date().getFullYear();
    }
    const filtered = allMonths.filter(m => m.startsWith(String(this.historyYear)));

    const rows = filtered.map(m => {
      const catTotals = cats.map(cat => Storage.getCategoryTotal(m, cat.id));
      const income    = Storage.getTotalIncome(m);
      const expenses  = Storage.getTotalExpenses(m);
      const funds     = Storage.getFunds();
      const invData   = Storage.getInvestment(m);
      const sipTotal  = funds.reduce((s, f) => s + Number(invData.sips?.[f.id] || 0), 0);
      return { m, catTotals, income, expenses, savings: income - expenses, sipTotal };
    });

    const colTotals   = cats.map((_, ci) => rows.reduce((s, r) => s + r.catTotals[ci], 0));
    const totalIncome = rows.reduce((s, r) => s + r.income, 0);
    const totalExp    = rows.reduce((s, r) => s + r.expenses, 0);
    const totalSav    = rows.reduce((s, r) => s + r.savings, 0);
    const totalSips   = rows.reduce((s, r) => s + r.sipTotal, 0);

    const el = document.getElementById('view-history');
    el.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">History</div>
          <div class="page-sub">Click any row to view & edit that month</div>
        </div>
        <div class="year-tabs">
          ${years.map(y => `
            <button class="year-tab ${parseInt(y) === this.historyYear ? 'active' : ''}"
              onclick="App.historyYear=${y};App.renderHistory()">${y}</button>`).join('')}
          ${years.length === 0 ? '<span style="color:var(--text-muted);font-size:13px">No data yet</span>' : ''}
        </div>
      </div>
      <div class="content-wrap" style="padding-top:0">
        ${rows.length === 0
          ? `<div class="section-card"><div class="empty-state">No data for ${this.historyYear}.<br>Start adding income and expenses!</div></div>`
          : `
        <div class="section-card" style="padding:0;overflow:hidden">
          <div class="table-wrap table-wrap-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="sticky-col">Month</th>
                  ${cats.map(c => `<th class="text-right" style="color:${esc(c.color)}">${esc(c.label)}</th>`).join('')}
                  <th class="text-right expense-header">Total Exp.</th>
                  <th class="text-right income-header">Income</th>
                  <th class="text-right savings-header">Savings</th>
                  <th class="text-right" style="color:var(--purple)">Investments</th>
                </tr>
              </thead>
              <tbody>
                ${rows.map(r => `
                  <tr class="history-row" onclick="App.goToMonth('${r.m}')">
                    <td class="sticky-col month-cell">${monthLabel(r.m)}</td>
                    ${r.catTotals.map((t, ci) =>
                      `<td class="text-right amt" style="color:${t>0?cats[ci].color:'var(--text-dim)'}">${t>0?fmt(t):'—'}</td>`
                    ).join('')}
                    <td class="text-right c-expense w-bold amt">${fmt(r.expenses)}</td>
                    <td class="text-right c-income w-bold amt">${fmt(r.income)}</td>
                    <td class="text-right ${r.savings>=0?'c-savings':'c-neg'} w-bold amt">${fmt(r.savings)}</td>
                    <td class="text-right amt" style="color:var(--purple)">${r.sipTotal>0?fmt(r.sipTotal):'—'}</td>
                  </tr>`).join('')}
              </tbody>
              <tfoot>
                <tr>
                  <td class="sticky-col"><strong>${this.historyYear} Total</strong></td>
                  ${colTotals.map(t => `<td class="text-right w-bold amt">${fmt(t)}</td>`).join('')}
                  <td class="text-right c-expense w-bold amt">${fmt(totalExp)}</td>
                  <td class="text-right c-income w-bold amt">${fmt(totalIncome)}</td>
                  <td class="text-right ${totalSav>=0?'c-savings':'c-neg'} w-bold amt">${fmt(totalSav)}</td>
                  <td class="text-right w-bold amt" style="color:var(--purple)">${fmt(totalSips)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>`}
      </div>`;
  },

  goToMonth(ym) {
    this.month = ym;
    const [y] = ym.split('-').map(Number);
    this.pickerYear = y;
    this._monthlyData = {};
    this.renderMonthPicker();
    this.navigate('monthly');
  },

  // ─── SETTINGS ─────────────────────────────────────────────────────────────

  renderSettings() {
    const cats      = Storage.getCategories();
    const funds     = Storage.getFunds();
    const bankNames = Storage.getBankNames();

    const el = document.getElementById('view-settings');
    el.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">Settings</div>
          <div class="page-sub">Customize categories, accounts, funds and manage your data</div>
        </div>
      </div>
      <div class="content-wrap" style="padding-top:0">

        <!-- Expense Categories -->
        <div class="section-card">
          <div class="sec-header">
            <div>
              <div class="sec-title">Expense Categories</div>
              <div class="sec-hint" style="margin:0">Click any name to rename. Set colors. Add or remove items freely.</div>
            </div>
            <button class="btn-secondary" onclick="App.addCategory()">+ New Category</button>
          </div>
          <div id="settings-cats-list">
            ${cats.map(cat => this._renderSettingsCat(cat)).join('')}
          </div>
        </div>

        <!-- Bank Accounts -->
        <div class="section-card">
          <div class="sec-header">
            <div>
              <div class="sec-title">Bank & Cash Accounts</div>
              <div class="sec-hint" style="margin:0">Track balances across all your accounts.</div>
            </div>
            <button class="btn-secondary" onclick="App.addBank()">+ Add Account</button>
          </div>
          <div class="settings-list" id="settings-banks">
            ${bankNames.length === 0
              ? '<p class="empty-state-inline">No accounts yet. Click "+ Add Account".</p>'
              : bankNames.map(b => `
                <div class="settings-item" id="bank-item-${b.id}">
                  <span class="settings-item-icon">🏦</span>
                  <input type="text" class="settings-name-input" value="${esc(b.label)}"
                    onblur="App.renameBankEntry('${b.id}',this.value)"
                    onkeydown="if(event.key==='Enter')this.blur()" />
                  <button class="btn-del-item" onclick="App.deleteBank('${b.id}')" title="Remove">×</button>
                </div>`).join('')}
          </div>
        </div>

        <!-- Investment Funds -->
        <div class="section-card">
          <div class="sec-header">
            <div>
              <div class="sec-title">Investment Funds</div>
              <div class="sec-hint" style="margin:0">Track monthly investments across all categories.</div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button class="btn-secondary" onclick="App.addFund('stock')">📈 + Stock</button>
              <button class="btn-secondary" onclick="App.addFund('mutual_fund')">💹 + Mutual Fund</button>
              <button class="btn-secondary" onclick="App.addFund('crypto')">🪙 + Crypto</button>
              <button class="btn-secondary" onclick="App.addFund('us')">🌐 + US Stock</button>
            </div>
          </div>
          ${[
            { types: ['stock'],                    label: '📈 Stocks'        },
            { types: ['mutual_fund', 'indian'],    label: '💹 Mutual Funds'  },
            { types: ['crypto'],                   label: '🪙 Crypto'        },
            { types: ['us'],                       label: '🌐 US Stocks'     },
          ].map(g => {
            const gFunds = funds.filter(f => g.types.includes(f.type));
            return gFunds.length ? `
              <div class="fund-group-title">${g.label}</div>
              <div class="settings-list">
                ${gFunds.map(f => `
                  <div class="settings-item" id="fund-item-${f.id}">
                    <input type="text" class="settings-name-input" value="${esc(f.label)}"
                      onblur="App.renameFund('${f.id}',this.value)"
                      onkeydown="if(event.key==='Enter')this.blur()" />
                    <button class="btn-del-item" onclick="App.deleteFund('${f.id}')" title="Remove">×</button>
                  </div>`).join('')}
              </div>` : '';
          }).join('')}
          ${funds.length === 0 ? '<p class="empty-state-inline">No funds yet. Use the buttons above to add.</p>' : ''}
        </div>

        <!-- Data Management -->
        <div class="section-card">
          <div class="sec-title" style="margin-bottom:8px">Data Management</div>
          <div class="sec-hint">Export your data as JSON to back it up or transfer to another device.</div>
          <div class="data-actions">
            <button class="btn-primary" onclick="App.exportData()">⬇ Export All Data</button>
            <button class="btn-secondary" onclick="App.showImport()">⬆ Import Data</button>
            <button class="btn-danger" onclick="App.clearAllData()">🗑 Clear Expense Data</button>
          </div>
          <div class="sec-hint" style="margin-top:10px;color:#f87171">
            ⚠ "Clear Expense Data" removes all expenses, income, investments and bank records. Categories and settings are kept.
          </div>
        </div>

      </div>`;
  },

  _renderSettingsCat(cat) {
    return `
      <div class="settings-cat-card" id="scat-${cat.id}" style="border-left:5px solid ${cat.color}">
        <div class="settings-cat-header">
          <div class="settings-cat-left">
            <div class="color-swatch-row">
              ${COLOR_PRESETS.map(p => `
                <button class="color-swatch ${p.color === cat.color ? 'active' : ''}"
                  style="background:${p.color}"
                  title="Set color"
                  onclick="App.setCatColor('${cat.id}','${p.color}','${p.bg}','${p.border}','${p.textColor}')"></button>`).join('')}
            </div>
            <input type="text" class="settings-cat-name" value="${esc(cat.label)}"
              style="border-left:4px solid ${esc(cat.color)}"
              onblur="App.renameCat('${cat.id}',this.value)"
              onkeydown="if(event.key==='Enter')this.blur()"
              placeholder="Category name" />
          </div>
          <button class="btn-del-cat" onclick="App.deleteCat('${cat.id}')">🗑 Delete</button>
        </div>
        <div class="settings-cat-items" id="catitems-${cat.id}">
          ${cat.items.map(item => `
            <div class="settings-item settings-item-sub" id="sitem-${cat.id}-${item.id}">
              <span class="settings-item-dot" style="background:${cat.color}"></span>
              <input type="text" class="settings-name-input" value="${esc(item.label)}"
                onblur="App.renameItem('${cat.id}','${item.id}',this.value)"
                onkeydown="if(event.key==='Enter')this.blur()" />
              <button class="btn-del-item" onclick="App.deleteItem('${cat.id}','${item.id}')" title="Remove">×</button>
            </div>`).join('')}
        </div>
        <button class="btn-add-item" onclick="App.addItem('${cat.id}')"
          style="color:${cat.color}">+ Add Item</button>
      </div>`;
  },

  // ─── Category CRUD ─────────────────────────────────────────────────────────

  addCategory() {
    const name = prompt('New category name (e.g. "Fitness", "Gifts", "Education"):');
    if (!name || !name.trim()) return;
    const cats   = Storage.getCategories();
    const preset = COLOR_PRESETS[cats.length % COLOR_PRESETS.length];
    History.push();
    cats.push({
      id: 'cat' + uid(), label: name.trim(),
      color: preset.color, bg: preset.bg, border: preset.border, textColor: preset.textColor,
      items: []
    });
    Storage.saveCategories(cats);
    this.renderSettings();
    toast('Category "' + name.trim() + '" added');
  },

  renameCat(catId, newLabel) {
    if (!newLabel.trim()) return;
    const cats = Storage.getCategories();
    const cat  = cats.find(c => c.id === catId);
    if (cat && cat.label !== newLabel.trim()) {
      History.push();
      cat.label = newLabel.trim();
      Storage.saveCategories(cats);
      toast('Category renamed');
    }
  },

  setCatColor(catId, color, bg, border, textColor) {
    const cats = Storage.getCategories();
    const cat  = cats.find(c => c.id === catId);
    if (cat) {
      History.push();
      Object.assign(cat, { color, bg, border, textColor });
      Storage.saveCategories(cats);
      this.renderSettings();
    }
  },

  deleteCat(catId) {
    const cats = Storage.getCategories();
    const cat  = cats.find(c => c.id === catId);
    if (!cat) return;
    if (!confirm(`Delete category "${cat.label}"?\nExpense data for this category will be kept but won't appear in totals.`)) return;
    History.push();
    Storage.saveCategories(cats.filter(c => c.id !== catId));
    this.renderSettings();
    toast('Category deleted');
  },

  // ─── Item CRUD ─────────────────────────────────────────────────────────────

  addItem(catId) {
    const cats = Storage.getCategories();
    const cat  = cats.find(c => c.id === catId);
    if (!cat) return;
    const newId = 'i' + uid();
    History.push();
    cat.items.push({ id: newId, label: 'New Item' });
    Storage.saveCategories(cats);
    this.renderSettings();
    setTimeout(() => {
      const inp = document.querySelector(`#sitem-${catId}-${newId} input`);
      if (inp) { inp.focus(); inp.select(); }
    }, 80);
  },

  renameItem(catId, itemId, newLabel) {
    if (!newLabel.trim()) return;
    const cats = Storage.getCategories();
    const cat  = cats.find(c => c.id === catId);
    if (!cat) return;
    const item = cat.items.find(i => i.id === itemId);
    if (item && item.label !== newLabel.trim()) {
      History.push();
      item.label = newLabel.trim();
      Storage.saveCategories(cats);
    }
  },

  deleteItem(catId, itemId) {
    const cats = Storage.getCategories();
    const cat  = cats.find(c => c.id === catId);
    if (!cat) return;
    History.push();
    cat.items = cat.items.filter(i => i.id !== itemId);
    Storage.saveCategories(cats);
    const el = document.getElementById(`sitem-${catId}-${itemId}`);
    if (el) el.remove();
  },

  // ─── Bank CRUD ─────────────────────────────────────────────────────────────

  addBank() {
    const name = prompt('Bank or account name (e.g. "HDFC Bank", "Savings", "Cash"):');
    if (!name || !name.trim()) return;
    const banks = Storage.getBankNames();
    History.push();
    banks.push({ id: 'bank' + uid(), label: name.trim() });
    Storage.saveBankNames(banks);
    this.renderSettings();
    toast('Account added');
  },

  renameBankEntry(bankId, newLabel) {
    if (!newLabel.trim()) return;
    const banks = Storage.getBankNames();
    const bank  = banks.find(b => b.id === bankId);
    if (bank && bank.label !== newLabel.trim()) {
      History.push();
      bank.label = newLabel.trim();
      Storage.saveBankNames(banks);
      toast('Account renamed');
    }
  },

  deleteBank(bankId) {
    const banks = Storage.getBankNames();
    const bank  = banks.find(b => b.id === bankId);
    if (!bank) return;
    if (!confirm(`Remove "${bank.label}" from your accounts?`)) return;
    History.push();
    Storage.saveBankNames(banks.filter(b => b.id !== bankId));
    const el = document.getElementById('bank-item-' + bankId);
    if (el) el.remove();
    toast('Account removed');
  },

  // ─── Fund CRUD ─────────────────────────────────────────────────────────────

  addFund(type) {
    const labels = { stock: 'Stock name (e.g. "Reliance Industries", "TCS"):', mutual_fund: 'Mutual Fund name (e.g. "Mirae Asset Large Cap"):', crypto: 'Crypto name (e.g. "Bitcoin", "Ethereum"):', us: 'US Stock / ETF name (e.g. "S&P 500 ETF", "Apple"):', indian: 'Mutual Fund name:' };
    const name  = prompt(labels[type] || 'Fund name:');
    if (!name || !name.trim()) return;
    const funds = Storage.getFunds();
    History.push();
    funds.push({ id: 'fund' + uid(), label: name.trim(), type });
    Storage.saveFunds(funds);
    this.renderSettings();
    toast('Fund added');
  },

  renameFund(fundId, newLabel) {
    if (!newLabel.trim()) return;
    const funds = Storage.getFunds();
    const fund  = funds.find(f => f.id === fundId);
    if (fund && fund.label !== newLabel.trim()) {
      History.push();
      fund.label = newLabel.trim();
      Storage.saveFunds(funds);
      toast('Fund renamed');
    }
  },

  deleteFund(fundId) {
    const funds = Storage.getFunds();
    const fund  = funds.find(f => f.id === fundId);
    if (!fund) return;
    if (!confirm(`Remove "${fund.label}" from your funds?`)) return;
    History.push();
    Storage.saveFunds(funds.filter(f => f.id !== fundId));
    const el = document.getElementById('fund-item-' + fundId);
    if (el) el.remove();
    toast('Fund removed');
  },

  // ─── IMPORT / EXPORT ───────────────────────────────────────────────────────

  exportData() {
    const json = Storage.exportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = 'spendwise-backup-' + currentYM() + '.json';
    a.click();
    URL.revokeObjectURL(url);
    toast('Data exported successfully');
  },

  showImport()  { document.getElementById('importModal').style.display = 'flex'; },
  closeImport() {
    document.getElementById('importModal').style.display = 'none';
    document.getElementById('importData').value = '';
  },

  importData() {
    const raw = document.getElementById('importData').value.trim();
    if (!raw) return toast('Paste JSON data first', 'error');
    try {
      History.push();
      Object.keys(this.charts).forEach(k => { try { this.charts[k].destroy(); } catch {} });
      this.charts = {};
      this._monthlyData = {};
      this._bankBuf = {};
      this._invBuf  = { sips: {} };
      Storage.importAll(raw);
      this.closeImport();
      this.renderView(this.view);
      toast('Data imported successfully!');
    } catch {
      toast('Invalid JSON — please check the file and try again', 'error');
    }
  },

  clearAllData() {
    if (!confirm('Clear ALL expense data (expenses, income, investments, bank balances)?\n\nYour categories and settings will be kept.')) return;
    // Destroy all chart instances before clearing so they don't hold stale references
    Object.keys(this.charts).forEach(k => { try { this.charts[k].destroy(); } catch {} });
    this.charts = {};
    Storage.clearExpenseData();
    this._monthlyData = {};
    this._bankBuf = {};
    this._invBuf  = { sips: {} };
    toast('All expense data cleared');
    this.renderView(this.view);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
