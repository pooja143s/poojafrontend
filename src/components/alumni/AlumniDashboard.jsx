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
import { alumniDashboard } from "../../services/userService";

export default function AlumniDashboard() {
    const navigate = useNavigate();

    const [totalPrograms, setTotalPrograms] = useState(0);
    const [totalEnrollments, setTotalEnrollments] = useState(0);
    const [totalTopics, setTotalTopics] = useState(0);
    const [totalFeedbacks, setTotalFeedbacks] = useState(0);
    const [totalSessions, setTotalSessions] = useState(0);
    const [totalDiscussions, setTotalDiscussions] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            setLoading(true);

            // ✅ fetch _id correctly
            const userId = localStorage.getItem("_id");

            const res = await alumniDashboard(userId);

            if (res?.data?.success) {
                const d = res.data;

                // ✅ correct state updates
                setTotalPrograms(d.totalProgramsAll || 0);
                setTotalEnrollments(d.enrollments || 0);
                setTotalTopics(d.totalTopics || 0);
                setTotalFeedbacks(d.feedbackCount || 0);
                setTotalSessions(d.totalSessionsAll || 0);
                setTotalDiscussions(d.totalDiscussions || 0);
            } else {
                toast.error(res?.data?.message || "Failed to load dashboard");
            }

        } catch (err) {
            console.error(err);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    const chartData = [
        { name: "Mentorships", value: totalPrograms },
        { name: "Enrollments", value: totalEnrollments },
        { name: "Topics", value: totalTopics },
        { name: "Feedbacks", value: totalFeedbacks },
        { name: "Live Sessions", value: totalSessions },
        { name: "Discussions", value: totalDiscussions }
    ];

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

            {/* Header */}
            <div className="container-fluid bg-primary py-5 mb-5 page-header">
                <div className="container py-5 text-center">
                    <h1 className="display-3 text-white">DASHBOARD</h1>
                </div>
            </div>

            <section className="feature_part single_feature_padding">
                <div className="container">

                    <h2 className="text-center mb-5">Alumni Dashboard</h2>

                    <div className="row">

                        {/* Programs */}
                        <div className="col-md-4 mb-4">
                            <div
                                style={cardStyle}
                                onClick={() => navigate("/alumni/mentorship")}
                            >
                                <h5>Total Mentorships</h5>
                                <h2>{totalPrograms}</h2>
                            </div>
                        </div>

                        {/* Topics */}
                        <div className="col-md-4 mb-4">
                            <div
                                style={cardStyle}
                                onClick={() => navigate("/alumni/topics")}
                            >
                                <h5>Topics</h5>
                                <h2>{totalTopics}</h2>
                            </div>
                        </div>

                        {/* Enrollments */}
                        <div className="col-md-4 mb-4">
                            <div
                                style={cardStyle}
                                onClick={() => navigate("/alumni/enrollments")}
                            >
                                <h5>Enrollments</h5>
                                <h2>{totalEnrollments}</h2>
                            </div>
                        </div>

                        {/* Feedbacks */}
                        <div className="col-md-4 mb-4">
                            <div
                                style={cardStyle}
                                onClick={() => navigate("/alumni/mentorship")}
                            >
                                <h5>Feedbacks</h5>
                                <h2>{totalFeedbacks}</h2>
                            </div>
                        </div>

                        {/* Discussions */}
                        <div className="col-md-4 mb-4">
                            <div
                                style={cardStyle}
                                onClick={() => navigate("/alumni/discussions")}
                            >
                                <h5>Discussions</h5>
                                <h2>{totalDiscussions}</h2>
                            </div>
                        </div>

                        {/* Sessions */}
                        <div className="col-md-4 mb-4">
                            <div
                                style={cardStyle}
                                onClick={() => navigate("/alumni/liveSessions")}
                            >
                                <h5>Live Sessions</h5>
                                <h2>{totalSessions}</h2>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div style={{
                        background: "#fff",
                        borderRadius: "15px",
                        padding: "30px",
                        marginTop: "40px",
                        boxShadow: "0px 8px 25px rgba(0,0,0,0.1)"
                    }}>
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
    );
}