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
}));

function App(props) {
  const classes = useStyles();

  return (
    <Container>
      <NavBar />
      <FunnelGraph />
      <SankeyGraph />
    </Container>
  );
}

const domContainer = document.querySelector("#app");
ReactDOM.render(<App />, domContainer);
