'use strict';

const e = React.createElement;

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
      event_flow: []
    };
  }

  componentDidMount() {
    this.getAds();
  }

  handleChange(index) {
    let list_copy = [...this.state.event_flow]
    list_copy.splice(index, 1, event.target.value)
    this.setState({ event_flow: list_copy })
  }

  handleRemove(index) {
    let list_copy = [...this.state.event_flow]
    list_copy.splice(index, 1)
    this.setState({ event_flow: list_copy })
  }

  handleAdd() {
    this.setState(prevState => ({ event_flow: [...prevState.event_flow, ""] }))
  }

  getAds() {
    // some API call to get a list of ads
    let ad_list = ["ad1", "ad2"];
    this.setState({ available_ads: ad_list })
  }

  getAdVersions() {
    // some API call to get a list of ad versions
    let version_list = ["1.0", "0.5"];
    this.setState({ available_ad_versions: version_list })
  }

  getEvents() {
    // some API call to get a list of events
    let event_list = ["test", "case"];
    this.setState({ available_events: event_list })
  }

  getData() {
    // some API call to get data for the graph
    // call should send ad, ad_version and event_flow to server
    let data_object = {
      y: [],
      fill: 'tozeroy',
      type: 'scatter'
    };
    data_object.y = [5, 2, 1, 0.5]; // from API
    let data_object_list = [data_object]
    this.setState({ graph_data: data_object_list })
  }

  render() {
    Plotly.react('funnel_graph', this.state.graph_data);
    return (
      <div>
        <select defaultValue="" onChange={this.getAdVersions.bind(this)}>
          <option disabled value="">Ad</option>
          {this.state.available_ads.map((ad_name, index) =>
            <option key={index} value={ad_name}>{ad_name}</option>
          )}
        </select>
        <select defaultValue="" onChange={this.getEvents.bind(this)}>
          <option disabled value="">Version</option>
          {this.state.available_ad_versions.map((ad_version, index) =>
            <option key={index} value={ad_version}>{ad_version}</option>
          )}
        </select>
        {this.state.event_flow.map((selected_event, index) =>
          <div key={index}>
            <select value={this.state.event_flow[index]} onChange={this.handleChange.bind(this, index)}>
              <option disabled value="">Event</option>
              {this.state.available_events.map((event_name, index) =>
                <option key={index} value={event_name}>{event_name}</option>
              )}
            </select>
            <button onClick={this.handleRemove.bind(this, index)}>Remove</button>
          </div>
        )}
        <button onClick={this.handleAdd.bind(this)}>
          Add new event
        </button>
        <button onClick={this.getData.bind(this)}>
          Update funnel
        </button>
      </div>
    );
  }
}
const domContainer = document.querySelector('#selectors');
ReactDOM.render(e(FunnelGraph), domContainer);