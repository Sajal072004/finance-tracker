"use client";
import React, { useEffect, useState } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import CardsInfo from './_components/CardsInfo';
import { db } from '@/utils/dbConfig';
import { desc, eq } from 'drizzle-orm';
import { getTableColumns } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { Budgets } from '@/utils/schema';
import { Expenses } from '@/utils/schema';
import BarChartDashboard from './_components/BarChartDashboard';
import BudgetItem from './budgets/_components/BudgetItem';
import ExpenseListTable from './expenses/_components/ExpenseListTable';

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
      id:Expenses.id,
      name:Expenses.name,
      amount:Expenses.amount,
      createdAt : Expenses.createdAt
    }).from(Budgets)
    .rightJoin(Expenses , eq(Budgets.id , Expenses.budgetId ))
    .where(eq(Budgets.createdBy , user?.primaryEmailAddress.emailAddress))
    .orderBy(desc(Expenses.id));
    setExpensesList(result);

    
  }

  return (
    <div className='p-8'>
      <h2 className='font-bold text-3xl'>Hi, {user?.fullName} ✌️</h2>
      <p className='text-gray-500'>Here's what's happening with your money. Let's manage your expenses.</p>
      
      <CardsInfo budgetList={budgetList} />
      <div className='grid grid-cols-1 md:grid-cols-3 mt-6 gap-5'>
        <div className='md:col-span-2'>
          <BarChartDashboard
          budgetList={budgetList}
          />

          <ExpenseListTable
          expensesList={expensesList}
          refreshData={()=>getBudgetList()}
          />


        </div>
        <div className='grid gap-5'>
          <h2 className='font-bold textl-lg'>Latest Budgets</h2>
          {
          
           budgetList.map( (budget,index) => {
            return <BudgetItem budget={budget} key={index} />
          })
          }
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
