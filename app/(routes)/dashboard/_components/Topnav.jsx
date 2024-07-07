"use client";
import { UserButton } from '@clerk/nextjs';
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from 'lucide-react';
import Image from 'next/image'; // Ensure correct import
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

function Topnav() {
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
  ];

  const params = usePathname();

  return (
    <div className='p-3 mt-0 flex items-center justify-between z-10'>

      {/* Navigation Links */}
      <div className='flex flex-grow overflow-x-auto space-x-2 sm:space-x-4'>
        {menuList.map((menu) => (
          <Link
            key={menu.id}
            href={menu.path}
            className={`flex items-center text-gray-500 font-medium mx-2 sm:mx-4 p-2 cursor-pointer rounded-md hover:text-primary hover:bg-blue-100 ${
              params === menu.path ? 'text-primary bg-blue-100' : ''
            }`}
          >
            <menu.icon className='mr-2' />
            <span className='hidden sm:inline'>{menu.name}</span> {/* Hide text on small screens */}
          </Link>
        ))}
      </div>

    </div>
  );
}

export default Topnav;
