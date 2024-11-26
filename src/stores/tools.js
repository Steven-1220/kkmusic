import { defineStore } from 'pinia'

export const useToolsStore = defineStore('tools', () => {
  const processDateExpression = timeStr => {
    const date = new Date(timeStr)
    const formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    return formattedDate
  }

  const processDash = str => {
    const transformResult = str.replace(/-/g, '.')
    return transformResult
  }

  return {
    processDateExpression,
    processDash,
  }
})
