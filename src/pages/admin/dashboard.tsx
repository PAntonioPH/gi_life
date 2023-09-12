import {Sidebar} from "@/components/Sidebar/Sidebar";

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {Box, Divider, Heading} from "@chakra-ui/react";

const Dashboard = () => {
  return (
    <Sidebar title={"Dashboard"}>
      <Box pb={{base: 0, md: 5}}>
        <Heading as="h1" size="lg">Dashboard</Heading>
        <Divider borderColor="black" borderWidth="1px"/>
      </Box>
    </Sidebar>
  )
}

export default Dashboard;