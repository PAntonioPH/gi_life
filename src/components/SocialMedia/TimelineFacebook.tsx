import {useEffect, useState} from "react";
import axios from "axios";
import {Avatar, Box, Heading, HStack, Text, VStack} from "@chakra-ui/react";
import {LoadingPage} from "@/components/LoadingPage";
import moment from "moment/moment";

const accessToken = "EAAwbkZAd6WkYBOwF0J4uy9vak3H8oKPmZAjU1rQ4c7jHgUlD3mFfNTQlt1WHGxxlAO3cUttjZCaX8eruE4fN10Gr4n42DHxMxedPRw7quIAFkVnIgJXhlOqlw6yJ66J3sfq94ZB5Jl9sBxMZBCzxiSzkzwdaqSZBcwalGaGTIfIol71rrX1HBbZAjZAxOQZDZD\n"

interface Post {
  id: string;
  message?: string;
  created_time: string;
}

interface Profile {
  name: string;
  picture: string;
}

export const TimelineFacebook = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [profile, setProfile] = useState<Profile>({
    name: "La Opinión del Altiplano",
    picture: "/assets/icons/logoRRSS.png",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    axios.get(`https://graph.facebook.com/v16.0/me/accounts?access_token=${accessToken}`)
      .then(res => {
        const {access_token} = res.data.data[0]

        axios.get(`https://graph.facebook.com/v16.0/me?fields=name,picture&access_token=${access_token}`)
          .then(res => {
            const {name, picture: {data: {url}}} = res.data

            setProfile({
              name,
              picture: url,
            })
          })

        axios.get(`https://graph.facebook.com/v16.0/me/feed?access_token=${access_token}`)
          .then(res => {
            setPosts(res.data.data)
          })
      })
      .catch((err)=>{
        console.log(err)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (<Box>
    {
      isLoading
        ? (<LoadingPage/>)
        : (<Box
          border="1px"
          borderColor="gray.200"
          borderRadius="2xl"
        >
          <HStack
            p={2}
            borderBottom="1px"
            borderColor="gray.200"
            _hover={{
              cursor: "pointer",
              backgroundColor: "gray.100",
              textDecoration: "underline",
            }}
            onClick={() => window.open("https://www.facebook.com/profile.php?id=100092837678912", "_blank")}
          >
            <Avatar
              size="md"
              name={profile.name}
              src={profile.picture}
            />
            <Heading as="h1" size="md">{profile.name}</Heading>
          </HStack>

          <Box
            scrollBehavior="smooth"
            height="50vh"
            overflowY="scroll"
          >
            {
              posts.map(({id, created_time, message}) =>
                message && (<Box
                  key={id}
                  borderBottom={"1px"}
                  borderColor="gray.200"
                  _hover={{
                    cursor: "pointer",
                  }}
                  onClick={() => window.open(`https://www.facebook.com/${id}`, "_blank")}
                >
                  <Box
                    p={2}
                    m={2}
                  >
                    <HStack>
                      <Avatar
                        size="sm"
                        name={profile.name}
                        src={profile.picture}
                      />
                      <VStack
                        spacing={0}
                      >
                        <Heading size="sm">{profile.name}</Heading>
                        <Text
                          fontSize="xs"
                        >
                          {
                            moment(created_time).format("DD/MM/YYYY h:mm A")
                          }
                        </Text>
                      </VStack>
                    </HStack>
                    <Text>{message}</Text>
                  </Box>
                </Box>))
            }
          </Box>
        </Box>)
    }
  </Box>)
}