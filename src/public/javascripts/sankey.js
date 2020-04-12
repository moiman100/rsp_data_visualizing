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
// Refactored SankeyGraph
function SankeyGraph(props) {
  const [sankey_data, setSankey_data] = useState({});
  const [ad_version, setAd_version] = useState("");
  const classes = useStyles();

  function getVersionId(ad_version_id) {
    setAd_version(ad_version_id);
  }

  function getData(checkState, selectedStartDate, selectedEndDate) {
    let filterArray = [];
    for (let [key, value] of Object.entries(checkState)) {
      if (value) {
        filterArray.push(key);
      }
    }

    let data_object = {
      type: "sankey",
      orientation: "h",
    };

    // some API call to get data for the graph
    // call should send ad, ad_version and event_flow to server
    axios
      .post("/api/sankey", {
        params: {
          version: ad_version,
          platforms: filterArray,
          eDate: selectedEndDate,
          sDate: selectedStartDate,
        },
      })
      .then(function (response) {
        data_object.node = response.data.data.node;
        data_object.link = response.data.data.link;

        data_object = [data_object];

        setSankey_data(data_object);
      });
  }

  useEffect(() => {
    Plotly.react("sankey", sankey_data, {}, { displayModeBar: false })
  }, [sankey_data])

  return (
    // Could be divided into smaller components
    <Container maxWidth={false}>
      <Card>
        <Selectors version_changed={getVersionId} get_data={getData} version_selector_id="sankey_version_selector" />
        <Box id="sankey"></Box>
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

const domContainer = document.querySelector("#sankey-graph");
ReactDOM.render(<SankeyGraph />, domContainer);
