'use strict';

const e = React.createElement;

class FunnelGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graph_data: [{
        x: [1, 2, 3, 4],
        y: [5, 2, 1, 0.5],
        fill: 'tozeroy',
        type: 'scatter'
      }], event_list: ["first", "second"]
    };
  }

  render() {
    Plotly.react('funnel_graph', this.state.graph_data);
    const selectors = this.state.event_list.map((event, index) => {
      const button = e('button', { onClick: () => this.setState({ event_list: this.state.event_list.concat("hello") }) }, event)
      return e('li', { key: index }, button);
    });

    return (
      e('ul', null, selectors)
    );
  }
}
const domContainer = document.querySelector('#like_button');
ReactDOM.render(e(FunnelGraph), domContainer);