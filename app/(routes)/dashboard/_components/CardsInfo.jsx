import { PiggyBank, ReceiptText, Wallet } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function CardsInfo({ budgetList }) {

  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);

  useEffect(() => {
    CalculateCardInfo();
  }, [budgetList])

  const CalculateCardInfo = async () => {
    console.log(budgetList);
    let totalBudget_ = 0;
    let totalSpend_ = 0;
    budgetList.forEach((element) => {
      totalBudget_ += Number(element.amount);
      totalSpend_ += Number(element.totalSpend)
    })
    setTotalBudget(totalBudget_);
    setTotalSpend(totalSpend_);
    console.log(totalBudget_, totalSpend_);
  }


  return (
    <div>
      {budgetList && budgetList.length > 0 ? (
        <div className='mt-7 grid grid-cols-1 md:grid-cols-2 gap-5 lg:grid-cols-3'>
          <div className='p-7 border rounded-lg flex items-center justify-between'>
            <div>
              <h2 className='text-sm'>Total Budget</h2>
              <h2 className='font-bold text-2xl'>Rs. {totalBudget}</h2>
            </div>
            <PiggyBank className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
          </div>

          <div className='p-7 border rounded-lg flex items-center justify-between'>
            <div>
              <h2 className='text-sm'>Total Spend</h2>
              <h2 className='font-bold text-2xl'>Rs. {totalSpend}</h2>
            </div>
            <ReceiptText className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
          </div>

          <div className='p-7 border rounded-lg flex items-center justify-between'>
            <div>
              <h2 className='text-sm'>No. of Budgets</h2>
              <h2 className='font-bold text-2xl'>{budgetList.length}</h2>
            </div>
            <Wallet className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
          </div>
        </div>
      ) : (
        <div className='mt-2 grid grid-cols-1 md:grid-cols-2 gap-5 lg:grid-cols-3'>
          {[1, 2, 3].map((item, index) => (
            <div key={index} className='h-[110px] w-full bg-slate-200 animate-pulse rounded-lg'></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CardsInfo