"use strict";
const {
  Select,
  NativeSelect,
  MenuItem,
  InputLabel,
  FormControl,
  FormGroup,
  FormLabel,
  FormControlLabel,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputLabelProps,
  Checkbox,
  Fab,
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
  fab: {
    left: theme.spacing(2),
  },
}));

// Refactored FunnelGraph
function FunnelGraph(props) {
  const [graph_data, setGraph_data] = useState([]);
  const [available_events, setAvailable_events] = useState([]);
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

  function getEvents(ad_version_id) {
    // some API call to get a list of events
    setAd_version(ad_version_id);
    let event_list;

    axios
      .get("/api/version", {
        params: {
          _id: ad_version_id,
        },
      })
      .then(function (response) {
        event_list = response.data.data[0].event_types;
        setAvailable_events(event_list);
        setEvent_flow([]);
      });
  }

  function getData(checkState, selectedStartDate, selectedEndDate) {
    let labels = event_flow.filter(element => element != "");
    labels.forEach((element, index) => {
      labels[index] = element + "(" + index + ")";
    });
    let data_object = {
      x: labels,
      y: [],
      type: "bar",
    };

    let filterArray = [];
    for (let [key, value] of Object.entries(checkState)) {
      if (value) {
        filterArray.push(key);
      }
    }

    // some API call to get data for the graph
    // call should send ad, ad_version and event_flow to server

    let filtered_event_flow = event_flow.filter(element => element != "");

    axios
      .post("/api/funnel", {
        order: filtered_event_flow,

        params: {
          version: ad_version,
          platforms: filterArray,
          eDate: selectedEndDate,
          sDate: selectedStartDate,
        },
      })
      .then(function (response) {
        data_object.y = response.data.data // from API
        let data_object_list = [data_object];
        setGraph_data(data_object_list);
      });
  }

  function saveFunnel(checkState) {
    let filtered_event_flow = event_flow.filter(element => element != "");

    axios
      .post("/api/graph", {
        version: ad_version,
        type: "Funnel",
        event_flow: filtered_event_flow,
        filter_params: checkState,
      })
      .then(function (response) {
        console.log(response.data);
      });
  }

  useEffect(() => {
    var funnelLayout = {
      yaxis: { range: [0, 1] },
      xaxis: { range: [0, 1] }
    }
    try {
      if (graph_data[0]["y"].length > 0) {
        console.log(graph_data[0].y)
        let maxY = Math.max.apply(null, graph_data[0]["y"]); //Find highest value on the returned data
        maxY = maxY == 0 ? 1 : maxY;
        let countX = graph_data[0]["x"].length; // Count of events returned
        funnelLayout = {
          yaxis: { range: [0, maxY] },
          xaxis: { range: [-0.5, countX] }
        }
      }
    } catch (err) {

    }

    Plotly.react(
      "funnel_graph",
      graph_data,
      funnelLayout,
      { displayModeBar: false, doubleClickDelay: 500 }
    );
  }, [graph_data]);

  return (
    // Could be divided into smaller components
    <Container maxWidth={false}>
      <Card>
        <Selectors version_changed={getEvents} get_data={getData} save_graph={saveFunnel} version_selector_id="funnel_version_selector" />

        <Box id="funnel_graph"></Box>

        <Grid container direction="row">
          <Grid item><Tooltip
            disableFocusListener
            disableTouchListener
            title="Add event"
          >
            <Fab style={{ color: colors.common.white, backgroundColor: colors.green[400], fontSize: 40 }} className={classes.fab} onClick={handleAdd}>
              <Icon >
                add
              </Icon>
            </Fab>
          </Tooltip></Grid>
          <Grid item xs={12}>
            {event_flow.map((selected_event, index) => (
              <FormControl key={index} className={classes.formControl}>
                <InputLabel>Event</InputLabel>

                <NativeSelect
                  value={event_flow[index]}
                  onChange={() => handleChange(index)}
                >
                  <OptionList inputList={available_events} />
                </NativeSelect>
                <Button onClick={() => handleRemove(index)}>Remove</Button>
              </FormControl>
            ))}
          </Grid>
        </Grid>

      </Card>
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

const domContainer = document.querySelector("#funnel-graph");
ReactDOM.render(<FunnelGraph />, domContainer);
