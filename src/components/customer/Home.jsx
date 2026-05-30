import { useEffect, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { aiSuggest } from "../../services/userService"
import { addEnrollment } from "../../services/enrollmentService";
import { toast } from "react-toastify";

function Home() {

    const nav = useNavigate()
    const [programs, setPrograms] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let token = localStorage.getItem("token")
        let userType = localStorage.getItem("userType")
        if (token && userType) {
            if (userType == 1) {
                nav("/admin/dashboard")
            }
            else if (userType == 2) {
                nav("/alumni/dashboard")
            }
            else if (userType == 3) {
                nav("/")
            }
        }

        fetchAISuggestions();
    }, [])


    const fetchAISuggestions = async () => {
        try {
            setAiLoading(true);

            const res = await aiSuggest(); // API call

            if (res.data.success) {
                setPrograms(
                    res.data.data.matchedProgram
                        ? [res.data.data.matchedProgram] // convert object to array
                        : []
                );
                setTrainers(
                    res.data.data.matchedAlumni
                        ? [res.data.data.matchedAlumni]
                        : []
                );
            }
        } catch (err) {
            console.log(err);
        } finally {
            setAiLoading(false);
        }
    };
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
            {/* Carousel Start */}
            <div className="container-fluid p-0 mb-5">
                <div id="carouselExampleCaptions" className="carousel slide">
                    <div className="carousel-indicators">
                        <button
                            type="button"
                            data-bs-target="#carouselExampleCaptions"
                            data-bs-slide-to={0}
                            className="active"
                            aria-current="true"
                            aria-label="Slide 1"
                        />
                        <button
                            type="button"
                            data-bs-target="#carouselExampleCaptions"
                            data-bs-slide-to={1}
                            aria-label="Slide 2"
                        />
                        <button
                            type="button"
                            data-bs-target="#carouselExampleCaptions"
                            data-bs-slide-to={2}
                            aria-label="Slide 3"
                        />
                    </div>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src="img/banner/carousel-5.jpg" className="d-block w-100" alt="..." />
                            <div className="carousel-caption d-none d-md-block">
                                {/* <h5>First slide label</h5>
                                <p>Some representative placeholder content for the first slide.</p> */}
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src="img/banner/carousel-2.jpg" className="d-block w-100" alt="..." />
                            <div className="carousel-caption d-none d-md-block">
                                {/* <h5>Second slide label</h5>
                                <p>Some representative placeholder content for the second slide.</p> */}
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src="img/banner/carousel-4.jpg" className="d-block w-100" alt="..." />
                            <div className="carousel-caption d-none d-md-block">
                                {/* <h5>Third slide label</h5>
                                <p>Some representative placeholder content for the third slide.</p> */}
                            </div>
                        </div>
                    </div>
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon" aria-hidden="true" />
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon" aria-hidden="true" />
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>


            </div>
            {/* Carousel End */}
            {/* Service Start */}
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
                            <div className="service-item text-center pt-3">
                                <div className="p-4">
                                    <i className="fa fa-3x fa-graduation-cap text-primary mb-4" />
                                    <h5 className="mb-3">Skilled Instructors</h5>
                                    <p>
                                        Learn from experienced professionals who guide you with real-world knowledge
                                        and industry best practices.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
                            <div className="service-item text-center pt-3">
                                <div className="p-4">
                                    <i className="fa fa-3x fa-globe text-primary mb-4" />
                                    <h5 className="mb-3">Online Classes</h5>
                                    <p>
                                        Access flexible online sessions anytime, anywhere, designed for modern learners.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
                            <div className="service-item text-center pt-3">
                                <div className="p-4">
                                    <i className="fa fa-3x fa-home text-primary mb-4" />
                                    <h5 className="mb-3">Home Projects</h5>
                                    <p>
                                        Work on practical projects to build hands-on experience and strengthen your portfolio.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.7s">
                            <div className="service-item text-center pt-3">
                                <div className="p-4">
                                    <i className="fa fa-3x fa-book-open text-primary mb-4" />
                                    <h5 className="mb-3">Book Library</h5>
                                    <p>
                                        Explore curated learning resources and materials to support your growth journey.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Service End */}
            {/* About Start */}
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="row g-5">
                        <div
                            className="col-lg-6 wow fadeInUp"
                            data-wow-delay="0.1s"
                            style={{ minHeight: 400 }}
                        >
                            <div className="position-relative h-100">
                                <img
                                    className="img-fluid position-absolute w-100 h-100"
                                    src="img/about.jpg"
                                    alt=""
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                        </div>
                        <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
                            <h6 className="section-title bg-white text-start text-primary pe-3">
                                About Us
                            </h6>
                            <h1 className="mb-4">Welcome to Alumni fy</h1>

                            <p className="mb-4">
                                Alumni fy is a smart learning and networking platform designed to connect
                                students with experienced alumni and industry professionals. Our mission is
                                to bridge the gap between education and real-world skills by providing
                                practical guidance, mentorship, and career-focused learning.
                            </p>

                            <p className="mb-4">
                                We empower students to explore their interests, gain industry insights, and
                                build skills that matter. Through personalized sessions, interactive learning,
                                and expert mentorship, Pathfinder helps you move confidently toward your
                                career goals.
                            </p>
                            <div className="row gy-2 gx-4 mb-4">
                                <div className="col-sm-6">
                                    <p className="mb-0">
                                        <i className="fa fa-arrow-right text-primary me-2" />
                                        Skilled Instructors
                                    </p>
                                </div>
                                <div className="col-sm-6">
                                    <p className="mb-0">
                                        <i className="fa fa-arrow-right text-primary me-2" />
                                        Online Classes
                                    </p>
                                </div>
                                <div className="col-sm-6">
                                    <p className="mb-0">
                                        <i className="fa fa-arrow-right text-primary me-2" />
                                        International Certificate
                                    </p>
                                </div>
                                <div className="col-sm-6">
                                    <p className="mb-0">
                                        <i className="fa fa-arrow-right text-primary me-2" />
                                        Skilled Instructors
                                    </p>
                                </div>
                                <div className="col-sm-6">
                                    <p className="mb-0">
                                        <i className="fa fa-arrow-right text-primary me-2" />
                                        Online Classes
                                    </p>
                                </div>
                                <div className="col-sm-6">
                                    <p className="mb-0">
                                        <i className="fa fa-arrow-right text-primary me-2" />
                                        International Certificate
                                    </p>
                                </div>
                            </div>
                            <a className="btn btn-primary py-3 px-5 mt-2" href="">
                                Read More
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {/* About End */}

            {/* Courses Start */}
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                        <h6 className="section-title bg-white text-center text-primary px-3">
                            Programs
                        </h6>
                        <h1 className="mb-5">Suggested Programs</h1>
                    </div>
                    <div className="row g-4 ">
                        {
                            programs.length > 0 ? (
                                programs.map((mentorship, index) => (
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
            {/* Courses End */}
            {/* Team Start */}
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                        <h6 className="section-title bg-white text-center text-primary px-3">
                            Mentors
                        </h6>
                        <h1 className="mb-5">Suggested Mentors</h1>
                    </div>
                    <div className="row g-4">
                        {aiLoading ? (
                            <h5 className="text-center">Loading Mentors...</h5>
                        ) : trainers.length > 0 ? (
                            trainers.map((alumni, index) => (
                                <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                                    <div className="team-item bg-light">
                                        <div className="overflow-hidden">
                                            <img className="img-fluid" src={alumni.profileImage} alt="" />
                                        </div>
                                        <div
                                            className="position-relative d-flex justify-content-center"
                                            style={{ marginTop: "-23px" }}
                                        >
                                            <div className="bg-light d-flex justify-content-center pt-2 px-2 gap-2 flex-wrap">
                                                <span className="badge bg-primary">Experience : {alumni.experience}</span>
                                            </div>
                                        </div>
                                        <div className="text-center p-4">
                                            <h5 className="mb-0">{alumni.name}</h5>
                                            <small>{alumni.currentJob}</small>
                                        </div>
                                        <div className="d-flex justify-content-center mb-2">
                                            <NavLink to={`/mentorships/${alumni._id}`} className="btn btn-primary mb-2">View Mentorships</NavLink>
                                        </div>
                                    </div>
                                </div>

                            ))
                        ) : (
                            <div className="container-xxl py-5 text-center">
                                No Alumnis found.
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </>

    )
}


export default Home