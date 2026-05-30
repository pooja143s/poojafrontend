import { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import 'react-responsive-pagination/themes/classic-light-dark.css';
import { allMentorships } from "../../../services/mentorshipService";
import { Link, useParams } from "react-router-dom";
import { addEnrollment } from "../../../services/enrollmentService";

export default function ViewMentorShip() {

    const { alumniId } = useParams();

    const [search, setSearch] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [mentorships, setMentorships] = useState([]);
    useEffect(() => {
        getAllTopics();
    }, []);
    const getAllTopics = () => {
        setLoading(true);
        let payload = {
            isBlocked: false,
            isDeleted: false,
            status: true,
        }
        if (alumniId === "null" || alumniId === "undefined" || alumniId === null || alumniId === undefined) {
            payload.alumniId = undefined;
        } else {
            payload.alumniId = alumniId;
        }

        if (search && search !== "") {
            payload.search = search.trim();
        }
        allMentorships(payload).then((res) => {
            if (res.data.success) {
                setLoading(false);
                setMentorships(res.data.data);
            } else {
                setLoading(false);
                toast.error(res.data.message);
            }
        }).catch((err) => {
            setLoading(false);
            console.log(err);
            toast.error(err.response?.data?.message || err.message);
        })
    };

    const hitSearch = () => {
        getAllTopics();
    }

    const handleEnroll = (mentorshipId) => {
        const token = localStorage.getItem("token");
        const studentId = localStorage.getItem("studentId");
        if (!token) {
            toast.error("Please login first to enroll.");
            return;
        }
        setLoading(true);
        const payload = {
            mentorshipId: mentorshipId,
            studentId: studentId
        };
        addEnrollment(payload).then((res) => {
            setLoading(false);
            if (res.data.success) {
                toast.success(res.data.message);
                getAllTopics();
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            setLoading(false);
            console.log(err);
            toast.error(err.response?.data?.message || err.message);
        });
    };

    return (
        <>
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
            <div className="container-fluid bg-primary page-header">
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 text-center">
                            <h1 className="display-3 text-white animated slideInDown">
                                Mentorships
                            </h1>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb justify-content-center">
                                    <li className="breadcrumb-item">
                                        <a className="text-white" href="#">
                                            Dashboard
                                        </a>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <a className="text-white" href="#">
                                            Mentorships
                                        </a>
                                    </li>

                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>


            <div className="container-xxl">
                <div className="container">
                    <div className="row my-3">
                        <div className="col-12 d-flex justify-content-end">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    hitSearch();
                                }}
                                style={{ width: "100%", maxWidth: "350px" }}
                            >
                                <div className="input-group shadow-sm">
                                    <input
                                        type="text"
                                        className="form-control border-end-0"
                                        placeholder="Search Alumni..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <button type="submit" className="input-group-text bg-white border-start-0">
                                        <i className="bi bi-search"></i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                        <h6 className="section-title bg-white text-center text-primary px-3">
                            Mentorship Program
                        </h6>
                        <h1 className="mb-5">Explore Mentorship Opportunities</h1>
                    </div>
                    <div className="row g-4 ">
                        {
                            mentorships.length > 0 ? (
                                mentorships.map((mentorship, index) => (
                                    <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s" key={index}>
                                        <div className="course-item bg-light">
                                            {/* Top Buttons (no image now) */}
                                            <div className="d-flex justify-content-center pt-3">
                                                <button className="btn btn-sm btn-primary px-3"
                                                    style={{ borderRadius: "30px" }}
                                                    onClick={() => handleEnroll(mentorship._id)}
                                                >
                                                    Enroll Now
                                                </button>
                                            </div>
                                            {/* Content */}
                                            <div className="text-center p-4">

                                                {/* Slots */}
                                                <h3 className="mb-0">
                                                    {mentorship.availableSlots} Slots
                                                </h3>

                                                {/* Date + Time */}
                                                <div className="mb-3">
                                                    <small className="text-muted">
                                                        {mentorship.sessionDate
                                                            ? new Date(mentorship.sessionDate).toLocaleDateString("en-GB", {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                            })
                                                            : "-"}
                                                    </small>
                                                    <br />
                                                    <small className="text-primary">
                                                        {mentorship.sessionTime || "Time N/A"}
                                                    </small>
                                                </div>

                                                {/* Title */}
                                                <h5>{mentorship.title}</h5>

                                                {/* Description */}
                                                <small
                                                    className="my-1"
                                                    data-bs-toggle="tooltip"
                                                    title={mentorship.description || "-"}
                                                >
                                                    {mentorship.description
                                                        ? mentorship.description.slice(0, 15) + "..."
                                                        : "-"}
                                                </small>
                                            </div>

                                            {/* Bottom Row */}
                                            <div className="d-flex align-items-center border-top">

                                                {/* Alumni */}
                                                <small className="flex-fill text-center border-end py-2">
                                                    <i className="fa fa-user-tie text-primary me-2" />
                                                    <div>
                                                        {mentorship.alumniId?.name}
                                                        <br />
                                                        <small className="text-muted">
                                                            {mentorship.alumniId?.email}
                                                        </small>
                                                    </div>
                                                </small>

                                                {/* Duration */}
                                                <small className="flex-fill text-center border-end py-2">
                                                    <i className="fa fa-clock text-primary me-2" />
                                                    {mentorship.duration || "-"}
                                                </small>

                                                {/* Max */}
                                                <small className="flex-fill text-center py-2">
                                                    <i className="fa fa-user text-primary me-2" />
                                                    {mentorship.maxParticipants} Max
                                                </small>

                                            </div>

                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="container-xxl py-5 text-center">
                                    No mentorship programs found.
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>



        </>
    )
}

