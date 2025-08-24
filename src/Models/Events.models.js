const mongoose = require("mongoose");

const eventsSchema = new mongoose.Schema({
    moduleName: {
        type: String,
        required: true,
        index: true
    },
    eventName: {
        type: String,
        required: true,
        index: true
    },
    eventDate: {
        type: String,
        required: true,
    },
    eventPoster: {
        type: String,
        required: true,
    },
    organizers: {
        type: String,
    },
    venue: {
        type: String,
        required: true,
    },
    eventDetails: {
        type: String,
        required: true,
    },
    //questions are optional
    questions: {
        type: [String],
        default: [],
    }
}, { timestamps: true }
)

const Events = mongoose.model(("Events"), eventsSchema)
module.exports={
    Events
}