import {Button, Box} from "@chakra-ui/react";
import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebook, faInstagram, faTwitter} from "@fortawesome/free-brands-svg-icons";

export const FloatingSocialMedia = () => {
  return (
    <>
      <Button
        onClick={() => window.open('https://www.facebook.com/LaOpiniondeHidalgo')}
        colorScheme="facebook"
        size="sm"
        mb={2}
        leftIcon={<FontAwesomeIcon icon={faFacebook}/>}
      >
        La Opinión del Altiplano
      </Button>
      <Button
        onClick={() => window.open('https://twitter.com/LaopinionHidalg')}
        colorScheme="twitter"
        size="sm"
        mb={2}
        leftIcon={<FontAwesomeIcon icon={faTwitter}/>}
      >
        @LaopiniondelAltiplano
      </Button>
      <Button
        onClick={() => window.open('https://www.instagram.com/laopinionhidalgo1/')}
        bg="#702459"
        _hover={{
          bg: '#702459'
        }}
        color={'white'}
        size="sm"
        mb={2}
        leftIcon={<FontAwesomeIcon icon={faInstagram}/>}
      >
        @laopiniondelAltiplano
      </Button>
    </>
  )
}