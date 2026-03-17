'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  Trash2, 
  Car, 
  Droplets, 
  Zap, 
  Wrench, 
  Users, 
  Home as HomeIcon,
  Sparkles,
  Settings,
  AlertCircle
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Income {
  id: string
  date: string
  description: string
  category: string
  amount: number
}

interface Expense {
  id: string
  date: string
  description: string
  category: string
  amount: number
}

interface Summary {
  totalIncome: number
  totalExpenses: number
  netProfit: number
  incomeByCategory: Record<string, number>
  expensesByCategory: Record<string, number>
  isProfitable: boolean
  isBreakEven: boolean
  isLoss: boolean
}

const INCOME_CATEGORIES = [
  { value: 'Car Wash', label: 'Car Wash' },
  { value: 'Motorcycle Wash', label: 'Motorcycle Wash' },
  { value: 'Detailing', label: 'Detailing' },
  { value: 'Waxing', label: 'Waxing' },
  { value: 'Engine Wash', label: 'Engine Wash' },
  { value: 'Others', label: 'Others' },
]

const EXPENSE_CATEGORIES = [
  { value: 'Water', label: 'Water' },
  { value: 'Electricity', label: 'Electricity' },
  { value: 'Soap/Chemicals', label: 'Soap/Chemicals' },
  { value: 'Equipment', label: 'Equipment' },
  { value: 'Salary', label: 'Salary' },
  { value: 'Rental', label: 'Rental' },
  { value: 'Others', label: 'Others' },
]

export default function Home() {
  const [income, setIncome] = useState<Income[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false)
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [incomeForm, setIncomeForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Car Wash',
    amount: ''
  })
  
  const [expenseForm, setExpenseForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Water',
    amount: ''
  })

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [incomeRes, expenseRes, summaryRes] = await Promise.all([
        fetch('/api/income'),
        fetch('/api/expense'),
        fetch('/api/summary')
      ])
      
      const incomeData = await incomeRes.json()
      const expenseData = await expenseRes.json()
      const summaryData = await summaryRes.json()
      
      setIncome(incomeData)
      setExpenses(expenseData)
      setSummary(summaryData)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddIncome = async () => {
    if (!incomeForm.description || !incomeForm.amount) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      })
      return
    }

    try {
      await fetch('/api/income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incomeForm)
      })
      
      setIncomeForm({
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: 'Car Wash',
        amount: ''
      })
      setIsAddIncomeOpen(false)
      fetchData()
      
      toast({
        title: 'Success!',
        description: 'Income added successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add income',
        variant: 'destructive'
      })
    }
  }

  const handleAddExpense = async () => {
    if (!expenseForm.description || !expenseForm.amount) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      })
      return
    }

    try {
      await fetch('/api/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseForm)
      })
      
      setExpenseForm({
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: 'Water',
        amount: ''
      })
      setIsAddExpenseOpen(false)
      fetchData()
      
      toast({
        title: 'Success!',
        description: 'Expense added successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add expense',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteIncome = async (id: string) => {
    try {
      await fetch(`/api/income?id=${id}`, { method: 'DELETE' })
      fetchData()
      toast({
        title: 'Deleted',
        description: 'Income entry deleted',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete income',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteExpense = async (id: string) => {
    try {
      await fetch(`/api/expense?id=${id}`, { method: 'DELETE' })
      fetchData()
      toast({
        title: 'Deleted',
        description: 'Expense entry deleted',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete expense',
        variant: 'destructive'
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-20">
      <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Droplets className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Motorwash Tracker</h1>
              <p className="text-emerald-100 text-sm">Business Income & Expense</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-md rounded-xl p-1 mb-4">
            <TabsTrigger value="dashboard" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Dashboard</TabsTrigger>
            <TabsTrigger value="income" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Income</TabsTrigger>
            <TabsTrigger value="expenses" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Expenses</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-sm font-medium text-emerald-100">Income</span>
                  </div>
                  <p className="text-2xl font-bold">{formatCurrency(summary?.totalIncome || 0)}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-5 w-5" />
                    <span className="text-sm font-medium text-red-100">Expenses</span>
                  </div>
                  <p className="text-2xl font-bold">{formatCurrency(summary?.totalExpenses || 0)}</p>
                </CardContent>
              </Card>
            </div>

            <Card className={`border-0 shadow-lg ${summary?.isProfitable ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : summary?.isLoss ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-amber-500 to-orange-600'} text-white`}>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DollarSign className="h-6 w-6" />
                    <span className="text-lg font-medium opacity-90">Net Profit/Loss</span>
                  </div>
                  <p className="text-4xl font-bold mb-2">{formatCurrency(summary?.netProfit || 0)}</p>
                  <Badge className="bg-white/20 text-white hover:bg-white/30">
                    {summary?.isProfitable ? 'PROFITABLE' : summary?.isLoss ? 'LOSS' : 'BREAK EVEN'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Income by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-40">
                  {summary?.incomeByCategory && Object.entries(summary.incomeByCategory).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(summary.incomeByCategory).map(([category, amount]) => (
                        <div key={category} className="flex justify-between items-center p-2 bg-emerald-50 rounded-lg">
                          <span className="text-sm font-medium text-slate-700">{category}</span>
                          <span className="font-bold text-emerald-600">{formatCurrency(amount)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 py-8">
                      <AlertCircle className="h-8 w-8 mb-2" />
                      <p>No income yet</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  Expenses by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-40">
                  {summary?.expensesByCategory && Object.entries(summary.expensesByCategory).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(summary.expensesByCategory).map(([category, amount]) => (
                        <div key={category} className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                          <span className="text-sm font-medium text-slate-700">{category}</span>
                          <span className="font-bold text-red-600">{formatCurrency(amount)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 py-8">
                      <AlertCircle className="h-8 w-8 mb-2" />
                      <p>No expenses yet</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="income" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Income Records</h2>
              <Dialog open={isAddIncomeOpen} onOpenChange={setIsAddIncomeOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-md">
                    <Plus className="h-4 w-4 mr-2" />Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm mx-4">
                  <DialogHeader>
                    <DialogTitle className="text-emerald-600">Add Income</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="income-date">Date</Label>
                      <Input id="income-date" type="date" value={incomeForm.date} onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="income-desc">Description</Label>
                      <Input id="income-desc" placeholder="Ex. Car wash - Toyota" value={incomeForm.description} onChange={(e) => setIncomeForm({ ...incomeForm, description: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="income-cat">Category</Label>
                      <Select value={incomeForm.category} onValueChange={(value) => setIncomeForm({ ...incomeForm, category: value })}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {INCOME_CATEGORIES.map((cat) => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="income-amount">Amount</Label>
                      <Input id="income-amount" type="number" placeholder="0.00" value={incomeForm.amount} onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })} className="mt-1" />
                    </div>
                    <Button onClick={handleAddIncome} className="w-full bg-emerald-600 hover:bg-emerald-700">Save</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="shadow-lg border-0">
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  {income.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {income.map((item) => (
                        <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-slate-800">{item.description}</p>
                              <p className="text-sm text-slate-500">{formatDate(item.date)}</p>
                              <Badge variant="secondary" className="mt-1 bg-emerald-100 text-emerald-700">{item.category}</Badge>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-emerald-600">{formatCurrency(item.amount)}</p>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1" onClick={() => handleDeleteIncome(item.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                      <TrendingUp className="h-12 w-12 mb-2" />
                      <p>No income entries yet</p>
                      <p className="text-sm">Add income using the button above</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="bg-emerald-600 text-white shadow-lg border-0">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Income:</span>
                  <span className="text-2xl font-bold">{formatCurrency(summary?.totalIncome || 0)}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Expense Records</h2>
              <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700 shadow-md">
                    <Plus className="h-4 w-4 mr-2" />Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm mx-4">
                  <DialogHeader>
                    <DialogTitle className="text-red-600">Add Expense</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="expense-date">Date</Label>
                      <Input id="expense-date" type="date" value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="expense-desc">Description</Label>
                      <Input id="expense-desc" placeholder="Ex. Monthly water bill" value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="expense-cat">Category</Label>
                      <Select value={expenseForm.category} onValueChange={(value) => setExpenseForm({ ...expenseForm, category: value })}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {EXPENSE_CATEGORIES.map((cat) => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="expense-amount">Amount</Label>
                      <Input id="expense-amount" type="number" placeholder="0.00" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} className="mt-1" />
                    </div>
                    <Button onClick={handleAddExpense} className="w-full bg-red-600 hover:bg-red-700">Save</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="shadow-lg border-0">
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  {expenses.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {expenses.map((item) => (
                        <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-slate-800">{item.description}</p>
                              <p className="text-sm text-slate-500">{formatDate(item.date)}</p>
                              <Badge variant="secondary" className="mt-1 bg-red-100 text-red-700">{item.category}</Badge>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-red-600">{formatCurrency(item.amount)}</p>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1" onClick={() => handleDeleteExpense(item.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                      <TrendingDown className="h-12 w-12 mb-2" />
                      <p>No expense entries yet</p>
                      <p className="text-sm">Add expense using the button above</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="bg-red-600 text-white shadow-lg border-0">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Expenses:</span>
                  <span className="text-2xl font-bold">{formatCurrency(summary?.totalExpenses || 0)}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
        <div className="max-w-lg mx-auto grid grid-cols-3">
          <Button variant="ghost" className={`flex flex-col items-center py-3 h-auto rounded-none ${activeTab === 'dashboard' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500'}`} onClick={() => setActiveTab('dashboard')}>
            <DollarSign className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </Button>
          <Button variant="ghost" className={`flex flex-col items-center py-3 h-auto rounded-none ${activeTab === 'income' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500'}`} onClick={() => setActiveTab('income')}>
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs mt-1">Income</span>
          </Button>
          <Button variant="ghost" className={`flex flex-col items-center py-3 h-auto rounded-none ${activeTab === 'expenses' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500'}`} onClick={() => setActiveTab('expenses')}>
            <TrendingDown className="h-5 w-5" />
            <span className="text-xs mt-1">Expenses</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}
