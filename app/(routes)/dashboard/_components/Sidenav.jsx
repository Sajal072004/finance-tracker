"use client"
import { UserButton } from '@clerk/nextjs'
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function Sidenav() {
  const menuList = [
    {
      id: 1,
      name: 'Dashboard',
      icon: LayoutGrid,
      path: '/dashboard'
    },
    {
      id: 2,
      name: 'Budgets',
      icon: PiggyBank,
      path: '/dashboard/budgets'
    },
    {
      id: 3,
      name: 'Expenses',
      icon: ReceiptText,
      path: '/dashboard/expenses'
    },
    {
      id: 4,
      name: 'About Me',
      icon: ShieldCheck,
      path: '/dashboard/upgrade'
    }
  ]

  const params = usePathname();


  return (
    <div className='h-screen border shadow-sm'>
      <Image
        src={"/logo.png"}
        alt='logo'
        width={160}
        height={100}
        className='mt-[-30px] ml-5'
      />

      <div className='mt-5'>
        {menuList.map((menu, index) => {
          return (
            <Link key={index} href={menu.path}>
              <h2 className={`flex gap-2 items-center text-gray-500 font-medium mb-2 p-5 cursor-pointer rounded-md hover:text-primary hover:bg-blue-100 
          ${params === menu.path && 'text-primary bg-blue-100'}
           `}>
                <menu.icon />
                {menu.name}
              </h2>
            </Link>
          )
        })}
      </div>
      <div className='fixed bottom-10 p-5 flex gap-2 items-center'>
        <UserButton />
        Profile
      </div>
    </div>
  )
}

export default Sidenav