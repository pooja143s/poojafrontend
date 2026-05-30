import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { useNavigate } from "react-router-dom";
import { adminDashboard } from "../../services/userService";

export default function Dashboard() {
    const navigate = useNavigate()

    const [totalAlumni, setTotalAlumni] = useState(0)
    const [totalStudent, setTotalStudent] = useState(0)
    const [totalPrograms, setTotalPrograms] = useState(0)
    const [totalTopics, setTotalTopics] = useState(0)
    const [feedback, setFeedback] = useState(0)
    const [enrollments, setEnrollments] = useState(0)
    const [sessions, setSessions] = useState(0)
    const [discussions, setDiscussions] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        setLoading(true)

        adminDashboard()

            .then((res) => {

                if (res.data.success) {

                    setTotalAlumni(res.data.totalAlumni)
                    setTotalStudent(res.data.totalStudent)
                    setTotalPrograms(res.data.totalProgramsAll)
                    setTotalTopics(res.data.totalTopics)
                    setFeedback(res.data.feedbackCount)
                    setEnrollments(res.data.enrollments)
                    setSessions(res.data.sessions)
                    setDiscussions(res.data.discussions)

                    setLoading(false)

                } else {
                    toast.error(res.data.message)
                    setLoading(false)
                }

            })

            .catch((err) => {
                toast.error("Something Went Wrong")
                console.log(err)
                setLoading(false)
            })

    }, [])


    const chartData = [
        { name: "Alumni", value: totalAlumni },
        { name: "Student", value: totalStudent },
        { name: "Programs", value: totalPrograms },
        { name: "Topics", value: totalTopics },
        { name: "Feedback", value: feedback },
        { name: "Enrollments", value: enrollments },
        { name: "Sessions", value: sessions },
        { name: "Discussions", value: discussions }
    ]

    const cardStyle = {
        background: "linear-gradient(135deg,#06bbcc 0%, #06bbcc 51%, #f0fbfc 100%)",
        color: "white",
        borderRadius: "15px",
        padding: "25px",
        cursor: "pointer",
        transition: "0.3s",
        boxShadow: "0px 10px 25px rgba(0,0,0,0.15)"
    };

    return (
        <>
            {/* Loader */}
            {loading && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100vh",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 999999
                }}>
                    <PuffLoader color="#fff" size={80} />
                </div>
            )}
            {/* Header Start */}
            <div className="container-fluid bg-primary py-5 mb-5 page-header">
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 text-center">
                            <h1 className="display-3 text-white animated slideInDown">
                                DASHBOARD
                            </h1>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb justify-content-center">
                                    <li className="breadcrumb-item">
                                        <a className="text-white" href="#">
                                            Home
                                        </a>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <a className="text-white" href="#">
                                            Pages
                                        </a>
                                    </li>
                                    <li
                                        className="breadcrumb-item text-white active"
                                        aria-current="page"
                                    >
                                        About
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            {/* Header End */}
            <section className="feature_part single_feature_padding">

                <div className="container">

                    <h2 className="text-center mb-5">Admin Dashboard</h2>

                    <div className="row">

                        {/* Alumni */}
                        <div className="col-md-3 mb-4">
                            <div style={cardStyle} onClick={() => navigate("/admin/alumni/manage")}>
                                <h5>Total Alumni</h5>
                                <h2>{totalAlumni}</h2>
                            </div>
                        </div>

                        {/* Student */}
                        <div className="col-md-3 mb-4">
                            <div style={cardStyle} onClick={() => navigate("/admin/students/manage")}>
                                <h5>Total Student</h5>
                                <h2>{totalStudent}</h2>
                            </div>
                        </div>

                        {/* Programs */}
                        <div className="col-md-3 mb-4">
                            <div style={cardStyle} onClick={() => navigate("/admin/mentorship")}>
                                <h5>Total Programs</h5>
                                <h2>{totalPrograms}</h2>
                            </div>
                        </div>

                        {/* Topics */}
                        <div className="col-md-3 mb-4">
                            <div style={cardStyle} onClick={() => navigate("/admin/topics/manage")}>
                                <h5>Total Topics</h5>
                                <h2>{totalTopics}</h2>
                            </div>
                        </div>

                        {/* Feedback */}
                        <div className="col-md-3 mb-4">
                            <div style={cardStyle} onClick={() => navigate("/admin/mentorship")}>
                                <h5>Feedback</h5>
                                <h2>{feedback}</h2>
                            </div>
                        </div>

                        {/* Enrollments */}
                        <div className="col-md-3 mb-4">
                            <div style={cardStyle} onClick={() => navigate("/admin/viewenrollments")}>
                                <h5>Enrollments</h5>
                                <h2>{enrollments}</h2>
                            </div>
                        </div>

                        {/* Sessions */}
                        <div className="col-md-3 mb-4">
                            <div style={cardStyle} onClick={() => navigate("/admin/sessions")}>
                                <h5>Sessions</h5>
                                <h2>{sessions}</h2>
                            </div>
                        </div>

                        {/* Discussions */}
                        <div className="col-md-3 mb-4">
                            <div style={cardStyle} onClick={() => navigate("/admin/sessions")}>
                                <h5>Discussions</h5>
                                <h2>{discussions}</h2>
                            </div>
                        </div>
                    </div>


                    {/* Graph Section */}

                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "15px",
                            padding: "30px",
                            marginTop: "40px",
                            boxShadow: "0px 8px 25px rgba(0,0,0,0.1)"
                        }}
                    >

                        <h4 className="mb-4">Dashboard Analytics</h4>

                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#06bbcc" />
                            </BarChart>
                        </ResponsiveContainer>

                    </div>

                </div>

            </section>
        </>
    )
}

