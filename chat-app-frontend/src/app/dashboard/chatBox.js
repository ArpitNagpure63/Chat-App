import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import moment from 'moment';
import { getAllMessages, sendNewMessage } from "../redux/slice/messagesSlice";
import Skeleton from "../components/skeleton";

const ChatBox = () => {
    const [message, setMessage] = useState('');
    const { onGoingUserChat, chats, isMessageSending, isLoading } = useSelector(state => state.message);
    const { userInfo } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const chatBoxRef = useRef(null);

    const handleSendMessge = () => {
        const recieverID = onGoingUserChat?._id;
        if (message) dispatch(sendNewMessage({ message, recieverID }));
    };

    const handleInputMessage = (e) => {
        if (e.key === 'Enter') {
            handleSendMessge();
        }
    }

    const scrollToBottom = () => {
        chatBoxRef?.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const recieverID = onGoingUserChat?._id;
        if (recieverID) {
            dispatch(getAllMessages({ recieverID }));
        }
    }, [onGoingUserChat]);

    useEffect(() => {
        setMessage('');
        scrollToBottom();
    }, [chats]);

    return <div className="px-4 chat-box-wrapper">
        {
            onGoingUserChat ? <>
                <div className="my-3 overflow-hidden overflow-y-scroll no-scrollbar chat-window">
                    {
                        chats.length ?
                            isLoading
                                ? <Skeleton />
                                : chats.map((item, index) => {
                                    return <div key={index} className="cursor-pointer m-2">
                                        {
                                            item.senderID === onGoingUserChat._id
                                                ? <div className="chat chat-start">
                                                    <div className="chat-image avatar">
                                                        <div className="w-10 rounded-full">
                                                            <Image src={onGoingUserChat.profilepic} alt='profile pic' width={100} height={100} />
                                                        </div>
                                                    </div>
                                                    <div className="chat-header">
                                                        {onGoingUserChat.name}
                                                        <time className="text-xs opacity-50 ml-2">{moment(item.createdAt).startOf('seconds').fromNow()}</time>
                                                    </div>
                                                    <div className="chat-bubble">{item.messageText}</div>
                                                </div>
                                                :
                                                <div className="chat chat-end">
                                                    <div className="chat-image avatar">
                                                        <div className="w-10 rounded-full">
                                                            <Image src={userInfo.profilepic} alt='profile pic' width={100} height={100} />
                                                        </div>
                                                    </div>
                                                    <div className="chat-header">
                                                        <time className="text-xs opacity-50">{moment(item.createdAt).startOf('seconds').fromNow()}</time>
                                                    </div>
                                                    <div className="chat-bubble">{item.messageText}</div>
                                                </div>
                                        }
                                    </div>
                                })
                            :
                            <div className="h-full form-control justify-center items-center">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="h-20 w-20"
                                >
                                    <path d="M16 2H8C4.691 2 2 4.691 2 8v12a1 1 0 001 1h13c3.309 0 6-2.691 6-6V8c0-3.309-2.691-6-6-6zm4 13c0 2.206-1.794 4-4 4H4V8c0-2.206 1.794-4 4-4h8c2.206 0 4 1.794 4 4v7z" />
                                    <path d="M11 11.5 A1.5 1.5 0 0 1 9.5 13 A1.5 1.5 0 0 1 8 11.5 A1.5 1.5 0 0 1 11 11.5 z" />
                                    <path d="M16 11.5 A1.5 1.5 0 0 1 14.5 13 A1.5 1.5 0 0 1 13 11.5 A1.5 1.5 0 0 1 16 11.5 z" />
                                </svg>
                                <div className="text-2xl text-center mt-3">{`Say Hello To ${onGoingUserChat?.name} !`}</div>
                            </div>
                    }
                    <div ref={chatBoxRef} />
                </div>
                <label className="input input-bordered flex items-center gap-2">
                    <input
                        type="text"
                        className="grow"
                        placeholder="Say hello"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleInputMessage}
                    />
                    {isMessageSending
                        ? <span className="loading loading-dots loading-md"></span>
                        : <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            onClick={handleSendMessge}
                        >
                            <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
                        </svg>}
                </label>
            </>
                : <div className="h-full form-control justify-center items-center">
                    <div className="text-2xl text-center">{`Welcome ${userInfo?.name} to the new Chat App`}</div>
                    <div className="mt-4 flex justify-center text-center text-sm">Catch up with all your direct messages, group chats and spaces - all in one place</div>
                </div>
        }
    </div>
};

export default ChatBox;