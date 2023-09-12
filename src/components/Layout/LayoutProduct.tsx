import {Flex, FlexProps} from '@chakra-ui/react'
import {Placeholder} from "@/components/Layout/Placeholder";
import {Navbar} from "@/components/Layout/Navbar";
import {Footer} from "@/components/Layout/Footer";

interface Props extends FlexProps {
}

export const LayoutProduct = (props: Props) => {
  const {children} = props

  return (
    <>
      <Flex direction="column" flex="1">
        <Navbar/>
        <Flex
          direction={{base: "column", md: "row"}}
        >

          <Flex
            as="main"
            role="main"
            direction="column"
            flex="1"
            w={{base: "100%", md: "50%"}}
            px={{base: 4, md: 8}}
            {...props}
          >
            <Placeholder bg="bg-accent" minH="xl">
              {children}
            </Placeholder>
          </Flex>
        </Flex>
        <Footer/>
      </Flex>
    </>
  )
}


