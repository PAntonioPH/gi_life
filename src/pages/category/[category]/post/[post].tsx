import {Avatar, Box, Center, Flex, Heading, HStack, Image, SimpleGrid, Text, Divider} from "@chakra-ui/react";
import {Post} from "@/interfaces/Post";
import parse from "html-react-parser"
import moment from "moment/moment";
import {LayoutDouble} from "@/components/Layout/LayoutDouble";
import Head from "next/head";
import process from "process";
import {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import {LoadingPage} from "@/components/LoadingPage";

interface Props {
  post: Post
}

const Post = ({post}: Props) => {
  const router = useRouter()
  const [lastPosts, setLastPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`/api/v1/last_posts`, {
      params: {actualPost: post.id,},
      headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}
    })
      .then(res => {
        setLastPosts(res.data.response)
        setLoading(false)
      })
  }, [post])

  return (<>
      <Head>
        <title>{post.title}</title>
        <link rel="shortcut icon" href="/assets/icons/favicon.ico"/>

        <meta property="og:title" content={post.title}/>
        <meta property="og:type" content="article"/>
        <meta property="og:description" content="El alma de la noticia"/>
        <meta property="og:image:width" content="600"/>
        <meta property="og:image:height" content="314"/>
        <meta property="og:image" content={post.img ? post.img : "https://laopiniondelaltiplano.com/assets/icons/logo.png"}/>
        <meta property="og:image:type" content="image/jpeg"/>
        <meta property="og:image:type" content="image/png"/>
      </Head>

      <LayoutDouble>
        <Flex
          justifyContent='center'
        >
          <Flex
            w={"100%"}
            direction='column'
            alignItems='center'
          >
            <Center><Heading as={"h2"}>{post.title}</Heading></Center>
            <HStack
              m={5}
              spacing={5}
            >
              <Avatar
                size='md'
                name={post.author}
                src={post.photo_author}
              />
              <Text>
                {
                  post.author
                }
              </Text>
              <Text opacity={0.5}>
                {
                  moment(`${post.date_update} ${post.time_update}`).format('DD/MM/YYYY - hh:ss a')
                }
              </Text>
            </HStack>
            {
              post.img && post.img !== ""
              && (<Image
                objectFit='cover'
                maxW={{base: '100%', sm: '25rem'}}
                src={post.img}
                alt='Imagen'
              />)
            }
            <Box mt={10}>{parse(post.content)}</Box>
            <Box>
              <Heading as="h1" size="lg">MAS CONTENIDO</Heading>
              <Divider borderColor="#a02142" borderWidth="1px"/>
            </Box>
          </Flex>

        </Flex>

        {
          loading
            ? (<LoadingPage/>)
            : (<SimpleGrid
              columns={4}
              spacing={3}
              mt={20}
            >
              {lastPosts.map((lastPost, index) => (
                <Box
                  key={index}
                  h={200}
                  onClick={() => router.push(`/category/${lastPost.category}/post/${lastPost.id}`)}
                  cursor={"pointer"}
                >
                  <Image
                    src={lastPost.img}
                    alt={lastPost.title}
                    w={500}
                    h={100}
                    objectFit={"cover"}
                    objectPosition={"center"}
                    borderRadius={"md"}
                  />
                  <Text
                    h={100}
                  >
                    {
                      lastPost.title.slice(0, 30)
                    }
                    {
                      lastPost.title.length > 30
                      && "..."
                    }
                  </Text>
                </Box>
              ))}

            </SimpleGrid>)
        }

      </LayoutDouble>
    </>
  )
};

export async function getServerSideProps(context: any) {
  const {params: {post}} = context;

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/posts/${post}`, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}});
  const {response} = await res.json();

  return {
    props: {
      post: response,
    },
  };
}

export default Post