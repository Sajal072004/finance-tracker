"use client";
import { UserButton, useUser } from '@clerk/nextjs';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Topnav from './Topnav';

function DashboardHeader() {
  const { user, isSignedIn } = useUser();

  return (
    <div className='p-5 shadow-sm border-b flex items-center justify-between'>
      <div className='flex-grow flex justify-center'>
        <Topnav />
      </div>
      <div>
        {isSignedIn ? (
          <UserButton />
        ) : (
          <Link href="/sign-in">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default DashboardHeader;
