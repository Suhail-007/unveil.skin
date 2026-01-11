'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  Flex,
  Badge,
  Spinner,
  Card,
  IconButton,
  Portal,
  Image,
} from '@chakra-ui/react';
import { Package, Truck, CheckCircle, Clock, X, Search, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import { useAppSelector } from '@/lib/redux/hooks';
import { toaster } from '@/components/ui/toaster';
import { formatter } from '../../../lib/utils';
import { useFeatureFlags } from '@/lib/features/FeatureFlagsContext';

// Define payment status enum locally to avoid importing server-side code
enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUND = 'refund',
}

// Define order status enum locally
enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: string;
  product?: {
    name: string;
    image?: string;
    imageUrl?: string;
    images?: Array<{ url: string }>;
  };
}

interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

interface ExtendedOrder {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus | string;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  paymentMethod?: string;
  paymentStatus?: PaymentStatus | string;
  shippingAddress?: ShippingAddress;
  created_at: Date | string;
  updated_at: Date | string;
  orderItems?: OrderItem[];
}

export default function OrdersPageContent() {
  const { flags } = useFeatureFlags();
  const router = useRouter();
  const { isGuest, loading: authLoading } = useAppSelector(state => state.auth);
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ExtendedOrder | null>(null);

  useEffect(() => {
    if (!authLoading && isGuest) {
      router.push('/login');
    }
  }, [isGuest, authLoading, router]);

  useEffect(() => {
    if (!isGuest && !authLoading) {
      fetchOrders();
    }
  }, [isGuest, authLoading]);

  // Debounced search effect
  useEffect(() => {
    if (isGuest || authLoading) return;

    const timer = setTimeout(() => {
      searchOrders();
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm, selectedStatus, isGuest, authLoading]);

  // Close bottom sheet on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedOrder) {
        setSelectedOrder(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedOrder]);

  // Prevent body scroll when bottom sheet is open
  useEffect(() => {
    if (selectedOrder) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedOrder]);

  // Check if orders feature is enabled
  if (!flags.enableOrders) {
    return (
      <Box
        minH='100vh'
        display='flex'
        alignItems='center'
        justifyContent='center'
        className='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
        <VStack gap={4}>
          <Heading size='lg' className='text-white'>
            Orders Unavailable
          </Heading>
          <Text className='text-gray-400'>The orders feature is currently disabled.</Text>
        </VStack>
      </Box>
    );
  }

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }

      setOrders(data.orders || []);
    } catch (error) {
      toaster.create({
        title: 'Error loading orders',
        description: error instanceof Error ? error.message : 'Unknown error',
        type: 'error',
      });
    } finally {
      setLoadingOrders(false);
    }
  };

  const searchOrders = async () => {
    if (!searchTerm && selectedStatus === 'all') {
      // If no search term and showing all, use regular fetch
      fetchOrders();
      return;
    }

    try {
      setLoadingOrders(true);
      const params = new URLSearchParams();

      if (searchTerm) {
        params.append('query', searchTerm);
      }

      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }

      const res = await fetch(`/api/orders/search?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to search orders');
      }

      setOrders(data.orders || []);
    } catch (error) {
      toaster.create({
        title: 'Error searching orders',
        description: error instanceof Error ? error.message : 'Unknown error',
        type: 'error',
      });
    } finally {
      setLoadingOrders(false);
    }
  };

  const statusConfig = {
    all: { label: 'All Orders', color: 'text-gray-600', bg: 'bg-gray-100', icon: Package },
    pending: { label: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock },
    processing: { label: 'Processing', color: 'text-blue-600', bg: 'bg-blue-100', icon: Clock },
    shipped: { label: 'Shipped', color: 'text-purple-600', bg: 'bg-purple-100', icon: Truck },
    delivered: { label: 'Delivered', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-100', icon: X },
  };

  // No need for client-side filtering now since API handles it
  const filteredOrders = orders;

  const StatusIcon = ({ status }: { status: string }) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || Clock;
    return <Icon size={20} />;
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: string | number) => {
    return formatter.currency(amount);
  };

  if (isGuest) {
    return null;
  }

  if (loadingOrders) {
    return (
      <Box
        minH='100vh'
        bgGradient='linear(to-br, gray.900, gray.800)'
        display='flex'
        alignItems='center'
        justifyContent='center'>
        <VStack gap={4}>
          <Spinner size='xl' color='blue.400' borderWidth='4px' />
          <Text color='gray.300'>Loading your orders...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH='100vh' bgGradient='linear(to-br, gray.900, gray.800)' p={{ base: 4, md: 8 }}>
      <Container maxW='6xl'>
        {/* Header */}
        <Box mb={8} animation='fadeIn 0.5s ease-out'>
          <Heading as='h1' size='3xl' color='white' mb={2}>
            My Orders
          </Heading>
          <Text color='gray.300'>Track and manage your orders</Text>
        </Box>

        {/* Search and Filter Bar */}
        <Card.Root
          mb={6}
          animation='slideDown 0.5s ease-out'
          bg='gray.800'
          borderRadius='2xl'
          shadow='xl'
          borderWidth='1px'
          borderColor='gray.700'>
          <Card.Body p={4}>
            <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
              {/* Search Input */}
              <Box flex={1} position='relative'>
                <Box
                  position='absolute'
                  left='3'
                  top='50%'
                  transform='translateY(-50%)'
                  color='gray.500'
                  pointerEvents='none'
                  zIndex={2}>
                  <Search size={20} />
                </Box>
                <Input
                  pl='10'
                  pr='4'
                  py='3'
                  placeholder='Search by order number...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  borderRadius='xl'
                  bg='gray.900'
                  color='white'
                  borderColor='gray.700'
                  focusRingColor='blue.400'
                  _placeholder={{ color: 'gray.500' }}
                  _focus={{
                    borderColor: 'transparent',
                    boxShadow: '0 0 0 2px var(--chakra-colors-blue-400)',
                  }}
                />
              </Box>

              {/* Status Filter Dropdown */}
              <Box minW='200px'>
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--chakra-colors-gray-900)',
                    color: 'white',
                    border: '1px solid var(--chakra-colors-gray-700)',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  onFocus={e => {
                    e.target.style.boxShadow = '0 0 0 2px var(--chakra-colors-blue-400)';
                    e.target.style.borderColor = 'transparent';
                  }}
                  onBlur={e => {
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = 'var(--chakra-colors-gray-700)';
                  }}>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </Box>
            </Flex>
          </Card.Body>
        </Card.Root>

        {/* Orders List */}
        <VStack gap={4} align='stretch'>
          {filteredOrders.map((order, index) => (
            <Card.Root
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              bg='gray.800'
              borderRadius='2xl'
              shadow='xl'
              borderWidth='1px'
              borderColor='gray.700'
              overflow='hidden'
              transition='all 0.3s'
              _hover={{ shadow: '2xl', borderColor: 'gray.600' }}
              cursor='pointer'
              animation={`slideUp 0.5s ease-out ${index * 0.1}s both`}>
              <Card.Body p={6}>
                <Flex justify='space-between' mb={4}>
                  <Flex gap={4} flex={1}>
                    <Box
                      p={3}
                      borderRadius='xl'
                      bg={statusConfig[order.status as keyof typeof statusConfig]?.bg || 'gray.700'}
                      transition='transform 0.3s'
                      _hover={{ transform: 'scale(1.1)' }}>
                      <StatusIcon status={order.status} />
                    </Box>
                    <Box flex={1}>
                      <Heading as='h3' size='lg' color='white' mb={1}>
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </Heading>
                      <Text fontSize='sm' color='gray.400'>
                        {formatDate(order.created_at)}
                      </Text>
                      <Flex gap={2} mt={2}>
                        <Badge
                          px={2}
                          py={1}
                          borderRadius='full'
                          fontSize='xs'
                          fontWeight='medium'
                          colorPalette={
                            order.paymentStatus === PaymentStatus.PAID
                              ? 'green'
                              : order.paymentStatus === 'failed'
                              ? 'red'
                              : 'yellow'
                          }>
                          Payment:{' '}
                          {formatter.capitalize<PaymentStatus>(
                            (order.paymentStatus as PaymentStatus) || PaymentStatus.PENDING
                          )}
                        </Badge>
                      </Flex>
                    </Box>
                  </Flex>
                  <Flex gap={3}>
                    <Box textAlign='right'>
                      <Text fontWeight='bold' fontSize='xl' color='white'>
                        {formatCurrency(order.totalAmount?.toString() || '0')}
                      </Text>
                      <Flex
                        align='center'
                        gap={1}
                        px={3}
                        py={1}
                        borderRadius='full'
                        fontSize='xs'
                        fontWeight='medium'
                        bg={statusConfig[order.status as keyof typeof statusConfig]?.bg || 'gray.700'}
                        color={statusConfig[order.status as keyof typeof statusConfig]?.color || 'gray.300'}
                        mt={2}>
                        <StatusIcon status={order.status} />
                        <Text>{statusConfig[order.status as keyof typeof statusConfig]?.label || order.status}</Text>
                      </Flex>
                    </Box>
                    <ChevronRight size={20} color='gray.500' style={{ marginTop: '4px' }} />
                  </Flex>
                </Flex>

                <Flex justify='space-between'>
                  <Text fontSize='sm' color='gray.400'>
                    {order.orderItems?.length || 0} {order.orderItems?.length === 1 ? 'item' : 'items'}
                  </Text>
                </Flex>
              </Card.Body>
            </Card.Root>
          ))}
        </VStack>

        {filteredOrders.length === 0 && (
          <Box textAlign='center' py={16} animation='fadeIn 0.5s'>
            <Package size={64} style={{ margin: '0 auto 16px', color: 'var(--chakra-colors-gray-600)' }} />
            <Heading as='h3' size='xl' color='gray.300' mb={2}>
              No orders found
            </Heading>
            <Text color='gray.400'>Try adjusting your search or filters</Text>
          </Box>
        )}
      </Container>

      {/* Bottom Sheet Overlay */}
      {selectedOrder && (
        <Portal>
          <Box
            position='fixed'
            inset='0'
            bg='blackAlpha.500'
            transition='opacity 0.3s'
            zIndex={40}
            onClick={() => setSelectedOrder(null)}
          />

          {/* Bottom Sheet */}
          <Box
            position='fixed'
            insetX='0'
            bottom='0'
            zIndex={50}
            transition='transform 0.3s ease-out'
            transform={selectedOrder ? 'translateY(0)' : 'translateY(100%)'}
            animation='slideUpSheet 0.3s ease-out'>
            <Box bg='gray.800' borderTopRadius='3xl' shadow='2xl' maxH='85vh' overflowY='auto'>
              {/* Handle */}
              <Box
                position='sticky'
                top='0'
                bg='gray.800'
                pt={4}
                pb={2}
                px={6}
                borderBottom='1px'
                borderColor='gray.700'
                zIndex={10}>
                <Box w='12' h='1.5' bg='gray.600' borderRadius='full' mx='auto' mb={4} />
                <Flex justify='space-between' align='start'>
                  <Box>
                    <Heading as='h2' size='2xl' color='white'>
                      Order #{selectedOrder.id.slice(0, 8).toUpperCase()}
                    </Heading>
                    <Text fontSize='sm' color='gray.400' mt={1}>
                      {formatDate(selectedOrder.created_at)}
                    </Text>
                  </Box>
                  <IconButton
                    onClick={() => setSelectedOrder(null)}
                    aria-label='Close'
                    variant='ghost'
                    size='sm'
                    borderRadius='full'
                    _hover={{ bg: 'gray.700' }}>
                    <X size={24} style={{ color: 'var(--chakra-colors-gray-400)' }} />
                  </IconButton>
                </Flex>
              </Box>

              <VStack gap={6} p={6} align='stretch'>
                {/* Status and Payment */}
                <Flex gap={3}>
                  <Box
                    flex={1}
                    bgGradient='linear(to-br, blue.50, blue.100)'
                    border='1px'
                    borderColor='blue.200'
                    borderRadius='xl'
                    p={4}>
                    <Text fontSize='xs' fontWeight='medium' color='blue.600' mb={1}>
                      Order Status
                    </Text>
                    <Flex align='center' gap={2}>
                      <StatusIcon status={selectedOrder.status} />
                      <Text fontWeight='bold' color='blue.900'>
                        {statusConfig[selectedOrder.status as keyof typeof statusConfig]?.label || selectedOrder.status}
                      </Text>
                    </Flex>
                  </Box>
                  <Box
                    flex={1}
                    bgGradient='linear(to-br, green.50, green.100)'
                    border='1px'
                    borderColor='green.200'
                    borderRadius='xl'
                    p={4}>
                    <Text fontSize='xs' fontWeight='medium' color='green.600' mb={1}>
                      Payment
                    </Text>
                    <Text fontWeight='bold' color='green.900' textTransform='capitalize'>
                      {selectedOrder.paymentStatus || 'pending'}
                    </Text>
                  </Box>
                </Flex>

                {/* Order Items */}
                <Box>
                  <Heading as='h3' size='md' color='white' mb={3}>
                    <Flex align='center' gap={2}>
                      <Package size={20} />
                      <Text>Order Items</Text>
                    </Flex>
                  </Heading>
                  <VStack gap={3} align='stretch'>
                    {selectedOrder.orderItems?.map(item => (
                      <Flex
                        key={item.id}
                        gap={4}
                        align='center'
                        p={4}
                        bg='gray.900'
                        borderRadius='xl'
                        borderWidth='1px'
                        borderColor='gray.700'
                        _hover={{ bg: 'gray.700', borderColor: 'gray.600' }}
                        transition='all 0.2s'>
                        {item.product?.images && (
                          <Image
                            src={item.product?.images[0].url}
                            alt={item.product?.name}
                            w='20'
                            h='20'
                            objectFit='cover'
                            borderRadius='lg'
                            shadow='md'
                          />
                        )}
                        <Box flex={1}>
                          <Text fontWeight='semibold' color='white'>
                            {item.product?.name || 'Product'}
                          </Text>
                          <Text fontSize='sm' color='gray.400' mt={1}>
                            Quantity: {item.quantity}
                          </Text>
                        </Box>
                        <Text fontWeight='bold' fontSize='lg' color='white'>
                          {formatCurrency(item.price)}
                        </Text>
                      </Flex>
                    ))}
                  </VStack>
                </Box>

                {/* Payment Details */}
                {selectedOrder.razorpayOrderId && (
                  <Box
                    bgGradient='linear(to-br, purple.50, purple.100)'
                    border='1px'
                    borderColor='purple.200'
                    borderRadius='xl'
                    p={5}>
                    <Flex align='center' gap={2} mb={3}>
                      <CreditCard size={20} color='purple.600' />
                      <Heading as='h3' size='md' color='purple.900'>
                        Payment Details
                      </Heading>
                    </Flex>
                    <VStack gap={2} align='stretch' fontSize='sm'>
                      <Flex justify='space-between'>
                        <Text color='purple.700'>Method:</Text>
                        <Text fontWeight='medium' color='purple.900' textTransform='capitalize'>
                          {selectedOrder.paymentMethod || 'razorpay'}
                        </Text>
                      </Flex>
                      <Flex justify='space-between'>
                        <Text color='purple.700'>Order ID:</Text>
                        <Text fontFamily='mono' fontSize='xs' color='purple.900'>
                          {selectedOrder.razorpayOrderId}
                        </Text>
                      </Flex>
                      {selectedOrder.razorpayPaymentId && (
                        <Flex justify='space-between'>
                          <Text color='purple.700'>Payment ID:</Text>
                          <Text fontFamily='mono' fontSize='xs' color='purple.900'>
                            {selectedOrder.razorpayPaymentId}
                          </Text>
                        </Flex>
                      )}
                    </VStack>
                  </Box>
                )}

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <Box
                    bgGradient='linear(to-br, orange.50, orange.100)'
                    border='1px'
                    borderColor='orange.200'
                    borderRadius='xl'
                    p={5}>
                    <Flex align='center' gap={2} mb={3}>
                      <MapPin size={20} color='orange.600' />
                      <Heading as='h3' size='md' color='orange.900'>
                        Shipping Address
                      </Heading>
                    </Flex>
                    <VStack align='start' fontSize='sm' color='orange.800' gap={1}>
                      <Text fontWeight='semibold' color='orange.900'>
                        {selectedOrder.shippingAddress.name}
                      </Text>
                      <Text mt={2}>{selectedOrder.shippingAddress.street}</Text>
                      <Text>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                      </Text>
                      <Text>{selectedOrder.shippingAddress.pincode}</Text>
                      <Text mt={2} fontWeight='medium'>
                        {selectedOrder.shippingAddress.phone}
                      </Text>
                    </VStack>
                  </Box>
                )}

                {/* Total */}
                <Box bg='gray.900' borderRadius='xl' p={5} borderWidth='2px' borderColor='blue.500'>
                  <Flex justify='space-between' align='center'>
                    <Text color='gray.300' fontWeight='medium'>
                      Total Amount
                    </Text>
                    <Text fontSize='3xl' fontWeight='bold' color='white'>
                      {formatCurrency(selectedOrder.totalAmount?.toString() || '0')}
                    </Text>
                  </Flex>
                </Box>

                {/* Action Buttons */}
                <Flex gap={3} pt={2}>
                  <Button
                    flex={1}
                    px={6}
                    py={4}
                    bg='blue.500'
                    color='white'
                    borderRadius='xl'
                    fontWeight='semibold'
                    transition='all 0.3s'
                    _hover={{
                      bg: 'blue.600',
                      shadow: 'lg',
                      transform: 'translateY(-2px)',
                    }}
                    _active={{ transform: 'scale(0.95)' }}
                    onClick={() => console.log('Track order:', selectedOrder.id)}>
                    Track Order
                  </Button>
                  {selectedOrder.status === 'delivered' && (
                    <Button
                      flex={1}
                      px={6}
                      py={4}
                      bg='gray.700'
                      color='white'
                      borderRadius='xl'
                      fontWeight='semibold'
                      transition='all 0.3s'
                      _hover={{
                        bg: 'gray.600',
                        shadow: 'lg',
                        transform: 'translateY(-2px)',
                      }}
                      _active={{ transform: 'scale(0.95)' }}
                      onClick={() => console.log('Reorder:', selectedOrder.id)}>
                      Reorder
                    </Button>
                  )}
                </Flex>
              </VStack>
            </Box>
          </Box>
        </Portal>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUpSheet {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
}
