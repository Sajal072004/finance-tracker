import React, { useState } from 'react'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Budgets, Expenses } from '@/utils/schema';
import { db } from '@/utils/dbConfig';
import { toast } from 'sonner';
import moment from 'moment/moment';
import { Loader } from 'lucide-react';

function AddExpense({ budgetId, user, refreshData }) {

  const [name, setName] = useState();
  const [amount, setAmount] = useState();
  const [loading, setLoading] = useState(false);

  const addNewExpense = async () => {
    setLoading(true);
    const result = await db.insert(Expenses).values({
      name: name,
      amount: amount,
      budgetId: budgetId,
      createdAt: moment().format('DD/MM/yyyy')

    }).returning({ insertedId: Budgets.id });

    setAmount('');
    setName('')
    console.log(result);
    if (result) {
      setLoading(false);
      refreshData();
      toast("New Expense Created")
    }
    setLoading(false);
  }


  return (
    <div className='border p-5 rounded-lg' >
      <h2 className='font-bold text-lg'>Add Expense</h2>
      <div className='mt-3'>
        <h2 className='text-black font-medium my-1'>Expense Name</h2>
        <Input
          value={name}
          placeholder="e.g. Home Decor"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className='mt-3'>
        <h2 className='text-black font-medium my-1'>Expense Amount</h2>
        <Input placeholder="e.g. 5000Rs."
          value={amount}
          type="number"
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button
        disabled={!(name && amount)}
        onClick={() => addNewExpense()}
        className="mt-3 w-full">
        {
          loading ?
            <Loader className='animate-spin' /> : "Add New Expense"
        }
      </Button>
    </div>
  )
}

export default AddExpense