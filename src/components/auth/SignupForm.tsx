'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Input, Stack, Text } from '@chakra-ui/react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setSession } from '@/lib/redux/slices/authSlice';
import { signup } from '@/lib/services/auth.service';

interface SignupFormProps {
  onSuccess?: () => void;
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const data = await signup({ email, password, name });

      // Check if email verification is required
      if (data.requiresEmailConfirmation) {
        setSuccessMessage("Please check your email to verify your account. We've sent you a confirmation link.");
        // Clear form
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        // Update Redux with session (auto-confirmed)
        dispatch(setSession({ user: data.user, session: data.session }));

        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box as='form' onSubmit={handleSubmit}>
      <Stack gap={4}>
        {successMessage && (
          <Box px={4} py={3} borderRadius='md' className='bg-green-50 dark:bg-green-900/20'>
            <Text fontSize='sm' className='text-green-600 dark:text-green-400'>
              {successMessage}
            </Text>
          </Box>
        )}{' '}
        {error && (
          <Box px={4} py={3} borderRadius='md' className='bg-red-50 dark:bg-red-900/20'>
            <Text fontSize='sm' className='text-red-600 dark:text-red-400'>
              {error}
            </Text>
          </Box>
        )}
        <Box>
          <Text fontSize='sm' fontWeight='medium' mb={2} className='text-black dark:text-white'>
            Name
          </Text>
          <Input
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Your name'
            disabled={loading}
          />
        </Box>
        <Box>
          <Text fontSize='sm' fontWeight='medium' mb={2} className='text-black dark:text-white'>
            Email
          </Text>
          <Input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='your@email.com'
            required
            disabled={loading}
          />
        </Box>
        <Box>
          <Text fontSize='sm' fontWeight='medium' mb={2} className='text-black dark:text-white'>
            Password
          </Text>
          <Input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder='••••••••'
            required
            disabled={loading}
          />
        </Box>
        <Box>
          <Text fontSize='sm' fontWeight='medium' mb={2} className='text-black dark:text-white'>
            Confirm Password
          </Text>
          <Input
            type='password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder='••••••••'
            required
            disabled={loading}
          />
        </Box>
        <Button
          type='submit'
          disabled={loading}
          loading={loading}
          className='bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200'>
          {loading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </Stack>
    </Box>
  );
}
