import { Outlet, useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function AdminLayout() {
    const nav = useNavigate()
    useEffect(() => {
        let userType = localStorage.getItem("userType")
        let token = localStorage.getItem("token")
        if (userType !== '1' || userType !== 1 && !token) {
            toast.error("Unauthorized")
            nav("/login")
        }
    }, [])

    return (
        <>
            <AdminHeader />
            <Outlet />
            <AdminFooter></AdminFooter>
        </>
    )

}