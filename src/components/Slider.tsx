import React from 'react';
import {Carousel} from 'react-responsive-carousel';
import {Box} from "@chakra-ui/react";

import "react-responsive-carousel/lib/styles/carousel.min.css";

interface Item {
  id: number;
  img: string;
  title: string;
}

interface Props {
  posts: Item[];
  handleClick: (index: number) => void;
  defaultImage: string;
}

export const Slider = ({posts, handleClick, defaultImage}: Props) => {
  return (
    <Box
      px={{base: 0, md: 20}}
      _hover={{
        cursor: "pointer",
      }}
      pb={15}
    >
      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        showArrows={true}
        stopOnHover={true}
        swipeable={true}
        showStatus={false}
        centerMode={true}
        showThumbs={false}
        onClickItem={(index) => handleClick(index)}
      >
        {
          posts.map(({id, img, title}) => (
            <div
              key={id}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img && img != "" ? img : defaultImage}
                alt={"postImage"}
                style={{
                  objectFit: "cover",
                  height: "400px",
                  width: "100%",
                }}
              />
              <p
                className="legend"
                style={{
                  fontSize: "1rem",
                  color: "#fff",
                  backgroundColor: "#400d1c",
                  opacity: 1,
                }}
              >
                {title}
              </p>
            </div>
          ))
        }
      </Carousel>
    </Box>
  );
}