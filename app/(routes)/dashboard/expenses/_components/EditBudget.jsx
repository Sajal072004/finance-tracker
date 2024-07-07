"use client"
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PenBox } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useUser } from '@clerk/nextjs'
import EmojiPicker from 'emoji-picker-react'
import { Budgets } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'
import { db } from '@/utils/dbConfig'


function EditBudget({budgetInfo , refreshData}) {
  const [emoji, setEmoji] = useState(budgetInfo?.icon);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [name, setName] = useState(budgetInfo?.name);
  const [amount, setAmount] = useState(budgetInfo?.amount);
  const { user } = useUser();

  useEffect( () => {
    setEmoji(budgetInfo?.icon);
    setAmount(budgetInfo.amount);
    setName(budgetInfo.name);
  },[budgetInfo])

  const onUpdateBudget = async () => {
    const result = await db.update(Budgets).set({
      name:name,
      amount:amount,
      icon:emoji,
    }).where(eq(Budgets.id , budgetInfo.id))
    .returning();

    if(result){
      toast("Budget Updated");
      refreshData();
    }
  }

  return (
    <div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className='flex gap-2'> <PenBox /> Edit</Button>

        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
              <div className='mt-5'>
                <Button

                  className="text-lg"
                  variant="outline"
                  onClick={() => setEmojiPicker(!emojiPicker)}
                >
                  {emoji}</Button>

                <div className='absolute z-10'>
                  <EmojiPicker
                    open={emojiPicker}
                    onEmojiClick={(e) => {
                      setEmoji(e.emoji)
                      setEmojiPicker(false)
                    }}
                  />
                </div>

                <div className='mt-3'>
                  <h2 className='text-black font-medium my-1'>Budget Name</h2>
                  <Input placeholder="e.g. Home Decor"
                  defaultValue={budgetInfo.name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className='mt-3'>
                  <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                  <Input placeholder="e.g. 5000Rs."
                    type="number"
                    defaultValue={budgetInfo.amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>




              </div>

            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)}
                onClick={() => onUpdateBudget()}
                className="mt-5 w-full">Create Budget</Button>

            </DialogClose>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EditBudget