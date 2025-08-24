const { asyncHandler } = require("../../Utils/asyncHandler.js");
const { Events } = require("../../Models/Events.models.js")

const deleteEvents = asyncHandler(async (req, res) => {

    if (req.method !== "DELETE") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const { eventId } = req.body;

    if (!eventId) {
        return res.status(400).json({
            error: "Event ID is required."
        });
    }

    const deletedEvent = await Events.findByIdAndDelete(eventId);

    if (!deletedEvent) {
        return res.status(404).json({
            error: "Event not found."
        });
    }

    return res.status(200).json({
        msg: "Event deleted successfully.",
        data: deletedEvent
    });
    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

module.exports = {
    deleteEvents
};