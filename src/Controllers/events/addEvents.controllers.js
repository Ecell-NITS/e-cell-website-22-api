const { asyncHandler } = require("../../Utils/asyncHandler.js");
const { Events } = require("../../Models/Events.models.js")

const addEvents = asyncHandler(async (req, res, next) => {

   if (req.method !== "POST") {
       return res.status(405).json({
           error: "Method not allowed"
       });
   }

   try {
    const { moduleName, eventName, eventDate, eventPoster, organizers, venue, eventDetails, questions } = req.body;

    if (!moduleName || !eventDate || !eventPoster || !organizers || !eventName || !venue || !eventDetails) {
        return res.status(400).json({
            error: "All fields are required."
        });

    }

    if (questions) {
        if (!Array.isArray(questions)) {
       return res.status(400).json({
           error: "Questions must be an array and cannot be empty."
       });
   }
    }

    const existedEvent = await Events.findOne({ eventName });

    if(existedEvent){
        return res.status(409).json({
            error: "Event already registered!"
        });
    }

    const newEvent = await Events.create({
        moduleName,
        eventDate,
        eventPoster,
        organizers,
        eventName,
        venue,
        eventDetails,
        //question is optional
        questions
    })

    return res.status(201).json(
        {
            msg:"Event added successfully.",
            data:newEvent
        }
    );

   } catch (error) {
    res.json({
        error
    }).status(500)
   }

});

const allEvents = asyncHandler(async (req, res) => {

    const events = await Events.find();

    return res.status(200).json(
        {
            msg:"Ok!",
            data:events
        }
    );
});

module.exports = {
    addEvents,
    allEvents,
};
