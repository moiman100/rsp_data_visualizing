"use strict";
const {
  Select,
  NativeSelect,
  MenuItem,
  InputLabel,
  FormControl,
  makeStyles,
  Container,
  Button,
  Card,
  Box,
} = MaterialUI;

const { useState, useEffect } = React;

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

// Refactored FunnelGraph
function FunnelGraphf(props) {
  const [graph_data, setGraph_data] = useState([]);
  const [available_ads, setAvailable_ads] = useState([]);
  const [available_ad_versions, setAvailable_ad_versions] = useState([]);
  const [available_events, setAvailable_events] = useState([]);
  const [ad, setAd] = useState("");
  const [ad_version, setAd_version] = useState("");
  const [event_flow, setEvent_flow] = useState([]);

  const classes = useStyles();

  function handleChange(index) {
    setEvent_flow(event_flow.splice(index, 1, event.target.value));
  }

  function handleRemove(index) {
    setEvent_flow(event_flow.splice(index, 1));
  }

  function handleAdd() {
    setEvent_flow([...event_flow, ""]);
  }

  function getAds() {
    // some API call to get a list of ads
    let ad_list = ["ad1", "ad2", "ad3"];
    setAvailable_ads(ad_list);
  }

  function getAdVersions() {
    // some API call to get a list of ad versions
    console.log("hello");
    let version_list = ["1.0", "0.5"];
    setAvailable_ad_versions(version_list);
  }

  function getEvents() {
    // some API call to get a list of events
    let event_list = ["test", "case", "move", "press", "click"];
    setAvailable_events(event_list);
  }

  // demo function
  function fibonacci() {
    let fibonacci_list = [0, 1];
    while (fibonacci_list.length < event_flow.length) {
      let index = fibonacci_list.length;
      fibonacci_list.push(
        fibonacci_list[index - 2] + fibonacci_list[index - 1]
      );
    }
    fibonacci_list = fibonacci_list.reverse();
    return fibonacci_list.slice(0, event_flow.length);
  }

  function getData() {
    // some API call to get data for the graph
    // call should send ad, ad_version and event_flow to server
    let data_object = {
      y: [],
      fill: "tozeroy",
      type: "scatter",
    };
    data_object.y = fibonacci(); // from API
    let data_object_list = [data_object];
    setGraph_data(data_object_list);
  }

  useEffect(() => {
    Plotly.react("funnel_graph", graph_data);
  }, [graph_data]);

  useEffect(() => {
    getAds();
  }, []);

  return (
    // Could be divided into smaller components
    <Container maxWidth="sm">
      <FormControl className={classes.formControl}>
        <InputLabel>Ad</InputLabel>
        <NativeSelect defaultValue="" onChange={getAdVersions}>
          <OptionList inputList={available_ads} />
        </NativeSelect>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel>Version</InputLabel>
        <NativeSelect defaultValue="" onChange={getEvents}>
          <OptionList inputList={available_ad_versions} />
        </NativeSelect>
      </FormControl>
      <Box>
        <Button onClick={handleAdd}>Add new event</Button>
        <Button onClick={getData}>Update funnel</Button>
      </Box>
      <Card id="funnel_graph"></Card>
      {event_flow.map((selected_event, index) => (
        <FormControl key={index} className={classes.formControl}>
          <InputLabel>Event</InputLabel>
          <NativeSelect
            value={event_flow[index]}
            onChange={handleChange.bind(this, index)}
          >
            <OptionList inputList={available_events} />
          </NativeSelect>
          <Button onClick={handleRemove.bind(this, index)}>Remove</Button>
        </FormControl>
      ))}
    </Container>
  );
}

// This doesn't work in Select for some reason so using NativeSelect for now
function OptionList(props) {
  return (
    <React.Fragment>
      <option aria-label="None" value="" />
      {props.inputList.map((name, index) => (
        <option key={index} value={name}>
          {name}
        </option>
      ))}
    </React.Fragment>
  );
}

const domContainer = document.querySelector("#selectors");
ReactDOM.render(<FunnelGraphf />, domContainer);
