'use client';
import { useEffect, useState } from "react";
import ThemeProvider from "../components/themeSelector";
import { useDispatch, useSelector } from "react-redux";
import { getOtherUsers, resetErrorState, setErrorMessage, setErrorState } from "../redux/slice/userSlice";
import Alert from "../components/alertToast";
import { useRouter } from "next/navigation";
import { setNewConversation } from "../redux/slice/messagesSlice";
import { xorBy } from "lodash";
import Image from "next/image";
import Logout from "../components/logoutButton";

const Dashboard = () => {
    const [userSearchInput, setUserSearchInput] = useState('');
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [searchError, setSearchError] = useState(false);
    const { userAuthenticated, otherUsers, isError, errorMessage } = useSelector(state => state.user);
    const { conversations } = useSelector(state => state.message);
    const dispatch = useDispatch();
    const history = useRouter();

    const handleInputChange = (e) => {
        const inputValue = e.target.value.toLowerCase();
        setUserSearchInput(inputValue);
        if (otherUsers.length) {
            const newUsers = [];
            if (inputValue) {
                for (let item of otherUsers) {
                    if (item.name.toLowerCase().includes(inputValue)) {
                        newUsers.push(item);
                    }
                }
            }
            const remainingUsers = newUsers.length ? xorBy(newUsers, conversations, '_id') : [];
            setSearchError(!remainingUsers.length);
            setSearchedUsers([...remainingUsers]);
        } else {
            dispatch(setErrorState());
            dispatch(setErrorMessage('Not able to find any user at this moment, Please try again after some time'));
        }
    };

    const handleSearchedUserClick = (selectedUser) => {
        setSearchedUsers([]);
        setUserSearchInput('');
        dispatch(setNewConversation(selectedUser));
    };

    const handleTextErrorState = () => {
        if (searchError) setSearchError(false);
    }

    useEffect(() => {
        // if (userAuthenticated) {
        dispatch(getOtherUsers());
        // } else {
        //     history.push('/login');
        // }
    }, []);

    return <div className="flex justify-center items-center h-screen overflow-hidden" onClick={handleTextErrorState}>
        <div className="card card-side bg-base-300 shadow-xl p-4 h-4/5">
            <div className="flex flex-col">
                <label className="form-control">
                    <div className="label">
                        {searchError && <span className="label-text-alt text-red-400">User not found</span>}
                    </div>
                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            type="text"
                            className="grow"
                            placeholder="Search Your Friends"
                            value={userSearchInput}
                            onChange={handleInputChange} />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4 opacity-70" viewBox="0 0 50 50">
                            <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
                        </svg>
                    </label>
                </label>
                <div className="flex flex-col w-full bg-gray-400 shadow-xl m-1 absolute z-10 rounded-md cursor-pointer search-box">
                    {
                        searchedUsers.map((item, index) => {
                            return <div className="flex items-center p-2 h-12 text-black hover:bg-gray-700" key={index} onClick={() => handleSearchedUserClick(item)}>
                                <div className="avatar">
                                    <div className="w-8 rounded-full">
                                        <Image src={item.profilepic} width={100} height={100} />
                                    </div>
                                </div>
                                <div className="ml-3"> {item.name}</div>
                            </div>
                        })
                    }
                </div>
                <div className="flex flex-col mt-4 shadow-xl rounded-md cursor-pointer">
                    {
                        conversations.map((item, index) => {
                            return <div className="flex items-center p-2 pl-3 h-14 my-px rounded-md bg-base-100 hover:bg-blue-800" key={index}>
                                <div className="avatar">
                                    <div className="w-8 rounded-full">
                                        <Image src={item.profilepic} width={100} height={100} />
                                    </div>
                                </div>
                                <div className="ml-3"> {item.name}</div>
                            </div>
                        })
                    }
                </div>
            </div>
            {/* <div className="card-body">
            </div> */}
        </div>
        <ThemeProvider />
        <Alert isAlertVisible={isError} alertText={errorMessage} clickHandler={() => dispatch(resetErrorState())} />
        <Logout />
    </div>
};

export default Dashboard;