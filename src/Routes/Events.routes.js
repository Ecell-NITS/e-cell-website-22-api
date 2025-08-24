const { Router } = require("express");
const { addEvents, allEvents} = require("../Controllers/events/addEvents.controllers.js");
const { deleteEvents} = require("../Controllers/events/deleteEvents.controllers.js");
const { registerEvent } = require("../Controllers/events/registerEvent.controllers.js");

const router = Router();

//add middlewares here to check if admin later
router.route("/add").post(
    addEvents
);
router.route("/delete").delete(
    deleteEvents
);

router.route("/fetch").get(
    allEvents
);

router.route("/register").post(
    registerEvent
);


module.exports = router;
