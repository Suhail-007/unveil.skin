'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Box,
  HStack,
  Button,
} from '@chakra-ui/react';
import { PageContainer } from '@/components/layout/PageContainer';
import { useColorModeValue } from '@/components/ui/color-mode';
import UserDropdown from './UserDropdown';
import CartIcon from './cart/CartIcon';
import CartDrawer from './cart/CartDrawer';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setSession, setGuest, clearSession } from '@/lib/redux/slices/authSlice';
import { setCartItems } from '@/lib/redux/slices/cartSlice';
import { getSession, logout } from '@/lib/services/auth.service';
import { getCart } from '@/lib/services/cart.service';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [logoSrc, setLogoSrc] = useState('/Logo_Dark.svg');
  const [cartOpen, setCartOpen] = useState(false);
  const resolvedLogoSrc = useColorModeValue('/Logo_Dark.svg', '/Logo.svg');
  const dispatch = useAppDispatch();

  const router = useRouter();
  const { user, loading, isGuest } = useAppSelector(state => state.auth);

  useEffect(() => {
    setLogoSrc(resolvedLogoSrc);
  }, [resolvedLogoSrc]);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await getSession();

        if (data.session && data.user) {
          dispatch(setSession({ user: data.user, session: data.session }));

          // Load user cart
          try {
            const cartData = await getCart();
            dispatch(setCartItems(cartData.items));
          } catch {
            // Cart fetch failed, ignore
          }
        } else {
          dispatch(setGuest());

          // Load guest cart from localStorage
          if (typeof window !== 'undefined') {
            const guestCart = localStorage.getItem('guestCart');
            if (guestCart) {
              const cartItems = JSON.parse(guestCart);
              dispatch(setCartItems(cartItems));
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch(setGuest());
      }
    };

    initAuth();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearSession());
      dispatch(setCartItems([]));
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  };

  return (
    <>
      <Box
        as='header'
        borderBottom='1px'
        className='border-zinc-200 dark:border-zinc-800'
        position='relative'
        zIndex={50}>
        <PageContainer py={6}>
          <HStack justify='space-between'>
            <Link href='/'>
              <Image
                src={logoSrc}
                alt='unveil.skin'
                width={360}
                height={106}
                priority
                style={{ height: '64px', width: 'auto' }}
                className='h-16 w-auto'
              />
            </Link>

            {!loading && (
              <HStack gap={3}>
                {isGuest ? (
                  <>
                    <Button asChild variant='ghost' size='sm'>
                      <Link href='/login'>Login</Link>
                    </Button>
                    <Button asChild colorPalette='blue' size='sm'>
                      <Link href='/signup'>Sign Up</Link>
                    </Button>
                  </>
                ) : (
                  <UserDropdown
                    userName={getUserDisplayName()}
                    userEmail={user?.email}
                    onLogout={handleLogout}
                  />
                )}
                <CartIcon onClick={() => setCartOpen(true)} />
              </HStack>
            )}
          </HStack>
        </PageContainer>
      </Box>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
