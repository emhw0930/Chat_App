import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        const {message} = req.body;
        const {id: receiverID} = req.params;
        const senderID = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderID, receiverID]},
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderID, receiverID],
            });
        }

        const newMessage = new Message({
            senderID,
            receiverID,
            message,
        });

        if (newMessage) {
            conversation.message.push(newMessage._id);
        }

        // Socket IO functionality will go here

        // This will run in parallel
        await Promise.all([conversation.save(), newMessage.save()]);

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const getMessage = async (req, res) => {
    try {
        const {id: userToChatID} = req.params;
        const senderID = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderID, userToChatID]},
        }).populate("message");

        if (!conversation) {
            return res.status(200).json([]);
        }

        const message = conversation.message;

        res.status(200).json(message);

    }

    catch (error) {
        console.log("Error in getMessage controller: ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};