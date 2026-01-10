'use client';

import { Switch as ChakraSwitch } from '@chakra-ui/react';
import * as React from 'react';

export type SwitchProps = ChakraSwitch.RootProps;

export const Switch = React.forwardRef<HTMLLabelElement, SwitchProps>(function Switch(props, ref) {
  const { children, ...rest } = props;
  return (
    <ChakraSwitch.Root ref={ref} {...rest}>
      <ChakraSwitch.HiddenInput />
      <ChakraSwitch.Control>
        <ChakraSwitch.Thumb />
      </ChakraSwitch.Control>
      {children && <ChakraSwitch.Label>{children}</ChakraSwitch.Label>}
    </ChakraSwitch.Root>
  );
});
