import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date instanceof Date ? date : new Date(date))
}

export function formatCurrency(amount: number, currency: string = "USD") {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
  }).format(amount)
}

export function truncateString(str: string, maxLength: number = 100) {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength)}...`
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function generateGradient(seed: string) {
  // Generate a consistent hash from the seed string
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Convert the hash to RGB components
  const r1 = (hash & 0xFF) % 255
  const g1 = ((hash >> 8) & 0xFF) % 255
  const b1 = ((hash >> 16) & 0xFF) % 255
  
  // Generate a second color that contrasts with the first
  const r2 = (255 - r1) % 255
  const g2 = (255 - g1) % 255
  const b2 = (255 - b1) % 255
  
  return `linear-gradient(135deg, rgb(${r1}, ${g1}, ${b1}), rgb(${r2}, ${g2}, ${b2}))`
}

export function isValidEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function createSlug(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
