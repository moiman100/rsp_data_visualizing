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
  Icon,
  Grid,
  IconButton,
  Tooltip,
  colors,
} = MaterialUI;

const { useState, useEffect } = React;

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

// Refactored FunnelGraph
function FunnelGraph(props) {
  const [graph_data, setGraph_data] = useState([]);
  const [available_ads, setAvailable_ads] = useState([]);
  const [available_ad_versions, setAvailable_ad_versions] = useState([]);
  const [available_events, setAvailable_events] = useState([]);
  const [ad, setAd] = useState("");
  const [ad_version, setAd_version] = useState("");
  const [event_flow, setEvent_flow] = useState([]);

  const classes = useStyles();

  function handleChange(index) {
    let event_flow_copy = [...event_flow];
    event_flow_copy.splice(index, 1, event.target.value);
    setEvent_flow(event_flow_copy);
  }

  function handleRemove(index) {
    let event_flow_copy = [...event_flow];
    event_flow_copy.splice(index, 1);
    setEvent_flow(event_flow_copy);
  }

  function handleAdd() {
    setEvent_flow([...event_flow, ""]);
  }

  function getAds() {
    // some API call to get a list of ads
    let ad_list;
    axios.get("/api/ad").then(function (response) {
      ad_list = response.data.data;
      setAvailable_ads(ad_list);
    });
  }

  function getAdVersions() {
    let ad_id = available_ads[event.target.selectedIndex - 1]._id;
    // some API call to get a list of ad versions
    let version_list;
    axios
      .get("/api/version", {
        params: {
          ad: ad_id,
        },
      })
      .then(function (response) {
        version_list = response.data.data;
        setAvailable_ad_versions(version_list);
      });
  }

  function getEvents() {
    let ad_version_id =
      available_ad_versions[event.target.selectedIndex - 1]._id;
    // some API call to get a list of events
    let event_list;
    axios.get("/api/event", {}).then(function (response) {
      console.log(response.data);
      event_list = ["test", "click", "clack"];
      setAvailable_events(event_list);
    });
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
      X: event_flow,
      y: [],
      type: "bar",
    };
    data_object.y = fibonacci(); // from API
    let data_object_list = [data_object];
    setGraph_data(data_object_list);
  }

  useEffect(() => {
    Plotly.react(
      "funnel_graph",
      graph_data,
      {},
      { displayModeBar: false, doubleClickDelay: 500 }
    );
  }, [graph_data]);

  useEffect(() => {
    getAds();
  }, []);

  return (
    // Could be divided into smaller components
    <Container maxWidth="sm">
      <FormControl className={classes.formControl}>
        <InputLabel>
          <b>AD Name</b>
        </InputLabel>
        <NativeSelect defaultValue="" onChange={getAdVersions.bind(this)}>
          <option aria-label="None" value="" disabled />
          {available_ads.map((object, index) => (
            <option key={index} value={object.name}>
              {object.name}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel>Version</InputLabel>
        <NativeSelect defaultValue="" onChange={getEvents.bind(this)}>
          <option aria-label="None" value="" disabled />
          {available_ad_versions.map((object, index) => (
            <option key={index} value={object.version_name}>
              {object.version_name}
            </option>
          ))}
        </NativeSelect>
      </FormControl>

      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={11}>
            <Tooltip
              disableFocusListener
              disableTouchListener
              title="Add event"
            >
              <IconButton onClick={handleAdd}>
                <Icon style={{ color: colors.green[500], fontSize: 30 }}>
                  add_circle
                </Icon>
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item xs={1}>
            <Tooltip
              disableFocusListener
              disableTouchListener
              title="Update graph"
            >
              <IconButton onClick={getData}>
                <Icon style={{ color: colors.blue[500], fontSize: 30 }}>
                  sync
                </Icon>
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
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
      <option aria-label="None" value="" disabled />
      {props.inputList.map((name, index) => (
        <option key={index} value={name}>
          {name}
        </option>
      ))}
    </React.Fragment>
  );
}

const domContainer = document.querySelector("#selectors");
ReactDOM.render(<FunnelGraph />, domContainer);
