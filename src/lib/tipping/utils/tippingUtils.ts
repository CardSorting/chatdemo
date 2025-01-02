export function getProgressValue(current: number, goal: number): number {
  return Math.min(100, (current / goal) * 100);
}

export function getTipProgressValue(amount: number, balance: number): number {
  if (!balance) return 0;
  return Math.min(100, (amount / balance) * 100);
}

export function formatPulseAmount(amount: number): string {
  return new Intl.NumberFormat('en-US').format(amount);
}

export function validateTipAmount(amount: number, balance: number): boolean {
  return amount > 0 && amount <= balance;
}