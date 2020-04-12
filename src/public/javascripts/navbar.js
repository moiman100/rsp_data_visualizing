"use strict";
function NavBar(props) {
  const classes = useStyles();

  return (
  <AppBar position="static">
    <Toolbar>
        <Typography variant="h6">
            <Link href="/" style={{color: colors.common.white}} className={classes.link}>Home</Link>
        </Typography>
        <Typography variant="h6">
            <Link href="/dummy" style={{color: colors.common.white}} className={classes.link}>Dummy page</Link>
        </Typography>
        <Typography variant="h6">
            <Link href="/dummyad" style={{color: colors.common.white}} className={classes.link}>Insert stuffs</Link>
        </Typography>
    </Toolbar>
  </AppBar>
 );
}
