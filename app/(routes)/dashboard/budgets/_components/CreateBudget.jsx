'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
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
import EmojiPicker from 'emoji-picker-react'
import { Input } from '@/components/ui/input'
import { Budgets } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { db } from '@/utils/dbConfig'


function CreateBudget({refreshData}) {

  const [emoji, setEmoji] = useState('😊');
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [name, setName] = useState();
  const [amount, setAmount] = useState();
  const { user } = useUser();

  const onCreateBudget = async () => {
    const result = await db.insert(Budgets)
      .values({
        name: name,
        amount: amount,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        icon: emoji,
      }).returning({ insertedId: Budgets.id })

    if (result) {
      refreshData();
      toast("New Budget Created!")
    }
  }

  return (
    <div>

      <Dialog>
        <DialogTrigger asChild>
          <div className='bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md'>
            <h2 className='text-3xl'>+</h2>
            <h2>Create New Budget</h2>
          </div>

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
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className='mt-3'>
                  <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                  <Input placeholder="e.g. 5000Rs."
                    type="number"
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
                onClick={() => onCreateBudget()}
                className="mt-5 w-full">Create Budget</Button>
             
            </DialogClose>

          </DialogFooter>
        </DialogContent>
      </Dialog>



    </div>
  )
}

export default CreateBudget