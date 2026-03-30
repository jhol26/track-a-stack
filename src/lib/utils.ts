import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function calculateNetProfit(income: number, expenses: number): number {
  return income - expenses
}

export function calculateTaxEstimate(netProfit: number, rate: number = 0.25): number {
  return netProfit > 0 ? netProfit * rate : 0
}

export function calculateHourlyRate(income: number, hours: number): number {
  return hours > 0 ? income / hours : 0
}
