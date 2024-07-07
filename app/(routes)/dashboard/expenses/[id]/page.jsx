"use client";
import { db } from '@/utils/dbConfig'
import { Budgets } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import { getTableColumns } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import { Expenses } from '@/utils/schema'
import BudgetItem from '../../budgets/_components/BudgetItem'
import AddExpense from '../_components/AddExpense';
import ExpenseListTable from '../_components/ExpenseListTable';
import { Button } from '@/components/ui/button';
import { PenBox, Trash } from 'lucide-react';


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import EditBudget from '../_components/EditBudget';



function ExpensesScreen({ params }) {
  const { user } = useUser();
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [expensesList, setExpensesList] = useState([]);
  const route = useRouter();


  const getBudgetInfo = async () => {
    try {
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
          totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .where(eq(Budgets.id, params.id))
        .groupBy(Budgets.id);

      if (result.length > 0) {
        setBudgetInfo(result[0]); // Assuming the result is an array and we want the first item
      }

      // Call to get expenses list after setting budgetInfo
      getExpensesList();

    } catch (error) {
      console.error("Error fetching budget info:", error);
      setBudgetInfo(null); // Handle error by resetting state
    }
  }

  const getExpensesList = async () => {
    try {
      const result = await db
        .select()
        .from(Expenses)
        .where(eq(Expenses.budgetId, params.id))
        .orderBy(desc(Expenses.id));

      console.log('Expenses List Result:', result);
      setExpensesList(result);
    } catch (error) {
      console.error("Error fetching expenses list:", error);
    }
  }

  useEffect(() => {
    if (user && params.id) {
      getBudgetInfo();
    }
  }, [user, params.id]);

  const deleteBudget = async() => {

    const deleteExpensesResult = await db.delete(Expenses)
    .where(eq(Expenses.budgetId , params.id))
    .returning();

    if(deleteExpensesResult){
      const result = await db.delete(Budgets)
      .where(eq(Budgets.id , params.id))
      .returning();
    }
    route.replace('/dashboard/budgets')
    toast("Budget deleted");


    
  }

  return (
    <div className='p-10'>
      <h2 className='text-2xl font-bold flex justify-between items-center'>My Expenses
      <div className='flex gap-2 items-center'>
        {budgetInfo && <EditBudget budgetInfo={budgetInfo} refreshData={ () => getBudgetInfo()} />}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="flex gap-2"
              variant="destructive">
              <Trash />Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your current budget along with expenses.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={ ()=> {deleteBudget()}} >Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>

        


      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 mt-5'>
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'></div>
        )}
        <AddExpense budgetId={params.id} user={user} refreshData={getBudgetInfo} />
      </div>
      <div className='mt-4'>
        
        {console.log('Expenses List State:', expensesList)}
        <ExpenseListTable expensesList={expensesList} refreshData={() => getBudgetInfo()} />
      </div>
    </div>
  )
}

export default ExpensesScreen;
