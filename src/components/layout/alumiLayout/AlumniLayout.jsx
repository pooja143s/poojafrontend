import { Outlet, useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { toast } from "react-toastify";
import AlumniHeader from "./AlumniHeader";
import AlumniFooter from "./AlumniFooter";

export default function AlumniLayout() {

    const nav = useNavigate()

    useEffect(() => {
        let userType = localStorage.getItem("userType")
        let token = localStorage.getItem("token")
        if (userType !== '2' || userType !== 2 && !token) {
            toast.error("Unauthorized")
            nav("/login")
        }
    }, [])

    return (
        <>
            <AlumniHeader />
            <Outlet />
            <AlumniFooter />
        </>
    )

}