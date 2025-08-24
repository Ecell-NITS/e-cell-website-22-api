const { asyncHandler } = require("../../Utils/asyncHandler.js");
const { EventRegistration } = require("../../Models/EventRegistrations.models.js")

const registerEvent = asyncHandler(async (req, res) => {

   if (req.method !== "POST") {
       return res.status(405).json({
           error: "Method not allowed"
       });
   }

   try {
     const { userID, name, email, eventName, eventModule, eventDate, questions} = req.body;

     if (!userID || !name || !email) {
       return res.status(400).json({
         error: "User not logged in"
       });
     }

     if (!eventName || !eventModule || !eventDate) {
       return res.status(400).json({
         error: "Event name, module, and date are required"
       });
     }

     // Check if the user is already registered for the event
     const exist = await EventRegistration.findOne({ userID, email, eventName, eventModule, eventDate });
     if (exist) {
       return res.status(400).json({
         error: "User is already registered for this event"
       });
     }

     if (questions && typeof questions !== 'object') {
       return res.status(400).json({
         error: "Questions must be an object"
       });
     }
     

     const registration = new EventRegistration({
       userID,
       name,
       email,
       eventName,
       eventModule,
       eventDate,
       questions
     });

    

     await registration.save();

     res.status(201).json({
       message: "Event registered successfully",
       registration
     });
   } catch (error) {
    res.json({
        error
    }).status(500)
   }

});


module.exports = {
    registerEvent
};
