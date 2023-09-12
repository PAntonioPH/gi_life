import {useRouter} from "next/router";
import {Layout} from "@/components/Layout/Layout";
import {useEffect, useState} from "react";
import {Heading} from "@chakra-ui/react";

const Category = () => {
  const router = useRouter()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const {category} = router.query

  useEffect(() => {
    if (!category) return;

    setData([])
  }, [category, currentPage]);

  const handleClick = async (id: number) => await router.push(`/category/${category}/item/${id}`)

  return (
    <Layout
      title={typeof category === "string" ? `${category[0].toUpperCase()}${category.slice(1, category.length)}` : "category"}
    >
      <Heading>
        {
          category
        }
      </Heading>
    </Layout>
  )
}

export default Category;