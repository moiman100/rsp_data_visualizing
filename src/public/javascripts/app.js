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
    left: theme.spacing(2),
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
}));

function App(props) {
  const [graph_list, setGraph_list] = useState([]);

  const classes = useStyles();

  function addGraph(name, index) {
    if (name == "funnel") {
      return <FunnelGraph key={index} index={index} />;
    }
    if (name == "sankey") {
      return <SankeyGraph key={index} index={index} />;
    }
  }

  return (
    <React.Fragment>
      <NavBar />
      <Button
        color="secondary"
        startIcon={<Icon>add</Icon>}
        onClick={() => setGraph_list([...graph_list, "funnel"])}
      >
        Add funnel
      </Button>
      <Button
        color="secondary"
        startIcon={<Icon>add</Icon>}
        onClick={() => setGraph_list([...graph_list, "sankey"])}
      >
        Add sankey
      </Button>
      {graph_list.map((name, index) => addGraph(name, index))}
    </React.Fragment>
  );
}

const domContainer = document.querySelector("#app");
ReactDOM.render(<App />, domContainer);
