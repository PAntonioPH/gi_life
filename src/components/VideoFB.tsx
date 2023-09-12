import {Box} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {VideoFacebook} from "@/interfaces/VideoFacebook";
import axios from "axios";
import {LoadingPage} from "@/components/LoadingPage";
import parse from "html-react-parser"

interface Props {
  id: number;
  w?: string;
  h?: string;
}

export const VideoFB = ({id}: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [video, setVideo] = useState<VideoFacebook>({
    id: 0,
    title: '',
    url: '',
  });

  useEffect(() => {
    axios.get(`/api/v1/video_facebook?id=${id}`, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then((res) => {
        setVideo(res.data.response)
        setIsLoading(false)
      })
  }, [id])

  return (<Box>
    {
      isLoading
        ? (<LoadingPage/>)
        : (<Box
        >
          {
            parse(video.url)
          }
        </Box>)
    }
  </Box>)
}