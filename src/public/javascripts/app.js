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
  const classes = useStyles();

  return (
    <React.Fragment>
      <NavBar />
      <Box m={2}>
        <FunnelGraph />
      </Box>
      <Box m={2}>
        <SankeyGraph />
      </Box>
    </React.Fragment>
  );
}

const domContainer = document.querySelector("#app");
ReactDOM.render(<App />, domContainer);
