// js/config.js — generic defaults (no personal data) + color palette

// ─── Color presets users can pick for categories ─────────────────────────────
const COLOR_PRESETS = [
  { color: '#ea580c', bg: '#fff7ed', border: '#fb923c', textColor: '#9a3412' },
  { color: '#0891b2', bg: '#ecfeff', border: '#67e8f9', textColor: '#164e63' },
  { color: '#dc2626', bg: '#fef2f2', border: '#fca5a5', textColor: '#7f1d1d' },
  { color: '#16a34a', bg: '#f0fdf4', border: '#86efac', textColor: '#14532d' },
  { color: '#9f1239', bg: '#fff1f2', border: '#fda4af', textColor: '#4c0519' },
  { color: '#1d4ed8', bg: '#eff6ff', border: '#93c5fd', textColor: '#1e3a8a' },
  { color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd', textColor: '#4c1d95' },
  { color: '#be185d', bg: '#fdf2f8', border: '#f9a8d4', textColor: '#831843' },
  { color: '#b45309', bg: '#fffbeb', border: '#fcd34d', textColor: '#78350f' },
  { color: '#0f766e', bg: '#f0fdfa', border: '#5eead4', textColor: '#134e4a' },
  { color: '#4338ca', bg: '#eef2ff', border: '#a5b4fc', textColor: '#312e81' },
  { color: '#15803d', bg: '#f0fdf4', border: '#6ee7b7', textColor: '#166534' }
];

// ─── Default categories (users add their own fields via + in Monthly view) ────
const DEFAULT_CATEGORIES = [
  { id: 'cat_family',   label: 'Family & Friends', color: '#ea580c', items: [] },
  { id: 'cat_transport',label: 'Transport',         color: '#0891b2', items: [] },
  { id: 'cat_recharges',label: 'Recharges',         color: '#dc2626', items: [] },
  { id: 'cat_bills',    label: 'Bills',             color: '#16a34a', items: [] },
  { id: 'cat_food',     label: 'Food',              color: '#9f1239', items: [] },
  { id: 'cat_shopping', label: 'Shopping',          color: '#7c3aed', items: [] },
  { id: 'cat_personal', label: 'Personal Care',     color: '#be185d', items: [] },
  { id: 'cat_entertain',label: 'Entertainment',     color: '#1d4ed8', items: [] },
  { id: 'cat_others',   label: 'Others',            color: '#b45309', items: [] }
];

// ─── Default investment funds (start fresh — users add their own) ─────────────
const DEFAULT_FUNDS = [];

// ─── Default bank accounts (generic — users customize in Settings) ────────────
const DEFAULT_BANKS = [
  { id: 'bank_primary',  label: 'Primary Bank',    emoji: '🏦' },
  { id: 'bank_savings',  label: 'Savings Bank',    emoji: '🐷' },
  { id: 'bank_cash',     label: 'Cash',            emoji: '💵' },
  { id: 'bank_trading',  label: 'Trading Account', emoji: '📊' }
];

// ─── Decorative emoji watermarks for default categories ───────────────────────
const CAT_EMOJIS = {
  cat_family:    '👨‍👩‍👧',
  cat_transport: '🚗',
  cat_recharges: '📱',
  cat_bills:     '💡',
  cat_food:      '🍽️',
  cat_shopping:  '🛍️',
  cat_personal:  '🌸',
  cat_entertain: '🎬',
  cat_others:    '📦',
};

// ─── Fund type configuration ──────────────────────────────────────────────────
const FUND_TYPE_CONFIG = {
  stock:       { label: 'Stocks',       emoji: '📈', color: '#4ade80', bg: 'rgba(74,222,128,.1)'  },
  mutual_fund: { label: 'Mutual Funds', emoji: '💹', color: '#a78bfa', bg: 'rgba(167,139,250,.1)' },
  crypto:      { label: 'Crypto',       emoji: '🪙', color: '#fbbf24', bg: 'rgba(251,191,36,.1)'  },
  us:          { label: 'US Stocks',    emoji: '🌐', color: '#38bdf8', bg: 'rgba(56,189,248,.1)'  },
};

// ─── Worldwide banks for autocomplete (name, emoji, country code) ─────────────
const WORLDWIDE_BANKS = [
  // India — logoUrl = verified direct link from official bank website
  { name: 'State Bank of India (SBI)',  emoji: '🏦', country: 'IN', domain: 'sbi.co.in',         logoUrl: 'https://sbi.bank.in/o/SBI-Theme/images/custom/logo.png' },
  { name: 'HDFC Bank',                  emoji: '🏦', country: 'IN', domain: 'hdfcbank.com'       },
  { name: 'ICICI Bank',                 emoji: '🏦', country: 'IN', domain: 'icicibank.com'      },
  { name: 'Axis Bank',                  emoji: '🏦', country: 'IN', domain: 'axisbank.com'       },
  { name: 'Kotak Mahindra Bank',        emoji: '🏦', country: 'IN', domain: 'kotak.com'           },
  { name: 'Punjab National Bank (PNB)', emoji: '🏦', country: 'IN', domain: 'pnbindia.in',        logoUrl: 'https://pnb.bank.in/images/logo.png' },
  { name: 'Bank of Baroda',             emoji: '🏦', country: 'IN', domain: 'bankofbaroda.in'     },
  { name: 'Canara Bank',                emoji: '🏦', country: 'IN', domain: 'canarabank.com'      },
  { name: 'IndusInd Bank',              emoji: '🏦', country: 'IN', domain: 'indusind.com'        },
  { name: 'Yes Bank',                   emoji: '🏦', country: 'IN', domain: 'yesbank.in'          },
  { name: 'Federal Bank',               emoji: '🏦', country: 'IN', domain: 'federalbank.co.in'   },
  { name: 'IDFC FIRST Bank',            emoji: '🏦', country: 'IN', domain: 'idfcfirstbank.com'   },
  { name: 'Union Bank of India',        emoji: '🏦', country: 'IN', domain: 'unionbankofindia.co.in' },
  { name: 'Bank of India',              emoji: '🏦', country: 'IN', domain: 'bankofindia.co.in'   },
  { name: 'Indian Bank',                emoji: '🏦', country: 'IN', domain: 'indianbank.in'       },
  { name: 'UCO Bank',                   emoji: '🏦', country: 'IN', domain: 'ucobank.com'         },
  { name: 'Central Bank of India',      emoji: '🏦', country: 'IN', domain: 'centralbankofindia.co.in' },
  { name: 'Bank of Maharashtra',        emoji: '🏦', country: 'IN', domain: 'bankofmaharashtra.in' },
  { name: 'Indian Overseas Bank (IOB)', emoji: '🏦', country: 'IN', domain: 'iob.in'             },
  { name: 'RBL Bank',                   emoji: '🏦', country: 'IN', domain: 'rblbank.com'        },
  { name: 'AU Small Finance Bank',      emoji: '🏦', country: 'IN', domain: 'aubank.in'          },
  { name: 'Paytm Payments Bank',        emoji: '💳', country: 'IN', domain: 'paytmbank.com'      },
  { name: 'Airtel Payments Bank',       emoji: '💳', country: 'IN', domain: 'airtel.in'          },
  { name: 'Jio Payments Bank',          emoji: '💳', country: 'IN', domain: 'jio.com'            },
  { name: 'PhonePe',                    emoji: '📱', country: 'IN', domain: 'phonepe.com'        },
  { name: 'Google Pay (GPay)',          emoji: '📱', country: 'IN', domain: 'pay.google.com'     },
  { name: 'Zerodha',                    emoji: '📊', country: 'IN', domain: 'zerodha.com'        },
  { name: 'Groww',                      emoji: '🌱', country: 'IN', domain: 'groww.in'           },
  { name: 'Upstox',                     emoji: '📊', country: 'IN', domain: 'upstox.com'         },
  { name: 'Angel One',                  emoji: '📊', country: 'IN', domain: 'angelone.in'        },
  { name: 'Sharekhan',                  emoji: '📊', country: 'IN', domain: 'sharekhan.com'      },
  { name: 'IIFL Securities',            emoji: '📊', country: 'IN', domain: 'indiainfoline.com'  },
  { name: 'Post Office Savings Bank',   emoji: '📮', country: 'IN', domain: 'indiapost.gov.in'   },
  { name: 'EPF / Provident Fund',       emoji: '🔒', country: 'IN', domain: 'epfindia.gov.in'    },
  { name: 'PPF Account',                emoji: '🔐', country: 'IN', domain: ''                   },
  { name: 'NPS Account',                emoji: '🏛️', country: 'IN', domain: 'npscra.nsdl.co.in'  },
  { name: 'Sukanya Samriddhi Yojana',   emoji: '💝', country: 'IN', domain: ''                   },
  { name: 'Bajaj Finance FD',           emoji: '💰', country: 'IN', domain: 'bajajfinserv.in'    },
  { name: 'Navi',                       emoji: '💻', country: 'IN', domain: 'navi.com'           },
  { name: 'Jupiter',                    emoji: '💻', country: 'IN', domain: 'jupiter.money'      },
  { name: 'Fi Money',                   emoji: '💻', country: 'IN', domain: 'fi.money'           },
  // USA
  { name: 'JPMorgan Chase',             emoji: '🏛️', country: 'US', domain: 'jpmorgan.com'       },
  { name: 'Bank of America',            emoji: '🏛️', country: 'US', domain: 'bankofamerica.com'  },
  { name: 'Wells Fargo',                emoji: '🏛️', country: 'US', domain: 'wellsfargo.com'     },
  { name: 'Citibank',                   emoji: '🏛️', country: 'US', domain: 'citibank.com'       },
  { name: 'Goldman Sachs',              emoji: '💼', country: 'US', domain: 'goldmansachs.com'   },
  { name: 'Morgan Stanley',             emoji: '💼', country: 'US', domain: 'morganstanley.com'  },
  { name: 'Charles Schwab',             emoji: '📊', country: 'US', domain: 'schwab.com'         },
  { name: 'Fidelity',                   emoji: '📊', country: 'US', domain: 'fidelity.com'       },
  { name: 'American Express',           emoji: '💳', country: 'US', domain: 'americanexpress.com'},
  { name: 'Capital One',                emoji: '💳', country: 'US', domain: 'capitalone.com'     },
  { name: 'TD Bank',                    emoji: '🏛️', country: 'US', domain: 'td.com'             },
  { name: 'PNC Financial',              emoji: '🏛️', country: 'US', domain: 'pnc.com'            },
  { name: 'US Bancorp',                 emoji: '🏛️', country: 'US', domain: 'usbank.com'         },
  { name: 'Ally Bank',                  emoji: '💻', country: 'US', domain: 'ally.com'           },
  { name: 'SoFi',                       emoji: '💻', country: 'US', domain: 'sofi.com'           },
  { name: 'Chime',                      emoji: '💻', country: 'US', domain: 'chime.com'          },
  { name: 'Robinhood',                  emoji: '📈', country: 'US', domain: 'robinhood.com'      },
  { name: 'Coinbase',                   emoji: '🪙', country: 'US', domain: 'coinbase.com'       },
  { name: 'Kraken',                     emoji: '🪙', country: 'US', domain: 'kraken.com'         },
  // UK
  { name: 'Barclays',                   emoji: '🏛️', country: 'GB', domain: 'barclays.co.uk'     },
  { name: 'HSBC',                       emoji: '🌐', country: 'GB', domain: 'hsbc.com'           },
  { name: 'Lloyds Bank',                emoji: '🏛️', country: 'GB', domain: 'lloydsbank.com'     },
  { name: 'NatWest',                    emoji: '🏛️', country: 'GB', domain: 'natwest.com'        },
  { name: 'Santander UK',               emoji: '🏦', country: 'GB', domain: 'santander.co.uk'    },
  { name: 'Standard Chartered',         emoji: '🌐', country: 'GB', domain: 'sc.com'             },
  { name: 'Monzo',                      emoji: '💻', country: 'GB', domain: 'monzo.com'          },
  { name: 'Revolut',                    emoji: '💻', country: 'GB', domain: 'revolut.com'        },
  { name: 'Starling Bank',              emoji: '💻', country: 'GB', domain: 'starlingbank.com'   },
  { name: 'Wise (TransferWise)',         emoji: '💻', country: 'GB', domain: 'wise.com'           },
  // Europe
  { name: 'Deutsche Bank',              emoji: '🏛️', country: 'DE', domain: 'db.com'             },
  { name: 'Commerzbank',                emoji: '🏛️', country: 'DE', domain: 'commerzbank.com'    },
  { name: 'N26',                        emoji: '💻', country: 'DE', domain: 'n26.com'            },
  { name: 'BNP Paribas',                emoji: '🏛️', country: 'FR', domain: 'bnpparibas.com'     },
  { name: 'Société Générale',           emoji: '🏛️', country: 'FR', domain: 'societegenerale.com'},
  { name: 'ING Bank',                   emoji: '🏦', country: 'NL', domain: 'ing.com'            },
  { name: 'ABN AMRO',                   emoji: '🏦', country: 'NL', domain: 'abnamro.nl'         },
  { name: 'UBS',                        emoji: '💼', country: 'CH', domain: 'ubs.com'            },
  { name: 'UniCredit',                  emoji: '🏛️', country: 'IT', domain: 'unicredit.eu'       },
  { name: 'BBVA',                       emoji: '🏛️', country: 'ES', domain: 'bbva.com'           },
  { name: 'Banco Santander',            emoji: '🏦', country: 'ES', domain: 'santander.com'      },
  // Asia Pacific
  { name: 'DBS Bank',                   emoji: '🏦', country: 'SG', domain: 'dbs.com'            },
  { name: 'OCBC Bank',                  emoji: '🏦', country: 'SG', domain: 'ocbc.com'           },
  { name: 'UOB',                        emoji: '🏦', country: 'SG', domain: 'uob.com.sg'         },
  { name: 'Maybank',                    emoji: '🏦', country: 'MY', domain: 'maybank.com'        },
  { name: 'CIMB Bank',                  emoji: '🏦', country: 'MY', domain: 'cimb.com'           },
  { name: 'ICBC (China)',               emoji: '🏦', country: 'CN', domain: 'icbc.com.cn'        },
  { name: 'Mitsubishi UFJ (MUFG)',      emoji: '🏦', country: 'JP', domain: 'bk.mufg.jp'         },
  { name: 'Mizuho Bank',                emoji: '🏦', country: 'JP', domain: 'mizuhobank.co.jp'   },
  { name: 'KB Kookmin Bank',            emoji: '🏦', country: 'KR', domain: 'kbfg.com'          },
  { name: 'Commonwealth Bank (CBA)',    emoji: '🏦', country: 'AU', domain: 'commbank.com.au'    },
  { name: 'ANZ Bank',                   emoji: '🏦', country: 'AU', domain: 'anz.com.au'         },
  { name: 'Westpac',                    emoji: '🏦', country: 'AU', domain: 'westpac.com.au'     },
  // Middle East
  { name: 'Emirates NBD',               emoji: '🏦', country: 'AE', domain: 'emiratesnbd.com'    },
  { name: 'Qatar National Bank',        emoji: '🏦', country: 'QA', domain: 'qnb.com'            },
  { name: 'Al Rajhi Bank',              emoji: '🏦', country: 'SA', domain: 'alrajhibank.com.sa'  },
  // Generic
  { name: 'Cash',                       emoji: '💵', country: '',   domain: ''                   },
  { name: 'Wallet / UPI',               emoji: '📱', country: '',   domain: ''                   },
  { name: 'Trading Account',            emoji: '📊', country: '',   domain: ''                   },
  { name: 'Savings Account',            emoji: '💰', country: '',   domain: ''                   },
  { name: 'Fixed Deposit (FD)',         emoji: '🔒', country: '',   domain: ''                   },
];

// ─── Investment search lists for autocomplete ─────────────────────────────────
const INV_SEARCH = {
  stock: [
    'Reliance Industries', 'TCS', 'HDFC Bank', 'Infosys', 'ICICI Bank',
    'HUL (Hindustan Unilever)', 'ITC', 'Wipro', 'Bajaj Finance', 'Kotak Mahindra Bank',
    'Axis Bank', 'L&T (Larsen & Toubro)', 'SBI', 'Titan Company', 'Asian Paints',
    'Nestle India', 'Maruti Suzuki', 'Sun Pharma', 'Bharti Airtel', 'Adani Ports',
    'Power Grid Corporation', 'NTPC', 'Tech Mahindra', 'UltraTech Cement', 'Divi\'s Labs',
    'Eicher Motors', 'JSW Steel', 'Tata Steel', 'BPCL', 'Cipla',
    'Dr Reddy\'s Laboratories', 'Hindalco', 'ONGC', 'Coal India', 'Pidilite Industries',
    'Havells India', 'Tata Motors', 'Vedanta', 'Bajaj Auto', 'Hero MotoCorp',
    'Grasim Industries', 'Shree Cement', 'Tata Consumer Products', 'HDFC Life',
    'Britannia Industries', 'Apollo Hospitals', 'Divis Laboratories', 'Tata Power',
  ],
  mutual_fund: [
    'Mirae Asset Large Cap Fund', 'Axis Bluechip Fund', 'SBI Bluechip Fund',
    'HDFC Top 100 Fund', 'Canara Robeco Bluechip Fund', 'Parag Parikh Flexi Cap Fund',
    'Kotak Flexicap Fund', 'Nippon India Growth Fund', 'HDFC Mid-Cap Opportunities',
    'Axis Midcap Fund', 'Kotak Emerging Equity Fund', 'Motilal Oswal Midcap 30',
    'Nippon India Small Cap', 'SBI Small Cap Fund', 'Quant Small Cap Fund',
    'Kotak Small Cap Fund', 'DSP Midcap Fund', 'UTI Nifty 50 Index Fund',
    'Navi Nifty 50 Index Fund', 'HDFC Index S&P BSE Sensex', 'Axis Nifty 100 Index',
    'ICICI Pru Nifty Index Fund', 'Mirae Asset ELSS Tax Saver', 'Axis Long Term Equity',
    'Quant Tax Plan', 'Motilal Oswal Nasdaq 100 FoF', 'ICICI Pru US Bluechip',
    'Kotak Nasdaq 100 FoF', 'Edelweiss US Technology Fund', 'PGIM India Midcap',
    'Franklin India Smaller Co', 'Tata Digital India Fund', 'ICICI Pru Technology Fund',
    'Mirae Asset Healthcare Fund', 'Nippon India Liquid Fund', 'HDFC Liquid Fund',
  ],
  crypto: [
    'Bitcoin (BTC)', 'Ethereum (ETH)', 'Binance Coin (BNB)', 'Solana (SOL)',
    'Cardano (ADA)', 'XRP (XRP)', 'Polkadot (DOT)', 'Dogecoin (DOGE)',
    'Shiba Inu (SHIB)', 'Avalanche (AVAX)', 'Chainlink (LINK)', 'Polygon (MATIC)',
    'Litecoin (LTC)', 'Bitcoin Cash (BCH)', 'Stellar (XLM)', 'Tron (TRX)',
    'Cosmos (ATOM)', 'Algorand (ALGO)', 'Uniswap (UNI)', 'Aave (AAVE)',
    'Filecoin (FIL)', 'VeChain (VET)', 'EOS (EOS)', 'Monero (XMR)', 'Tezos (XTZ)',
  ],
  us: [
    'Apple (AAPL)', 'Microsoft (MSFT)', 'Alphabet / Google (GOOGL)', 'Amazon (AMZN)',
    'NVIDIA (NVDA)', 'Tesla (TSLA)', 'Meta Platforms (META)', 'Berkshire Hathaway (BRK)',
    'JPMorgan Chase (JPM)', 'Johnson & Johnson (JNJ)', 'S&P 500 ETF (VOO)',
    'Nasdaq 100 ETF (QQQ)', 'Total Market ETF (VTI)', 'Dividend ETF (VYM)',
    'Growth ETF (VUG)', 'S&P 500 ETF (SPY)', 'ARK Innovation (ARKK)',
    'iShares Core S&P (IVV)', 'Vanguard FTSE (VEA)', 'Emerging Markets (VWO)',
    'Gold ETF (GLD)', 'US Bond ETF (BND)', 'Real Estate (VNQ)',
    'UnitedHealth (UNH)', 'Visa (V)', 'Netflix (NFLX)', 'Adobe (ADBE)',
    'Salesforce (CRM)', 'Walt Disney (DIS)', 'PayPal (PYPL)',
  ],
};

// ─── Static constants ─────────────────────────────────────────────────────────
const CONFIG = {
  appName: 'SpendWise',
  currency: '₹',
  monthNames: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  monthFull:  ['January','February','March','April','May','June',
               'July','August','September','October','November','December']
};
