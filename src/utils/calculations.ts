
/**
 * Financial and travel calculation utilities for TravelBank Ultra
 */

// EMI Calculator
export const calculateEMI = (principal: number, annualRate: number, tenureMonths: number): {
  emi: number;
  totalInterest: number;
  totalAmount: number;
  schedule: Array<{ month: number; emi: number; principal: number; interest: number; balance: number }>;
} => {
  const monthlyRate = annualRate / 12 / 100;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  const totalAmount = emi * tenureMonths;
  const totalInterest = totalAmount - principal;

  const schedule = [];
  let balance = principal;
  for (let i = 1; i <= tenureMonths; i++) {
    const interest = balance * monthlyRate;
    const principalPart = emi - interest;
    balance -= principalPart;
    schedule.push({
      month: i,
      emi: Math.round(emi),
      principal: Math.round(principalPart),
      interest: Math.round(interest),
      balance: Math.max(0, Math.round(balance)),
    });
  }

  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalAmount: Math.round(totalAmount),
    schedule,
  };
};

// FD Calculator
export const calculateFD = (principal: number, annualRate: number, tenureMonths: number, compounding: 'monthly' | 'quarterly' | 'half-yearly' | 'yearly' = 'quarterly'): {
  maturityAmount: number;
  totalInterest: number;
  effectiveRate: number;
} => {
  const compoundingFrequency = {
    monthly: 12,
    quarterly: 4,
    'half-yearly': 2,
    yearly: 1,
  };
  const n = compoundingFrequency[compounding];
  const r = annualRate / 100;
  const t = tenureMonths / 12;
  const maturityAmount = principal * Math.pow(1 + r / n, n * t);
  const totalInterest = maturityAmount - principal;
  const effectiveRate = (Math.pow(1 + r / n, n) - 1) * 100;

  return {
    maturityAmount: Math.round(maturityAmount),
    totalInterest: Math.round(totalInterest),
    effectiveRate: Math.round(effectiveRate * 100) / 100,
  };
};

// SIP Calculator
export const calculateSIP = (monthlyInvestment: number, annualReturnRate: number, tenureMonths: number): {
  totalInvestment: number;
  estimatedReturns: number;
  totalValue: number;
  monthlyData: Array<{ month: number; investment: number; value: number; returns: number }>;
} => {
  const monthlyRate = annualReturnRate / 12 / 100;
  const totalValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, tenureMonths) - 1) / monthlyRate) * (1 + monthlyRate);
  const totalInvestment = monthlyInvestment * tenureMonths;
  const estimatedReturns = totalValue - totalInvestment;

  const monthlyData = [];
  let cumulativeInvestment = 0;
  let cumulativeValue = 0;
  for (let i = 1; i <= tenureMonths; i++) {
    cumulativeInvestment += monthlyInvestment;
    cumulativeValue = (cumulativeValue + monthlyInvestment) * (1 + monthlyRate);
    monthlyData.push({
      month: i,
      investment: Math.round(cumulativeInvestment),
      value: Math.round(cumulativeValue),
      returns: Math.round(cumulativeValue - cumulativeInvestment),
    });
  }

  return {
    totalInvestment: Math.round(totalInvestment),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(totalValue),
    monthlyData,
  };
};

// Lumpsum Calculator
export const calculateLumpsum = (investment: number, annualReturnRate: number, tenureYears: number): {
  totalValue: number;
  totalReturns: number;
  yearlyData: Array<{ year: number; value: number; returns: number }>;
} => {
  const totalValue = investment * Math.pow(1 + annualReturnRate / 100, tenureYears);
  const yearlyData = [];
  for (let i = 1; i <= tenureYears; i++) {
    const value = investment * Math.pow(1 + annualReturnRate / 100, i);
    yearlyData.push({
      year: i,
      value: Math.round(value),
      returns: Math.round(value - investment),
    });
  }

  return {
    totalValue: Math.round(totalValue),
    totalReturns: Math.round(totalValue - investment),
    yearlyData,
  };
};

// PPF Calculator
export const calculatePPF = (yearlyInvestment: number, tenureYears: number = 15, annualRate: number = 7.1): {
  totalInvestment: number;
  maturityAmount: number;
  totalInterest: number;
  yearlyData: Array<{ year: number; deposit: number; interest: number; balance: number }>;
} => {
  let balance = 0;
  const yearlyData = [];
  for (let i = 1; i <= tenureYears; i++) {
    balance += yearlyInvestment;
    const interest = balance * annualRate / 100;
    balance += interest;
    yearlyData.push({
      year: i,
      deposit: yearlyInvestment,
      interest: Math.round(interest),
      balance: Math.round(balance),
    });
  }

  return {
    totalInvestment: yearlyInvestment * tenureYears,
    maturityAmount: Math.round(balance),
    totalInterest: Math.round(balance - yearlyInvestment * tenureYears),
    yearlyData,
  };
};

// Gold Price Calculator
export const calculateGoldInvestment = (grams: number, pricePerGram: number, buyingCharges: number = 3): {
  totalCost: number;
  charges: number;
  gst: number;
  netCost: number;
} => {
  const baseCost = grams * pricePerGram;
  const charges = baseCost * buyingCharges / 100;
  const gst = (baseCost + charges) * 3 / 100;
  return {
    totalCost: Math.round(baseCost),
    charges: Math.round(charges),
    gst: Math.round(gst),
    netCost: Math.round(baseCost + charges + gst),
  };
};

// Tax Calculator (Old Regime)
export const calculateTaxOldRegime = (income: number, deductions: {
  section80C?: number;
  section80D?: number;
  hra?: number;
  section80E?: number;
  section80G?: number;
  other?: number;
} = {}): {
  taxableIncome: number;
  tax: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  slabBreakdown: Array<{ slab: string; rate: number; tax: number }>;
} => {
  const totalDeductions = Math.min(deductions.section80C || 0, 150000)
    + (deductions.section80D || 0)
    + (deductions.hra || 0)
    + (deductions.section80E || 0)
    + (deductions.section80G || 0)
    + (deductions.other || 0);
  const taxableIncome = Math.max(0, income - totalDeductions - 50000); // Standard deduction
  
  let tax = 0;
  const slabBreakdown = [];
  
  if (taxableIncome > 250000) {
    const slab1 = Math.min(taxableIncome - 250000, 250000);
    const tax1 = slab1 * 0.05;
    slabBreakdown.push({ slab: '2.5L - 5L', rate: 5, tax: Math.round(tax1) });
    tax += tax1;
  }
  if (taxableIncome > 500000) {
    const slab2 = Math.min(taxableIncome - 500000, 500000);
    const tax2 = slab2 * 0.2;
    slabBreakdown.push({ slab: '5L - 10L', rate: 20, tax: Math.round(tax2) });
    tax += tax2;
  }
  if (taxableIncome > 1000000) {
    const slab3 = taxableIncome - 1000000;
    const tax3 = slab3 * 0.3;
    slabBreakdown.push({ slab: 'Above 10L', rate: 30, tax: Math.round(tax3) });
    tax += tax3;
  }
  
  // Rebate u/s 87A
  if (taxableIncome <= 500000) tax = 0;
  
  const cess = tax * 0.04;
  const totalTax = tax + cess;
  
  return {
    taxableIncome: Math.round(taxableIncome),
    tax: Math.round(tax),
    cess: Math.round(cess),
    totalTax: Math.round(totalTax),
    effectiveRate: income > 0 ? Math.round(totalTax / income * 10000) / 100 : 0,
    slabBreakdown,
  };
};

// Tax Calculator (New Regime)
export const calculateTaxNewRegime = (income: number): {
  taxableIncome: number;
  tax: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  slabBreakdown: Array<{ slab: string; rate: number; tax: number }>;
} => {
  const taxableIncome = Math.max(0, income - 75000); // Standard deduction new regime
  
  let tax = 0;
  const slabBreakdown = [];
  const slabs = [
    { limit: 400000, rate: 0 },
    { limit: 800000, rate: 5 },
    { limit: 1200000, rate: 10 },
    { limit: 1600000, rate: 15 },
    { limit: 2000000, rate: 20 },
    { limit: 2400000, rate: 25 },
    { limit: Infinity, rate: 30 },
  ];
  
  let remaining = taxableIncome;
  let prevLimit = 0;
  for (const slab of slabs) {
    const slabAmount = Math.min(remaining, slab.limit - prevLimit);
    if (slabAmount <= 0) break;
    const slabTax = slabAmount * slab.rate / 100;
    if (slab.rate > 0) {
      slabBreakdown.push({
        slab: `${(prevLimit / 100000).toFixed(1)}L - ${slab.limit === Infinity ? '∞' : (slab.limit / 100000).toFixed(1) + 'L'}`,
        rate: slab.rate,
        tax: Math.round(slabTax),
      });
    }
    tax += slabTax;
    remaining -= slabAmount;
    prevLimit = slab.limit;
  }
  
  // Rebate u/s 87A (new regime)
  if (taxableIncome <= 1200000) tax = 0;
  
  const cess = tax * 0.04;
  const totalTax = tax + cess;
  
  return {
    taxableIncome: Math.round(taxableIncome),
    tax: Math.round(tax),
    cess: Math.round(cess),
    totalTax: Math.round(totalTax),
    effectiveRate: income > 0 ? Math.round(totalTax / income * 10000) / 100 : 0,
    slabBreakdown,
  };
};

// Retirement Calculator
export const calculateRetirement = (currentAge: number, retireAge: number, monthlyExpense: number, inflationRate: number = 6, expectedReturn: number = 10): {
  yearsToRetire: number;
  monthlyExpenseAtRetirement: number;
  corpusNeeded: number;
  monthlySIPNeeded: number;
} => {
  const yearsToRetire = retireAge - currentAge;
  const monthlyExpenseAtRetirement = monthlyExpense * Math.pow(1 + inflationRate / 100, yearsToRetire);
  const annualExpenseAtRetirement = monthlyExpenseAtRetirement * 12;
  const yearsPostRetirement = 85 - retireAge;
  const realReturnRate = ((1 + expectedReturn / 100) / (1 + inflationRate / 100) - 1);
  const corpusNeeded = annualExpenseAtRetirement * ((1 - Math.pow(1 + realReturnRate, -yearsPostRetirement)) / realReturnRate);
  const monthlyRate = expectedReturn / 12 / 100;
  const months = yearsToRetire * 12;
  const monthlySIPNeeded = corpusNeeded * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);

  return {
    yearsToRetire,
    monthlyExpenseAtRetirement: Math.round(monthlyExpenseAtRetirement),
    corpusNeeded: Math.round(corpusNeeded),
    monthlySIPNeeded: Math.round(monthlySIPNeeded),
  };
};

// CAGR Calculator
export const calculateCAGR = (beginningValue: number, endingValue: number, years: number): number => {
  if (beginningValue <= 0 || years <= 0) return 0;
  return (Math.pow(endingValue / beginningValue, 1 / years) - 1) * 100;
};

// XIRR approximation
export const calculateXIRR = (cashflows: Array<{ amount: number; date: Date }>): number => {
  // Newton-Raphson method
  let rate = 0.1;
  for (let i = 0; i < 100; i++) {
    let npv = 0;
    let dnpv = 0;
    const firstDate = cashflows[0].date;
    for (const cf of cashflows) {
      const years = (cf.date.getTime() - firstDate.getTime()) / (365.25 * 24 * 3600 * 1000);
      npv += cf.amount / Math.pow(1 + rate, years);
      dnpv -= years * cf.amount / Math.pow(1 + rate, years + 1);
    }
    const newRate = rate - npv / dnpv;
    if (Math.abs(newRate - rate) < 0.000001) break;
    rate = newRate;
  }
  return rate * 100;
};

export default {
  calculateEMI,
  calculateFD,
  calculateSIP,
  calculateLumpsum,
  calculatePPF,
  calculateGoldInvestment,
  calculateTaxOldRegime,
  calculateTaxNewRegime,
  calculateRetirement,
  calculateCAGR,
  calculateXIRR,
};
