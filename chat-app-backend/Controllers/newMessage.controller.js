import Conversations from "../Models/conversations.js";
import Messages from "../Models/messages.js";

const newMessageController = async (req, res) => {
    const { recieverID } = req.params;
    const { _id: senderID } = req.user;
    const { message } = req.body;

    if (message) {
        try {
            let conversations = await Conversations.findOne({ usergroup: { $all: [senderID, recieverID] } });

            if (!conversations) {
                conversations = new Conversations({
                    usergroup: [senderID, recieverID],
                })
            }

            const newMessasge = new Messages({
                senderID,
                recieverID,
                messageText: message,
            });

            if (newMessasge) {
                conversations.messages.push(newMessasge._id);
            }

            await Promise.all([newMessasge.save(), conversations.save()])

            res.status(201).send(newMessasge);
        } catch (e) {
            res.status(400).send({ isError: true, error: 'Error in new message controllers' });
        }
    } else {
        res.status(400).send({ isError: true, error: 'Invalid message' });
    }
};

export default newMessageController;