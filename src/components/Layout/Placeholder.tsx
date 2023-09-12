import { Box, BoxProps } from '@chakra-ui/react'

export const Placeholder = (props: BoxProps) => {
  return <Box role="presentation" py="3" px="8" color="on-accent" {...props} />
}
