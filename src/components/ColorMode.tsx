import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMoon, faSun} from "@fortawesome/free-solid-svg-icons";
import {IconButton, useColorMode} from "@chakra-ui/react";

export const ColorMode = () => {
  const {colorMode, toggleColorMode} = useColorMode()

  return (
    <IconButton
      onClick={toggleColorMode}
      aria-label={"Theme"}
      ml={5}
      variant="ghost"
      icon={colorMode === "light" ? <FontAwesomeIcon icon={faSun}/> : <FontAwesomeIcon icon={faMoon}/>}
      _hover={{bg: "none"}}
    />
  )
}