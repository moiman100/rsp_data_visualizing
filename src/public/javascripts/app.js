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
  AppBar,
  Toolbar,
  Link,
  Typography,
  CardContent,
  CardMedia,
  CardHeader,
  Collapse,
  CardActions,
  Chip,
  Tabs,
  Tab,
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
    margin: theme.spacing(2),
  },
  link: {
    margin: theme.spacing(2),
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    marginLeft: "auto",
    transform: "rotate(180deg)",
  },
  card: {
    margin: theme.spacing(3),
  },
}));

function App(props) {
  const [graph_list, setGraph_list] = useState({});
  const [unique_id, setUnique_id] = useState(0);

  const classes = useStyles();

  function addGraph(name, index) {
    if (name == "funnel") {
      return (
        <Grid key={index} item xs={6}>
          <FunnelGraph index={index} remove_graph={removeGraph} />
        </Grid>
      );
    }
    if (name == "funnel2") {
      return (
        <Grid key={index} item xs={6}>
          <FunnelGraph2 index={index} remove_graph={removeGraph} />
        </Grid>
      );
    }
    if (name == "sankey") {
      return (
        <Grid key={index} item xs={6}>
          <SankeyGraph index={index} remove_graph={removeGraph} />
        </Grid>
      );
    }
  }

  function removeGraph(index) {
    let graph_list_copy = { ...graph_list };
    delete graph_list_copy[index];
    setGraph_list(graph_list_copy);
  }

  function addListItem(type) {
    setUnique_id(unique_id + 1);
    setGraph_list({ ...graph_list, [unique_id]: type });
  }

  return (
    <React.Fragment>
      <NavBar />
      <Button
        color="secondary"
        startIcon={<Icon>add</Icon>}
        onClick={() => addListItem("funnel")}
      >
        Add funnel
      </Button>
      <Button
        color="secondary"
        startIcon={<Icon>add</Icon>}
        onClick={() => addListItem("funnel2")}
      >
        Add mission funnel
      </Button>
      <Button
        color="secondary"
        startIcon={<Icon>add</Icon>}
        onClick={() => addListItem("sankey")}
      >
        Add sankey
      </Button>
      <Grid container>
        {Object.entries(graph_list).map((element) =>
          addGraph(element[1], element[0])
        )}
      </Grid>
    </React.Fragment>
  );
}

const domContainer = document.querySelector("#app");
ReactDOM.render(<App />, domContainer);
