"use strict";
const {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  makeStyles,
  Container,
  Button,
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

  function handleChange(index) {
    setEvent_flow(event_flow.splice(index, 1, event.target.value));
  }

  function handleRemove(index) {
    setEvent_flow(event_flow.splice(index, 1));
  }

  function handleAdd() {
    setEvent_flow([...prevState.event_flow, ""]);
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
    while (fibonacci_list.length < this.state.event_flow.length) {
      let index = fibonacci_list.length;
      fibonacci_list.push(
        fibonacci_list[index - 2] + fibonacci_list[index - 1]
      );
    }
    fibonacci_list = fibonacci_list.reverse();
    return fibonacci_list.slice(0, this.state.event_flow.length);
  }

  function getData() {
    // some API call to get data for the graph
    // call should send ad, ad_version and event_flow to server
    let data_object = {
      y: [],
      fill: "tozeroy",
      type: "scatter",
    };
    data_object.y = this.fibonacci(); // from API
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
    <Container maxWidth="sm">
      <FormControl>
        <InputLabel>Ad</InputLabel>
        <Select defaultValue="" onChange={getAdVersions}>
          <OptionList inputList={available_ads} />
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Version</InputLabel>
        <Select defaultValue="" onChange={getEvents}>
          <OptionList inputList={available_ad_versions} />
        </Select>
      </FormControl>
      {event_flow.map((selected_event, index) => (
        <div key={index}>
          <Select
            value={event_flow[index]}
            onChange={handleChange.bind(this, index)}
          >
            <option disabled value="">
              Event
            </option>
            <OptionList inputList={available_events} />
          </Select>
          <Button onClick={handleRemove.bind(this, index)}>Remove</Button>
        </div>
      ))}
      <Button onClick={handleAdd.bind(this)}>Add new event</Button>
      <Button onClick={getData.bind(this)}>Update funnel</Button>
    </Container>
  );
}

function OptionList(props) {
  return (
    <React.Fragment>
      {props.inputList.map((name, index) => (
        <MenuItem key={index} value={name}>
          {name}
        </MenuItem>
      ))}
    </React.Fragment>
  );
}

class FunnelGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graph_data: [],
      available_ads: [],
      available_ad_versions: [],
      available_events: [],
      ad: "",
      ad_version: "",
      event_flow: [],
    };
  }

  componentDidMount() {
    this.getAds();
  }

  handleChange(index) {
    let list_copy = [...this.state.event_flow];
    list_copy.splice(index, 1, event.target.value);
    this.setState({ event_flow: list_copy });
  }

  handleRemove(index) {
    let list_copy = [...this.state.event_flow];
    list_copy.splice(index, 1);
    this.setState({ event_flow: list_copy });
  }

  handleAdd() {
    this.setState(prevState => ({ event_flow: [...prevState.event_flow, ""] }));
  }

  getAds() {
    // some API call to get a list of ads
    let ad_list = ["ad1", "ad2", "ad3"];
    this.setState({ available_ads: ad_list });
  }

  getAdVersions() {
    // some API call to get a list of ad versions
    let version_list = ["1.0", "0.5"];
    this.setState({ available_ad_versions: version_list });
  }

  getEvents() {
    // some API call to get a list of events
    let event_list = ["test", "case", "move", "press", "click"];
    this.setState({ available_events: event_list });
  }

  // demo function
  fibonacci() {
    let fibonacci_list = [0, 1];
    while (fibonacci_list.length < this.state.event_flow.length) {
      let index = fibonacci_list.length;
      fibonacci_list.push(
        fibonacci_list[index - 2] + fibonacci_list[index - 1]
      );
    }
    fibonacci_list = fibonacci_list.reverse();
    return fibonacci_list.slice(0, this.state.event_flow.length);
  }

  getData() {
    // some API call to get data for the graph
    // call should send ad, ad_version and event_flow to server
    let data_object = {
      y: [],
      fill: "tozeroy",
      type: "scatter",
    };
    data_object.y = this.fibonacci(); // from API
    let data_object_list = [data_object];
    this.setState({ graph_data: data_object_list });
  }

  render() {
    Plotly.react("funnel_graph", this.state.graph_data);
    return (
      <div>
        <FormControl>
          <InputLabel>Ad</InputLabel>
          <Select defaultValue="" onChange={this.getAdVersions.bind(this)}>
            {this.state.available_ads.map((ad_name, index) => (
              <MenuItem key={index} value={ad_name}>
                {ad_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Version</InputLabel>
          <Select defaultValue="" onChange={this.getEvents.bind(this)}>
            {this.state.available_ad_versions.map((ad_version, index) => (
              <MenuItem key={index} value={ad_version}>
                {ad_version}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {this.state.event_flow.map((selected_event, index) => (
          <div key={index}>
            <select
              value={this.state.event_flow[index]}
              onChange={this.handleChange.bind(this, index)}
            >
              <option disabled value="">
                Event
              </option>
              {this.state.available_events.map((event_name, index) => (
                <option key={index} value={event_name}>
                  {event_name}
                </option>
              ))}
            </select>
            <button onClick={this.handleRemove.bind(this, index)}>
              Remove
            </button>
          </div>
        ))}
        <button onClick={this.handleAdd.bind(this)}>Add new event</button>
        <button onClick={this.getData.bind(this)}>Update funnel</button>
      </div>
    );
  }
}
const domContainer = document.querySelector("#selectors");
ReactDOM.render(<FunnelGraphf />, domContainer);
