import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMessages, sendNewMessage } from "../redux/slice/messagesSlice";

const ChatBox = () => {
    const [message, setMessage] = useState('');
    const { onGoingUserChat } = useSelector(state => state.message);
    const dispatch = useDispatch();

    const handleSendMessge = () => {
        const recieverID = onGoingUserChat?._id;
        if (message) dispatch(sendNewMessage({ message, recieverID }));
    };

    useEffect(() => {
        const recieverID = onGoingUserChat?._id;
        if (recieverID) {
            dispatch(getAllMessages({ recieverID }));
        }
    }, [onGoingUserChat]);

    return <div className="px-4 chat-box-wrapper">
        {
            onGoingUserChat ? <>
                <div className="my-3 overflow-hidden overflow-y-scroll no-scrollbar chat-window">
                    <div className="chat chat-start">
                        <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                                <img alt="Tailwind CSS chat bubble component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                            </div>
                        </div>
                        <div className="chat-header">
                            Obi-Wan Kenobi
                            <time className="text-xs opacity-50">12:45</time>
                        </div>
                        <div className="chat-bubble">You were the Chosen One!</div>
                    </div>
                    <div className="chat chat-end">
                        <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                                <img alt="Tailwind CSS chat bubble component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                            </div>
                        </div>
                        <div className="chat-header">
                            Obi-Wan Kenobi
                            <time className="text-xs opacity-50">12:45</time>
                        </div>
                        <div className="chat-bubble">You were the Chosen One!</div>
                    </div>
                </div>
                <label className="input input-bordered flex items-center gap-2">
                    <input
                        type="text"
                        className="grow"
                        placeholder="Say hello"
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        onClick={handleSendMessge}
                    >
                        <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
                    </svg>
                </label>
            </>
                : <div className="h-full form-control justify-center items-center">
                    <div className="text-2xl">Welcome to the new Chat</div>
                    <div className="mt-4 flex justify-center text-center text-sm">Catch up with all your direct messages, group chats and spaces - all in one place</div>
                </div>
        }
    </div>
};

export default ChatBox;