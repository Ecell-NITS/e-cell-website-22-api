const mongoose = require("mongoose");

const eventsRegistraionSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },  
    eventName: {
        type: String,
        required: true
    },
    eventModule:{
        type: String,
        required: true
    },
    eventDate:{
        type: String,
        required: true
    },
    questions: {
        //This has to be an object with questions as key and answer as value
        type: Object,
        default: {},
    },
        registrationDate: {
        type: Date,
        default: Date.now
    },
});

const EventRegistration = mongoose.model("EventRegistration", eventsRegistraionSchema);

module.exports = {
    EventRegistration
};
