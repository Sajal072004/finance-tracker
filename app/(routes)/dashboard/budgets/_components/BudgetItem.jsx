import Link from 'next/link'
import React from 'react'

function BudgetItem({ budget }) {

  const calculateProgress = () => {
    const perc = (budget.totalSpend / budget.amount) * 100
    return Math.min(perc.toFixed(2), 100);
  }

  return (

    budget && <Link href={'/dashboard/expenses/' + budget.id} >

      <div className='p-5 border rounded-lg hover:shadow-md cursor-pointer h-[200px]'>


        <div className='flex gap-2 items-center justify-between'>
          <div className='flex gap-2 items-center'>
            <h2 className='text-2xl p-2 px-2 m-3 bg-slate-100 rounded-full'>{budget.icon}</h2>
            <div>
              <h2 className='font-bold'>{budget.name}</h2>
              <h2 className='text-sm text-gray-500'>{budget.totalItem} Item</h2>
            </div>
          </div>
          <h2 className='font-bold text-primary text-lg p-2 mr-5 text-center'>Rs. {budget.amount}</h2>
        </div>

        <div className='mt-5'>
          <div className='flex items-center justify-between mb-3 mx-3'>
            <h2 className='text-xs text-slate-400'>Rs. {budget.totalSpend ? budget.totalSpend : 0} Spent</h2>
            <h2 className='text-xs text-slate-400'>Rs. {budget.amount - (budget.totalSpend || 0)} Remaining</h2>
          </div>
          <div className='w-full bg-slate-300 h-2 rounded-full mt-11'>
            <div
              className={`h-2 rounded-full ${calculateProgress() >= 100 ? 'bg-red-500' : 'bg-primary'}`}
              style={{ width: `${Math.min(calculateProgress(), 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default BudgetItem;
