import {Timeline} from "react-twitter-widgets";

export const TimelineTwitter = () => {
  return (<>
    <Timeline
      dataSource={{
        sourceType: 'profile',
        screenName: 'LaopinionHidalg',
      }}
      options={{
        username: 'LaopinionHidalg',
        height: '500',
        width: "100%",
      }}
    />
  </>)
}