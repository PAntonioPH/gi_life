import {Flex, Button, Box, Heading} from "@chakra-ui/react";
import {useState} from "react";

interface Props {
  total: number
  currentPage: number
  setCurrentPage: (page: number) => void
}

export const Pagination = ({total, setCurrentPage, currentPage}: Props) => {
  const pages = Array.from(Array(total).keys())
  const limit = 5
  const [pagesToShow, setPagesToShow] = useState<number[]>(pages.slice(0, limit))

  const handlePagesToShow = (page: number) => {
    setCurrentPage(page + 1)

    if (page + 1 === pagesToShow[pagesToShow.length] && page + 1 !== total) {
      setPagesToShow(pages.slice(page - 3, page + 2))
    } else if (page + 1 === pagesToShow[0] && page !== 0) {
      setPagesToShow(pages.slice(page - limit + 1, page + 1))
    } else if (page + 1 === total) {
      setPagesToShow(pages.slice(total - limit, total))
    } else if (page === 0) {
      setPagesToShow(pages.slice(0, limit))
    } else if (page + 1 === pagesToShow[pagesToShow.length - 2] && page + 3 === total) {
      setPagesToShow(pages.slice(page - 2, page + 4))
    } else if (page + 1 === pagesToShow[pagesToShow.length - 1] && page + 2 === total) {
      setPagesToShow(pages.slice(page - 3, page + 4))
    } else if (page + 1 < 4) {
      setPagesToShow(pages.slice(0, limit))
    } else {
      setPagesToShow(pages.slice(page - 2, page + 3))
    }
  }

  return (<Flex
    w={"100%"}
    justifyContent={"center"}
    alignItems={"center"}
    mt={5}
    direction={"column"}
  >
    <Box>
      {
        currentPage !== 1 && currentPage > 3
        && (<Button
          onClick={() => handlePagesToShow(0)}
          bg={"white"}
          color={"black"}
          border={"solid black 1px"}
          borderRadius={"50%"}
          mx={2}
          _hover={{
            bg: "black",
            color: "white"
          }}
        >
          ...
        </Button>)
      }
      {
        pagesToShow.map((page) => (
          <Button
            key={page}
            onClick={() => handlePagesToShow(page)}
            bg={currentPage === page + 1 ? "black" : "white"}
            color={currentPage === page + 1 ? "white" : "black"}
            border={"solid black 1px"}
            borderRadius={"50%"}
            mx={2}
            _hover={{
              bg: "black",
              color: "white"
            }}
          >
            {page + 1}
          </Button>
        ))
      }
      {
        currentPage !== total && currentPage < total - 2
        && (<Button
          onClick={() => handlePagesToShow(total - 1)}
          bg={"white"}
          color={"black"}
          border={"solid black 1px"}
          borderRadius={"50%"}
          mx={2}
          _hover={{
            bg: "black",
            color: "white"
          }}
        >
          ...
        </Button>)
      }
    </Box>
    <Box>
      <Heading
        size={"md"}
        mt={2}
      >
        {currentPage} / {total}
      </Heading>
    </Box>
  </Flex>)
}