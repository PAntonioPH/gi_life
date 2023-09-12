import Head from "next/head";
import process from "process";
import {LayoutProduct} from "@/components/Layout/LayoutProduct";
import {Heading} from "@chakra-ui/react";
import {useRouter} from "next/router";

interface Props {
  product: any
}

const Item = ({product}: Props) => {
  const router = useRouter();

  return (<>
      <Head>
        {/*<title>{product.title}</title>*/}
        <link rel="shortcut icon" href="/assets/icons/favicon.ico"/>

        {/*<meta property="og:title" content={product.title}/>*/}
        <meta property="og:type" content="article"/>
        <meta property="og:description" content="Gi Life"/>
        <meta property="og:image:width" content="600"/>
        <meta property="og:image:height" content="314"/>
        {/*<meta property="og:image" content={product.img ? product.img : "https://gilife.mx/assets/icons/logo.png"}/>*/}
        <meta property="og:image:type" content="image/jpeg"/>
        <meta property="og:image:type" content="image/png"/>
      </Head>

      <LayoutProduct>
        <Heading>
          {
            router.query.item
          }
        </Heading>
      </LayoutProduct>
    </>
  )
};

// export async function getServerSideProps(context: any) {
//   const {params: {product}} = context;
//
//   const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/item/${product}`, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}});
//   const {response} = await res.json();
//
//   return {
//     props: {
//       product: response,
//     },
//   };
// }

export default Item