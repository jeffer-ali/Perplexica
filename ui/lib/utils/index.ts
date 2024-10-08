import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { OpenAI } from '@ai-sdk/openai'
import { createAzure } from '@ai-sdk/azure';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getModel() {
  if (process.env.AZURE_RESOURCE_NAME && process.env.AZURE_API_KEY) {
    const azure = createAzure({
      resourceName: process.env.AZURE_RESOURCE_NAME, // Azure resource name
      apiKey: process.env.AZURE_API_KEY,
    });
    return azure(process.env.OPENAI_API_MODEL || 'gpt-4o')
  } else {
    const openai = new OpenAI({
      baseUrl: process.env.OPENAI_API_BASE, // optional base URL for proxies etc.
      apiKey: process.env.OPENAI_API_KEY, // optional API key, default to env property OPENAI_API_KEY
      organization: '' // optional organization
    })
    return openai.chat(process.env.OPENAI_API_MODEL || 'gpt-4o')
  }
}

// 拿到一个字符串，并获取首字母大写
export function getFirstLetterAndUpperCase(str: string) {
  if (str && typeof str === 'string') {
    return str.charAt(0).toUpperCase()
  }
  return ''
}

export const isMobileDeviceFn = () => {
  if (typeof navigator !== 'undefined') {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  }
  return false
}

export function getUTC8ISOString() {
  const now = new Date()
  // const utc8Offset = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
  // const utc8Time = new Date(now.getTime() + utc8Offset);

  // // Convert to ISO string and then manually adjust the time zone part to "+08:00"
  // const isoString = utc8Time.toISOString();
  // return isoString.replace('Z', '+08:00');

  return now
}

export function getCurrentData() {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const formattedDate = `${year}/${month}/${day}`
  return formattedDate
}

export function getSearchCategory() {
  return typeof localStorage !== 'undefined' ? localStorage.getItem('searchCategory') ?? 'All' : 'All'
}