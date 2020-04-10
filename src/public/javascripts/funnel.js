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
} = MaterialUI;

const { useState, useEffect } = React;

var ad_id = 0;

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
  const [sankey_data, setSankey_data] = useState({});
  const [available_ads, setAvailable_ads] = useState([]);
  const [available_ad_versions, setAvailable_ad_versions] = useState([]);
  const [available_events, setAvailable_events] = useState([]);
  const [ad, setAd] = useState("");
  const [ad_version, setAd_version] = useState("");
  const [event_flow, setEvent_flow] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [open, setOpen] = useState(false);
  const [checkState, setCheckState] = useState({ Android: true, iOS: true, Horizontal: true, Vertical: true });

  const classes = useStyles();
  const { Android, iOS, Horizontal, Vertical } = checkState;

  function handleCheckChange(event) {
    setCheckState({ ...checkState, [event.target.name]: event.target.checked });
  }

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

  // Filter handlers

  function handleStartDateChange(date) {
    setSelectedStartDate(date.target.value.toString());
  }

  function handleEndDateChange(date) {
    setSelectedEndDate(date.target.value.toString());
  }

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
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
    ad_id = ad_version_id;
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
      });
  }

  function getData() {
    let data_object = {
      X: event_flow,
      y: [],
      type: "bar",
    };

    let filterArray = [];
    for (let [key, value] of Object.entries(checkState)) {
      if (value) {
        filterArray.push({ "os": key });

      }
    }

    var data1 = {
      type: "sankey",
      orientation: "h",
    };

    axios
      .post("/api/sankey", {
        params: {
          version: ad_id,

        },
      })
      .then(function (response) {
        data1.node = response.data.data.node;
        data1.link = response.data.data.link;

        data1 = [data1];

        setSankey_data(data1);
      });

    const dateObject = {};
    if (selectedStartDate != "" && selectedEndDate != "") {
      dateObject.$gte = selectedStartDate;
      dateObject.$lte = selectedEndDate;
    } else if (selectedStartDate != "") {
      dateObject.$gte = selectedStartDate;
    } else if (selectedEndDate != "") {
      dateObject.$lte = selectedEndDate;
    }

    // some API call to get data for the graph
    // call should send ad, ad_version and event_flow to server

    if (selectedStartDate != "" || selectedEndDate != "") {
      axios
        .post("/api/funnel", {
          order: event_flow,

          params: {
            version: ad_id,
            start_date: dateObject,
            $or: filterArray
          },
        })
        .then(function (response) {
          data_object.y = response.data.data // from API
          let data_object_list = [data_object];
          setGraph_data(data_object_list);
        });
    } else {
      axios
        .post("/api/funnel", {
          order: event_flow,

          params: {
            version: ad_id,
            $or: filterArray
          },
        })
        .then(function (response) {
          data_object.y = response.data.data; // from API
          let data_object_list = [data_object];
          setGraph_data(data_object_list);
        });
    }
  }

  useEffect(() => {
    Plotly.react("sankey", sankey_data)
  }, [sankey_data])

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
    <Container maxWidth="false">
      <p>From {selectedStartDate}</p>
      <p>To {selectedEndDate}</p>
      <Grid container>
        <Grid item xs={6}>
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
        </Grid>
        <Grid item xs={6}>
          <Box display="flex" justifyContent="flex-end">
            <FormControl className={classes.formControl}>
              <Button onClick={handleClickOpen}>Filters</Button>
              <Dialog disableBackdropClick open={open} onClose={handleClose}>
                <DialogTitle>Select filters</DialogTitle>
                <DialogContent>
                  <form>
                    <TextField onChange={handleStartDateChange} className={classes.textField}
                      id="date-start"
                      label="Start"
                      type="date"
                      value={selectedStartDate}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                    <TextField onChange={handleEndDateChange} className={classes.textField}
                      id="date-end"
                      label="End"
                      type="date"
                      value={selectedEndDate}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </form>
                  <Box mt={1}>
                    <FormLabel component="legend">OS</FormLabel>
                  </Box>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={Android} onChange={handleCheckChange} name="Android" />}
                      label="Android"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={iOS} onChange={handleCheckChange} name="iOS" />}
                      label="iOS"
                    />
                  </FormGroup>
                  <Box mt={1}>
                    <FormLabel component="legend">Orientation</FormLabel>
                  </Box>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={Horizontal} onChange={handleCheckChange} name="Horizontal" />}
                      label="Horizontal"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={Vertical} onChange={handleCheckChange} name="Vertical" />}
                      label="Vertical"
                    />
                  </FormGroup>

                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleClose}>
                    Ok
                  </Button>
                </DialogActions>
              </Dialog>
            </FormControl>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={11}>
            <Tooltip
              disableFocusListener
              disableTouchListener
              title="Add event"
            >
              <IconButton onClick={handleAdd}>
                <Icon style={{ color: colors.green[500], fontSize: 35 }}>
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
                <Icon style={{ color: colors.blue[500], fontSize: 35 }}>
                  sync
                </Icon>
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      <Card id="funnel_graph"></Card>
      <Card id="sankey"></Card>
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
