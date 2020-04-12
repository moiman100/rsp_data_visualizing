"use strict";
function NavBar(props) {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Tabs value={0}>
        <Tab label="Home" href="/" value={0} />
        <Tab label="Dummy Page" href="/dummy" value={1} />
        <Tab label="Insert data" href="/dummyad" value={2} />
      </Tabs>
    </AppBar>
  );
}
