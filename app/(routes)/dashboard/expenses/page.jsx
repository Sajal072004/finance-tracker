"use client";
import React, { useEffect, useState } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import { db } from '@/utils/dbConfig';
import { desc, eq } from 'drizzle-orm';
import { getTableColumns } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { Budgets } from '@/utils/schema';
import { Expenses } from '@/utils/schema';
import ExpenseListTable from './_components/ExpenseListTable'; // Adjust path if needed

function Dashboard() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);

  const getBudgetList = async () => {
    if (!user) return; // Ensure user is available before fetching data

    try {
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
          totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user.primaryEmailAddress?.emailAddress))
        .groupBy(Budgets.id)
        .orderBy(Budgets.id);

      setBudgetList(result);
      getAllExpenses();
    } catch (error) {
      console.error("Error fetching budget list:", error);
    }
  };

  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user]); // Include user as a dependency

  const getAllExpenses = async () => {
    const result = await db.select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt
    }).from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
  }

  return (
    <div className='p-8'>
      <h2 className='text-3xl font-bold text-center mb-8'>Track All Your Expenses Here</h2>

      <div className='flex justify-center'>
        <div className='w-full max-w-6xl'>
          <ExpenseListTable
            expensesList={expensesList}
            refreshData={() => getBudgetList()}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
