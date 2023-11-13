import {Skeleton, Stack} from "@chakra-ui/react";

interface Props {
  quantity?: number
}

export const LoadingPage = ({quantity}: Props) => {
  return (<Stack>
    {
      [...Array(quantity && quantity > 0 ? quantity : 6)].map((_, index) => (
        <Skeleton
          key={index}
          height={"100px"}
          my={2}
        />
      ))
    }
  </Stack>)
}