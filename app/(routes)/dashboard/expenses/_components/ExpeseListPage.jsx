"use client";
import React, { useEffect, useState } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import { db } from '@/utils/dbConfig';
import { desc, eq } from 'drizzle-orm';
import { Expenses } from '@/utils/schema';
import ExpenseListTable from './ExpenseListTable';
function ExpenseListPage() {
  const { user } = useUser();
  const [expensesList, setExpensesList] = useState([]);

  const getAllExpenses = async () => {
    if (!user) return; // Ensure user is available before fetching data

    try {
      const result = await db.select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt
      }).from(Expenses)
      .where(eq(Expenses.createdBy, user.primaryEmailAddress?.emailAddress))
      .orderBy(desc(Expenses.id));

      setExpensesList(result);
    } catch (error) {
      console.error("Error fetching expenses list:", error);
    }
  };

  useEffect(() => {
    if (user) {
      getAllExpenses();
    }
  }, [user]); // Include user as a dependency

  return (
    <div className='p-8'>
      <h2 className='font-bold text-3xl'>Your Expenses</h2>
      <ExpenseListTable
        expensesList={expensesList}
        refreshData={() => getAllExpenses()}
      />
    </div>
  );
}

export default ExpenseListPage;
