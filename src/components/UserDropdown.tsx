'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Box, Text, HStack, VStack } from '@chakra-ui/react';
import { User, Package, ShoppingCart, LogOut, ChevronDown } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { useColorModeValue } from '@/components/ui/color-mode';

interface UserDropdownProps {
  userName: string;
  userEmail?: string;
  onLogout: () => void;
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'danger';
}

function MenuItem({ icon, label, href, onClick, variant = 'default' }: MenuItemProps) {
  const bgHover = useColorModeValue(
    variant === 'danger' ? 'red.50' : 'gray.100',
    variant === 'danger' ? 'red.900/20' : 'gray.700'
  );
  const textColor = useColorModeValue(
    variant === 'danger' ? 'red.600' : 'gray.900',
    variant === 'danger' ? 'red.400' : 'gray.100'
  );
  const iconColor = useColorModeValue(
    variant === 'danger' ? 'red.500' : 'gray.600',
    variant === 'danger' ? 'red.400' : 'gray.400'
  );

  const content = (
    <>
      <Box color={iconColor} transition="color 0.15s">
        {icon}
      </Box>
      <Text>{label}</Text>
    </>
  );

  const commonProps = {
    w: 'full',
    px: 3,
    py: 2.5,
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    fontSize: 'sm',
    fontWeight: 'medium',
    color: textColor,
    bg: 'transparent',
    borderRadius: 'lg',
    cursor: 'pointer',
    transition: 'all 0.15s',
    _hover: {
      bg: bgHover,
    },
  };

  if (href) {
    return (
      <Box as={Link} href={href} {...commonProps} textDecoration="none">
        {content}
      </Box>
    );
  }

  return (
    <Box as="button" onClick={onClick} {...commonProps}>
      {content}
    </Box>
  );
}

export default function UserDropdown({ userName, userEmail, onLogout }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.900');
  const textPrimary = useColorModeValue('gray.900', 'gray.100');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const separatorBg = useColorModeValue('gray.200', 'gray.700');
  const triggerBg = useColorModeValue('gray.100', 'gray.900');
  const triggerBorderColor = useColorModeValue('gray.200', 'gray.800');
  const chevronColor = useColorModeValue('#71717a', '#a1a1aa');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <Box position="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <Box
        as="button"
        display="flex"
        alignItems="center"
        gap={2}
        px={3}
        py={2}
        borderRadius="lg"
        bg="transparent"
        border="1px solid transparent"
        cursor="pointer"
        transition="all 0.2s"
        _hover={{
          bg: triggerBg,
          borderColor: triggerBorderColor,
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Avatar size="sm" name={userName} />
        <Text
          fontSize="sm"
          fontWeight="medium"
          display={{ base: 'none', md: 'block' }}
        >
          {userName}
        </Text>
        <Box display={{ base: 'none', md: 'block' }} color={chevronColor}>
          <ChevronDown
            size={16}
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          />
        </Box>
      </Box>

      {/* Dropdown Menu */}
      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 8px)"
          right={0}
          w="224px"
          bg={bgColor}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="xl"
          boxShadow="lg"
          overflow="hidden"
          zIndex={50}
          animation="fadeIn 0.15s ease-out"
          css={{
            '@keyframes fadeIn': {
              from: {
                opacity: 0,
                transform: 'scale(0.95) translateY(-8px)',
              },
              to: {
                opacity: 1,
                transform: 'scale(1) translateY(0)',
              },
            },
          }}
        >
          {/* User Info Header */}
          <Box px={3} py={2} bg={headerBg} borderBottom="1px solid" borderColor={borderColor}>
            <Text
              fontSize="sm"
              fontWeight="medium"
              color={textPrimary}
              mb={userEmail ? 0.5 : 0}
            >
              {userName}
            </Text>
            {userEmail && (
              <Text
                fontSize="xs"
                color={textSecondary}
                truncate
                title={userEmail}
              >
                {userEmail}
              </Text>
            )}
          </Box>

          {/* Menu Items */}
          <Box py={1.5} px={1.5}>
            <Box onClick={handleMenuItemClick}>
              <MenuItem
                icon={<User size={16} />}
                label="My Profile"
                href="/profile"
              />
            </Box>
            <Box onClick={handleMenuItemClick}>
              <MenuItem
                icon={<Package size={16} />}
                label="My Orders"
                href="/orders"
              />
            </Box>
            <Box onClick={handleMenuItemClick}>
              <MenuItem
                icon={<ShoppingCart size={16} />}
                label="View Cart"
                href="/cart"
              />
            </Box>

            {/* Separator */}
            <Box h="1px" bg={separatorBg} my={1.5} mx={1} />

            <MenuItem
              icon={<LogOut size={16} />}
              label="Logout"
              onClick={handleLogoutClick}
              variant="danger"
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
