const Typography = MaterialUI;

function Selectors(props) {
    const [available_ads, setAvailable_ads] = useState([]);
    const [available_ad_versions, setAvailable_ad_versions] = useState([]);
    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [selectedEndDate, setSelectedEndDate] = useState("");
    const [open, setOpen] = useState(false);
    const [checkState, setCheckState] = useState({ Android: true, iOS: true, Horizontal: true, Vertical: true });

    const { Android, iOS, Horizontal, Vertical } = checkState;
    const classes = useStyles();
    function handleCheckChange(event) {
        setCheckState({ ...checkState, [event.target.name]: event.target.checked });
    }

    // Filter handlers
    function handleStartDateChange(date) {
        setSelectedStartDate(date.target.value.toString());
    }

    function handleEndDateChange(date) {
        setSelectedEndDate(date.target.value.toString());
    }

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    const versionChanged = props.version_changed;
    const getData = props.get_data;
    const saveGraph = props.save_graph;

    // Show filters that are used currently
    /////////////////////////////////////////////////////////////////////////////
    function showFilters(selectedEndDate, selectedStartDate, checkState) {
        var dateFilters = "";
        var otherFilters = "";
        if (selectedStartDate && selectedEndDate) {
            var startDate = selectedStartDate.toString().split("-");
            var stopDate = selectedEndDate.toString().split("-");
            dateFilters = startDate[2] + "/" + startDate[1] + "/" + startDate[0] + " - " + stopDate[2] + "/" + stopDate[1] + "/" + stopDate[0];
        }
        for (var i in checkState) {
            if (checkState[i] === true) {
                otherFilters = otherFilters.concat(i, ";");
            }
        }
        return { dateFilters, otherFilters };
    }

    /////////////////////////////////////////////////////////////////////////////
    const { dateFilters, otherFilters } = showFilters(selectedEndDate, selectedStartDate, checkState);

    function getAds() {
        // some API call to get a list of ads
        let ad_list;
        axios.get("/api/ad").then(function (response) {
            ad_list = response.data.data;
            setAvailable_ads(ad_list);
        });
    }

    function getAdVersions() {
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
        getAds();
    }, []);

    return (
        <Grid container >

            <Grid item xs={6}>
                <FormControl style={{ marginLeft: "2%" }} className={classes.formControl}>
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
                    <NativeSelect id={props.version_selector_id} defaultValue="" onChange={() => versionChanged(available_ad_versions[event.target.selectedIndex - 1]._id)}>
                        <option aria-label="None" value="" disabled />
                        {available_ad_versions.map((object, index) => (
                            <option key={index} value={object.version_name}>
                                {object.version_name}
                            </option>
                        ))}
                    </NativeSelect>
                </FormControl>
                <Grid container>
                    <Grid item xs={2}>
                        <Tooltip
                            disableFocusListener
                            disableTouchListener
                            title="Update graph"
                        >
                            <Fab style={{ color: colors.common.white, backgroundColor: colors.blue[400], fontSize: 40 }} className={classes.fab} onClick={() => getData(checkState, selectedStartDate, selectedEndDate)}>
                                <Icon >
                                    sync
                            </Icon>
                            </Fab>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={2}>
                        <Tooltip
                            disableFocusListener
                            disableTouchListener
                            title="Save graph"
                        >
                            <Fab style={{ color: colors.common.white, backgroundColor: colors.blue[400], fontSize: 40 }} className={classes.fab} onClick={() => saveGraph(checkState)}>
                                <Icon >
                                    save
                            </Icon>
                            </Fab>
                        </Tooltip></Grid>
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
                                    <TextField onChange={handleStartDateChange} className={classes.textField}
                                        id="date-start"
                                        label="Start"
                                        type="date"
                                        value={selectedStartDate}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    />
                                    <TextField onChange={handleEndDateChange} className={classes.textField}
                                        id="date-end"
                                        label="End"
                                        type="date"
                                        value={selectedEndDate}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    />
                                </form>
                                <Box mt={1}>
                                    <FormLabel component="legend">OS</FormLabel>
                                </Box>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox checked={Android} onChange={handleCheckChange} name="Android" />}
                                        label="Android"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={iOS} onChange={handleCheckChange} name="iOS" />}
                                        label="iOS"
                                    />
                                </FormGroup>
                                <Box mt={1}>
                                    <FormLabel component="legend">Orientation</FormLabel>
                                </Box>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox checked={Horizontal} onChange={handleCheckChange} name="Horizontal" />}
                                        label="Horizontal"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={Vertical} onChange={handleCheckChange} name="Vertical" />}
                                        label="Vertical"
                                    />
                                </FormGroup>

                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button onClick={handleClose}>
                                    Ok
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </FormControl>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <p style={{ marginBottom: "2px", marginLeft: "2%" }}><b>Filters:</b> {dateFilters}</p>
            </Grid>
            <Grid item xs={12}>
                <p style={{ marginTop: "2px", marginLeft: "2%" }}>{otherFilters}</p>
            </Grid>
        </Grid>
    );
}