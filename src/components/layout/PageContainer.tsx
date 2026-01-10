import { Container, type ContainerProps } from "@chakra-ui/react";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const pageContainerVariants = cva("", {
  variants: {
    size: {
      wide: "",
      standard: "",
      narrow: "",
    },
    padded: {
      true: "px-4 md:px-6",
      false: "",
    },
  },
  defaultVariants: {
    size: "wide",
    padded: true,
  },
});

export type PageContainerSize = NonNullable<VariantProps<typeof pageContainerVariants>["size"]>;

export interface PageContainerProps extends Omit<ContainerProps, 'maxW'> {
  children: ReactNode;
  size?: PageContainerSize;
  maxW?: ContainerProps['maxW'];
}

const sizeToMaxW: Record<PageContainerSize, ContainerProps['maxW']> = {
  wide: '9xl',
  standard: '7xl',
  narrow: '4xl',
};

export function PageContainer({
  children,
  size = 'wide',
  maxW,
  px,
  className,
  ...props
}: PageContainerProps) {
  const padded = px == null;

  return (
    <Container
      maxW={maxW ?? sizeToMaxW[size]}
      px={px}
      className={cn(pageContainerVariants({ size, padded }), className)}
      {...props}
    >
      {children}
    </Container>
  );
}
