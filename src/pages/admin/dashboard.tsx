import {Box, Button, Divider, Flex, Heading, SimpleGrid, Text, useToast} from "@chakra-ui/react";
import {Sidebar} from "@/components/Sidebar/Sidebar";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {DateRange} from 'react-date-range';
import {useEffect, useState} from "react";
import axios from "axios";
import {Dashboard} from "@/interfaces/Dashboard";
import {addDays, subDays} from "date-fns";
import {LoadingPage} from "@/components/LoadingPage";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const Dashboard = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Dashboard>({
    pageViews: [],
    visitsDay: [],
    startDashboard: moment().format('YYYY-MM-DD'),
  })
  const [filterDate, setFilterDate] = useState([
    {
      startDate: subDays(new Date(), 6),
      endDate: addDays(new Date(), 0),
      key: 'selection'
    }
  ]);

  useEffect(() => {
    axios.post("/api/v1/dashboard", {}, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(res => {
        setData(res.data.response);
        setFilterDate([
          {
            startDate:new Date(res.data.response.startDashboard),
            endDate: addDays(new Date(), 0),
            key: 'selection'
          }
        ])
      })
      .finally(() => setLoading(false))
  }, []);

  const handleChange = (filter: any) => setFilterDate([filter.selection])

  const handleFilter = () => {
    if (filterDate[0] && filterDate[0].key === 'selection') {
      setIsLoading(true);

      axios.post("/api/v1/dashboard", {
        dateStart: moment(filterDate[0].startDate).format('YYYY-MM-DD'),
        dateEnd: moment(filterDate[0].endDate).format('YYYY-MM-DD')
      }, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
        .then(res => {
          setData(res.data.response);
          setData((data) => ({...data, startDashboard: res.data.response.startDashboard,}));
        })
        .catch(err => {
          toast({
            title: "Error",
            description: err.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          })
        })
        .finally(() => setIsLoading(false))
    } else {
      toast({
        title: "Error",
        description: "Debe ingresar ambas fechas",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      })
    }
  }

  return (
    <Sidebar title={"Dashboard"}>
      <Box pb={{base: 0, md: 5}}>
        <Heading as="h1" size="lg">Dashboard</Heading>
        <Divider borderColor="black" borderWidth="1px"/>
      </Box>

      {
        loading
          ? (<LoadingPage/>)
          : (<>
            <Flex
              m={{base: 3, md: 5}}
              alignItems="center"
              justifyContent="center"
              flexDirection={{base: "column", md: "row"}}
            >
              <DateRange
                onChange={item => handleChange(item)}
                months={1}
                direction="horizontal"
                showDateDisplay={false}
                ranges={filterDate}
                minDate={new Date(data.startDashboard)}
                maxDate={subDays(new Date(), 0)}
              />

              <Flex
                alignItems="center"
                flexDirection="column"
                ml={{base: 0, md: 10}}
              >
                <Text fontSize="md" color="gray.500" mb={5}>
                  {moment(filterDate[0].startDate).format('DD/MM/YYYY')} - {moment(filterDate[0].endDate).format('DD/MM/YYYY')}
                </Text>

                <Button
                  mb={5}
                  onClick={handleFilter}
                  colorScheme="blue"
                  leftIcon={<FontAwesomeIcon icon={faSearch}/>}
                  isLoading={isLoading}
                >
                  Filtrar
                </Button>
              </Flex>
            </Flex>

            <SimpleGrid
              columns={1}
              spacing={{base: 0, md: 16}}
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={data.visitsDay}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="date"/>
                  <YAxis padding={{top: 20}}/>
                  <Tooltip/>
                  <Legend/>
                  <Line type="monotone" dataKey="visits" stroke="#2b6cb0" activeDot={{r: 8}} label={{position: 'top', fill: '#2b6cb0',}}/>
                </LineChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={data.pageViews}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="title"/>
                  <YAxis padding={{top: 20}}/>
                  <Tooltip/>
                  <Legend/>
                  <Line dataKey="views" stroke="#2b6cb0" activeDot={{r: 8}} label={{position: 'top', fill: '#2b6cb0',}}/>
                </LineChart>
              </ResponsiveContainer>
            </SimpleGrid>
          </>)
      }
    </Sidebar>
  )
}

export default Dashboard;