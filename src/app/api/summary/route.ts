import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const income = await db.income.findMany()
    const expenses = await db.expense.findMany()
    
    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0)
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0)
    const netProfit = totalIncome - totalExpenses
    
    const incomeByCategory: Record<string, number> = {}
    income.forEach(item => {
      incomeByCategory[item.category] = (incomeByCategory[item.category] || 0) + item.amount
    })
    
    const expensesByCategory: Record<string, number> = {}
    expenses.forEach(item => {
      expensesByCategory[item.category] = (expensesByCategory[item.category] || 0) + item.amount
    })
    
    return NextResponse.json({
      totalIncome,
      totalExpenses,
      netProfit,
      incomeByCategory,
      expensesByCategory,
      isProfitable: netProfit > 0,
      isBreakEven: netProfit === 0,
      isLoss: netProfit < 0
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 })
  }
}
