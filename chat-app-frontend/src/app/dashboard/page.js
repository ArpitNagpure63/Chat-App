'use client';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getOtherUsers, logoutUser, resetErrorState, setUserAuthState } from "../redux/slice/userSlice";
import { getUserConversation, resetConversation } from "../redux/slice/messagesSlice";
import Alert from "../components/alertToast";
import Logout from "../components/logoutButton";
import Loader from "../components/loader";
import ThemeProvider from "../components/themeSelector";
import ChatSearchBox from "./chatSearchBox";
import ChatBox from "./chatBox";
import './dashboard.css';

const Dashboard = () => {
    const { userAuthenticated, isError, errorMessage, isLoading } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const history = useRouter();

    const handleLogoutClick = () => {
        sessionStorage.removeItem('loggedInUser');
        dispatch(resetConversation());
        dispatch(logoutUser());
    };

    useEffect(() => {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (userAuthenticated) {
            dispatch(getOtherUsers());
            dispatch(getUserConversation());
        } else if (loggedInUser?._id) {
            dispatch(setUserAuthState(loggedInUser));
        } else {
            history.push('/login');
        }
    }, [userAuthenticated]);

    return <div className="flex justify-center items-center h-screen overflow-hidden">
        <div className="card card-side bg-base-300 shadow-xl p-4 h-4/5">
            <ChatSearchBox />
            <ChatBox />
        </div>
        <ThemeProvider />
        <Alert isAlertVisible={isError} alertText={errorMessage} clickHandler={() => dispatch(resetErrorState())} />
        <Logout handleLogoutClick={handleLogoutClick} />
        <Loader showLoader={isLoading} />
    </div>
};

export default Dashboard;