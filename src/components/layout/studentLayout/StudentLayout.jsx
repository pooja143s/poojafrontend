import { Outlet } from "react-router-dom";
import CustomerHeader from "./StudentHeader";
import CustomerFooter from "./StudentFooter";
import AiChatbot from "../../student/chatbot/AiChatbot";


export default function StudentLayout() {

    return (
        <>
            <CustomerHeader />
            <Outlet />
            <CustomerFooter />
            
            <AiChatbot/>
        </>
    )

}