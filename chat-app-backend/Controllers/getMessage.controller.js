import Conversations from "../Models/conversations.js";
import Messages from "../Models/messages.js";

const getMessageController = async (req, res) => {
    const { recieverID } = req.params;
    const { _id: senderID } = req.user;

    if (recieverID) {
        try {
            // Alternate Way
            // const messages = await Messages.find({ recieverID });

            const conversations = await Conversations.findOne({ usergroup: { $all: [senderID, recieverID] } }).populate('messages');

            if (!conversations) return res.status(200).send([]);

            res.status(200).send(conversations.messages);
        } catch (e) {
            res.status(400).send({ isError: true, error: 'Error in get message controllers' });
        }
    } else {
        res.status(400).send({ isError: true, error: 'Invalid Reciever ID' });
    }
};

export default getMessageController;