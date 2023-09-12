import moment from "moment/moment";
import {Text, Box} from "@chakra-ui/react";

export const DateWeather = () => {
  return (<Box
    bg='#6a1834'
    p={2}
    borderRadius={'lg'}
    color={'whitesmoke'}
  >
    <Text
      textAlign={'center'}
    >
      {moment().format('DD/MM/YY')}
    </Text>
    <Text
      textAlign={'center'}
    >
      {moment().format('h:mm a')}
    </Text>
  </Box>)
}
