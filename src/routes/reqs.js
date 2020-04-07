const express = require('express');
const router = express.Router();
const {getAds,addAd,getEvent, addEvent, getSession, addSession, addVersion, getVersion, getCompleted, getTotals,funs} = require('../controllers/db.man.js');

router.
    route('/ad')
    .get(getAds)
    .post(addAd)
router.
    route('/event')
    .get(getEvent)
    .post(addEvent)
router.
    route('/session')
    .get(getSession)
    .post(addSession)
router.
    route('/version')
    .get(getVersion)
    .post(addVersion)
router.
    route('/completed')
    .get(getCompleted)
router.
    route('/totals')
    .get(getTotals)
router.
    route('/funnel')
    .get(funs)
    

       
module.exports = router;

