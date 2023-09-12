import {Image} from '@chakra-ui/react'
import {useRouter} from "next/router";

interface Props {
  w?: string
}

export const Logo = ({w}: Props) => {
  const router = useRouter()
  const handleClick = async () => await router.push(`/`)

  return (
    <Image
      onClick={handleClick}
      _hover={{
        cursor: "pointer",
      }}
      w={w ? `${w}px` : "200px"}
      src="/assets/icons/logo.png"
      alt="logo"
    />
  )
}