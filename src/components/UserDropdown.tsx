'use client';

import Link from 'next/link';
import { User, Package, ShoppingCart, LogOut, ChevronDown } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserDropdownProps {
  userName: string;
  userEmail?: string;
  onLogout: () => void;
}

export default function UserDropdown({ userName, userEmail, onLogout }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800">
          <Avatar size='sm' name={userName} />
          <span className="text-sm font-medium hidden md:block">
            {userName}
          </span>
          <ChevronDown className="h-4 w-4 text-zinc-500 hidden md:block" />
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        {/* User Info Header */}
        <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {userName}
          </p>
          {userEmail && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {userEmail}
            </p>
          )}
        </div>

        {/* Menu Items */}
        <DropdownMenuItem asChild>
          <Link href='/profile' className="flex items-center gap-2 cursor-pointer">
            <User className="h-4 w-4" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href='/orders' className="flex items-center gap-2 cursor-pointer">
            <Package className="h-4 w-4" />
            <span>My Orders</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href='/cart' className="flex items-center gap-2 cursor-pointer">
            <ShoppingCart className="h-4 w-4" />
            <span>View Cart</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          className="flex items-center gap-2 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
