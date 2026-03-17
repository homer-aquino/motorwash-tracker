import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const income = await db.income.findMany({
      orderBy: { date: 'desc' }
    })
    return NextResponse.json(income)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch income' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { date, description, category, amount } = body
    
    const income = await db.income.create({
      data: {
        date: new Date(date),
        description,
        category,
        amount: parseFloat(amount)
      }
    })
    return NextResponse.json(income)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create income' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    
    await db.income.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete income' }, { status: 500 })
  }
}
