import { db } from '@/utils/dbConfig'
import { Expenses } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Trash } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

function ExpenseListTable({expensesList , refreshData}) {

  const deleteExpenses = async (expenses) => {
    const result = await db.delete(Expenses)
    .where(eq(Expenses.id , expenses.id))
    .returning();

    if(result){
      toast("Expense Deleted");
      refreshData();
    }
  }


  return (
    <div className='mt-3'>
      <h2 className='font-bold text-lg my-3'>Latest Expenses</h2>
      <div className='grid grid-cols-4 bg-slate-200 p-2 mt-3 text-center'>
        <h2 className='font-bold'>Name</h2>
        <h2 className='font-bold'>Amount</h2>
        <h2 className='font-bold'>Date</h2>
        <h2 className='font-bold'>Action</h2>
      </div>
      {expensesList.map((expenses , index)=>
      <div key={index} className='grid grid-cols-4 bg-slate-200 p-2 text-center'>
        <h2>{expenses.name}</h2>
        <h2>{expenses.amount}</h2>
        <h2>{expenses.createdAt}</h2>
        <h2 className='flex items-center justify-center'>
          <Trash 
          onClick={ ()=> deleteExpenses(expenses) }
          className='text-red-600 cursor-pointer' />
        </h2>
      </div>
      
      )}

    </div>
  )
}

export default ExpenseListTable