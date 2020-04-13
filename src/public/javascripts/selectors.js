const Typography = MaterialUI;

function Selectors(props) {
  const [available_ads, setAvailable_ads] = useState([]);
  const [available_ad_versions, setAvailable_ad_versions] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [start_date_string, setStart_date_string] = useState("");
  const [end_date_string, setEnd_date_string] = useState("");
  const [open, setOpen] = useState(false);
  const [checkState, setCheckState] = useState({
    Android: true,
    iOS: true,
    Horizontal: true,
    Vertical: true,
  });
  const [other_filters, setOther_filters] = useState("");
  const [ad_name, setAd_name] = useState("");
  const [ad_version, setAd_version] = useState("");
  const [expanded, setExpanded] = useState(true);

  const { Android, iOS, Horizontal, Vertical } = checkState;
  const classes = useStyles();
  function handleCheckChange(event) {
    setCheckState({ ...checkState, [event.target.name]: event.target.checked });
  }

  // Filter handlers
  function handleStartDateChange(date) {
    let date_object = new Date(date.target.value);
    setStart_date_string(date_object.toDateString());
    setSelectedStartDate(date.target.value);
  }

  function handleEndDateChange(date) {
    let date_object = new Date(date.target.value);
    setEnd_date_string(date_object.toDateString());
    setSelectedEndDate(date.target.value);
  }

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleExpandClick() {
    setExpanded(!expanded);
  }

  const versionChanged = props.version_changed;
  const getData = props.get_data;

  function getAds() {
    // some API call to get a list of ads
    let ad_list;
    axios.get("/api/ad").then(function (response) {
      ad_list = response.data.data;
      setAvailable_ads(ad_list);
    });
  }

  function getAdVersions() {
    setAd_name(available_ads[event.target.selectedIndex - 1].name);
    let ad_id = available_ads[event.target.selectedIndex - 1]._id;
    // some API call to get a list of ad versions
    let version_list;
    axios
      .get("/api/version", {
        params: {
          ad: ad_id,
        },
      })
      .then(function (response) {
        version_list = response.data.data;
        document.querySelector("#" + props.version_selector_id).value = "";
        setAvailable_ad_versions(version_list);
      });
  }

  useEffect(() => {
    var otherFilters = "";
    for (let [key, value] of Object.entries(checkState)) {
      if (value) {
        otherFilters = otherFilters.concat(key, " ");
      }
    }
    setOther_filters(otherFilters);
  }, [checkState]);

  useEffect(() => {
    getAds();
  }, []);

  return (
    <React.Fragment>
      <CardHeader
        title={ad_name + (ad_version == "" ? "" : " - " + ad_version)}
        subheader={
          (start_date_string == "" ? "" : start_date_string + " - ") +
          end_date_string +
          " " +
          other_filters
        }
        action={
          <IconButton
            className={expanded ? classes.expandOpen : classes.expand}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <Icon>expand_more</Icon>
          </IconButton>
        }
      />

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Grid container>
          <Grid item xs={6}>
            <FormControl
              style={{ marginLeft: "2%" }}
              className={classes.formControl}
            >
              <InputLabel>
                <b>AD Name</b>
              </InputLabel>
              <NativeSelect defaultValue="" onChange={getAdVersions}>
                <option aria-label="None" value="" disabled />
                {available_ads.map((object, index) => (
                  <option key={index} value={object.name}>
                    {object.name}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel>Version</InputLabel>
              <NativeSelect
                id={props.version_selector_id}
                defaultValue=""
                onChange={() => {
                  versionChanged(
                    available_ad_versions[event.target.selectedIndex - 1]._id
                  );
                  setAd_version(
                    available_ad_versions[event.target.selectedIndex - 1]
                      .version_name
                  );
                }}
              >
                <option aria-label="None" value="" disabled />
                {available_ad_versions.map((object, index) => (
                  <option key={index} value={object.version_name}>
                    {object.version_name}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
            <Grid container>
              <Grid item>
                <Tooltip
                  disableFocusListener
                  disableTouchListener
                  title="Update graph"
                >
                  <Fab
                    style={{
                      color: colors.common.white,
                      backgroundColor: colors.blue[400],
                      fontSize: 40,
                    }}
                    className={classes.fab}
                    onClick={() =>
                      getData(checkState, selectedStartDate, selectedEndDate)
                    }
                  >
                    <Icon>sync</Icon>
                  </Fab>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip
                  disableFocusListener
                  disableTouchListener
                  title="Delete graph"
                >
                  <Fab
                    style={{
                      color: colors.common.white,
                      backgroundColor: colors.red[400],
                      fontSize: 40,
                    }}
                    className={classes.fab}
                    onClick={() => props.remove_graph(props.index)}
                  >
                    <Icon>delete_forever</Icon>
                  </Fab>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" justifyContent="flex-end">
              <FormControl className={classes.formControl}>
                <Button onClick={handleClickOpen}>Filters</Button>
                <Dialog disableBackdropClick open={open} onClose={handleClose}>
                  <DialogTitle>Select filters</DialogTitle>
                  <DialogContent>
                    <form>
                      <TextField
                        onChange={handleStartDateChange}
                        className={classes.textField}
                        id="date-start"
                        label="Start"
                        type="date"
                        value={selectedStartDate}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        onChange={handleEndDateChange}
                        className={classes.textField}
                        id="date-end"
                        label="End"
                        type="date"
                        value={selectedEndDate}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </form>
                    <Box mt={1}>
                      <FormLabel component="legend">OS</FormLabel>
                    </Box>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={Android}
                            onChange={handleCheckChange}
                            name="Android"
                          />
                        }
                        label="Android"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={iOS}
                            onChange={handleCheckChange}
                            name="iOS"
                          />
                        }
                        label="iOS"
                      />
                    </FormGroup>
                    <Box mt={1}>
                      <FormLabel component="legend">Orientation</FormLabel>
                    </Box>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={Horizontal}
                            onChange={handleCheckChange}
                            name="Horizontal"
                          />
                        }
                        label="Horizontal"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={Vertical}
                            onChange={handleCheckChange}
                            name="Vertical"
                          />
                        }
                        label="Vertical"
                      />
                    </FormGroup>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Ok</Button>
                  </DialogActions>
                </Dialog>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </Collapse>
    </React.Fragment>
  );
}
