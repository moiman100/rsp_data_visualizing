"use strict";
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
    <Card>
      <Selectors version_changed={getVersionId} get_data={getData} version_selector_id="sankey_version_selector" />
      <Box id="sankey"></Box>
    </Card>
  );
}