/**
 * ShippingAddressForm Component
 * 
 * Collects and validates shipping address information
 * Required before placing an order
 */

'use client';

import { useState } from 'react';
import {
  Box,
  Input,
  VStack,
  Heading,
  Text,
  Button,
  Card,
  Flex,
} from '@chakra-ui/react';
import { Field } from '@/components/ui/field';

export interface ShippingAddress extends Record<string, string> {
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

interface ShippingAddressFormProps {
  onSubmit: (address: ShippingAddress) => void;
  initialAddress?: Partial<ShippingAddress>;
}

export default function ShippingAddressForm({
  onSubmit,
  initialAddress = {},
}: ShippingAddressFormProps) {
  const [address, setAddress] = useState<ShippingAddress>({
    name: initialAddress.name || '',
    street: initialAddress.street || '',
    city: initialAddress.city || '',
    state: initialAddress.state || '',
    pincode: initialAddress.pincode || '',
    phone: initialAddress.phone || '',
  });

  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};

    if (!address.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!address.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!address.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!address.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!address.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(address.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    if (!address.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(address.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(address);
    }
  };

  const handleChange = (field: keyof ShippingAddress, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card.Root bg="gray.800" borderRadius="2xl" borderWidth="1px" borderColor="gray.700">
      <Card.Body p={6}>
        <Heading as="h3" size="lg" color="white" mb={4}>
          Shipping Address
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack gap={4} align="stretch">
            <Field label="Full Name" invalid={!!errors.name} errorText={errors.name}>
              <Input
                value={address.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="John Doe"
                bg="gray.900"
                color="white"
                borderColor="gray.700"
                _focus={{ borderColor: 'blue.400' }}
              />
            </Field>

            <Field label="Street Address" invalid={!!errors.street} errorText={errors.street}>
              <Input
                value={address.street}
                onChange={(e) => handleChange('street', e.target.value)}
                placeholder="123 Main Street, Apartment 4B"
                bg="gray.900"
                color="white"
                borderColor="gray.700"
                _focus={{ borderColor: 'blue.400' }}
              />
            </Field>

            <Flex gap={4}>
              <Field label="City" invalid={!!errors.city} errorText={errors.city} flex={1}>
                <Input
                  value={address.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Mumbai"
                  bg="gray.900"
                  color="white"
                  borderColor="gray.700"
                  _focus={{ borderColor: 'blue.400' }}
                />
              </Field>

              <Field label="State" invalid={!!errors.state} errorText={errors.state} flex={1}>
                <Input
                  value={address.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="Maharashtra"
                  bg="gray.900"
                  color="white"
                  borderColor="gray.700"
                  _focus={{ borderColor: 'blue.400' }}
                />
              </Field>
            </Flex>

            <Flex gap={4}>
              <Field label="Pincode" invalid={!!errors.pincode} errorText={errors.pincode} flex={1}>
                <Input
                  value={address.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  placeholder="400001"
                  maxLength={6}
                  bg="gray.900"
                  color="white"
                  borderColor="gray.700"
                  _focus={{ borderColor: 'blue.400' }}
                />
              </Field>

              <Field label="Phone Number" invalid={!!errors.phone} errorText={errors.phone} flex={1}>
                <Input
                  value={address.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="9876543210"
                  maxLength={10}
                  bg="gray.900"
                  color="white"
                  borderColor="gray.700"
                  _focus={{ borderColor: 'blue.400' }}
                />
              </Field>
            </Flex>

            <Button
              type="submit"
              bg="blue.500"
              color="white"
              size="lg"
              mt={2}
              _hover={{ bg: 'blue.600' }}
            >
              Continue to Payment
            </Button>

            <Text fontSize="sm" color="gray.400" textAlign="center">
              All fields are required to process your order
            </Text>
          </VStack>
        </form>
      </Card.Body>
    </Card.Root>
  );
}
