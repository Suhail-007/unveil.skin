"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Card,
  Badge,
  Button,
  Table,
} from "@chakra-ui/react";
import { useAppSelector } from "@/lib/redux/hooks";
import { toaster } from "@/components/ui/toaster";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: string;
  product?: {
    name: string;
    image?: string;
  };
}

interface Order {
  id: string;
  total: string;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function OrdersPage() {
  const router = useRouter();
  const { isGuest, loading } = useAppSelector((state) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && isGuest) {
      router.push("/login");
    }
  }, [isGuest, loading, router]);

  useEffect(() => {
    if (!isGuest && !loading) {
      fetchOrders();
    }
  }, [isGuest, loading]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch orders");
      }

      setOrders(data.orders || []);
    } catch (error) {
      toaster.create({
        title: "Error loading orders",
        description: error instanceof Error ? error.message : "Unknown error",
        type: "error",
      });
    } finally {
      setLoadingOrders(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "yellow";
      case "processing":
        return "blue";
      case "shipped":
        return "purple";
      case "delivered":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  if (loading || loadingOrders) {
    return (
      <Container maxW="7xl" py={12}>
        <Text>Loading...</Text>
      </Container>
    );
  }

  if (isGuest) {
    return null;
  }

  return (
    <Container maxW="7xl" py={12}>
      <VStack gap={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="2xl">My Orders</Heading>
          <Button asChild variant="outline">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </HStack>

        {orders.length === 0 ? (
          <Card.Root>
            <Card.Body>
              <VStack gap={4} py={8}>
                <Text fontSize="lg" color="gray.500">
                  You haven&apos;t placed any orders yet
                </Text>
                <Button asChild colorPalette="blue">
                  <Link href="/">Start Shopping</Link>
                </Button>
              </VStack>
            </Card.Body>
          </Card.Root>
        ) : (
          <VStack gap={6} align="stretch">
            {orders.map((order) => (
              <Card.Root key={order.id}>
                <Card.Header>
                  <HStack justify="space-between">
                    <VStack align="start" gap={1}>
                      <Text fontSize="sm" color="gray.500">
                        Order #{order.id.slice(0, 8)}
                      </Text>
                      <Text fontSize="sm">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Text>
                    </VStack>
                    <VStack align="end" gap={1}>
                      <Badge colorPalette={getStatusColor(order.status)}>
                        {order.status.toUpperCase()}
                      </Badge>
                      <Text fontSize="lg" fontWeight="bold">
                        ${parseFloat(order.total).toFixed(2)}
                      </Text>
                    </VStack>
                  </HStack>
                </Card.Header>
                <Card.Body>
                  <Table.Root size="sm">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>Product</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">
                          Quantity
                        </Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="right">
                          Price
                        </Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {order.orderItems.map((item) => (
                        <Table.Row key={item.id}>
                          <Table.Cell>
                            {item.product?.name || "Product"}
                          </Table.Cell>
                          <Table.Cell textAlign="center">
                            {item.quantity}
                          </Table.Cell>
                          <Table.Cell textAlign="right">
                            ${parseFloat(item.price).toFixed(2)}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Card.Body>
              </Card.Root>
            ))}
          </VStack>
        )}
      </VStack>
    </Container>
  );
}
