const express = require("express");
const router = express.Router();
const {
  getAds,
  addAd,
  insertAd,
  getEvent,
  addEvent,
  getSession,
  insertSession,
  addSession,
  getSessionPercentage,
  getVersion,
  insertVersion,
  addVersion,
  getCompleted,
  getTotals,
  funs,
  sankey,
  funs_aggregate,
  dummyEvents,
} = require("../controllers/db.man.js");

router.route("/ad").get(getAds).post(addAd);
router.route("/insert/ad").post(insertAd);
router.route("/event").get(getEvent).post(addEvent);
router.route("/session").get(getSession).post(addSession);
router.route("/session/percentage").post(getSessionPercentage);
router.route("/insert/session").post(insertSession);
router.route("/version").get(getVersion).post(addVersion);
router.route("/insert/version").post(insertVersion);
router.route("/completed").get(getCompleted);
router.route("/totals").get(getTotals);
router.route("/funnel").post(funs);
router.route("/funnelalt").post(funs_aggregate);
router.route("/sankey").post(sankey);
router.route("/dummyevents").post(dummyEvents);

module.exports = router;
