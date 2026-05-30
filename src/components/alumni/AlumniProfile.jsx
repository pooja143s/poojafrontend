import { useEffect, useState } from "react";
import { AlumniChangePassword, alumniProfile, UpdateAlumniProfile } from "../../services/userService";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import ReactModal from "react-modal";

const modalStyle = {
    content: {
        width: '50%',
        margin: 'auto',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        padding: 20,
        border: 'none',
        borderRadius: '8px',
        maxHeight: '90vh',
        overflow: 'auto',
        zIndex: 100000,
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100001,
    }
};

export default function AlumniProfile() {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState("");

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [bio, setBio] = useState("");
    const [graduationYear, setGraduationYear] = useState("");
    const [currentJob, setCurrentJob] = useState("");
    const [company, setCompany] = useState("");
    const [experience, setExperience] = useState("");
    const [gender, setGender] = useState("");
    const [expertise, setExpertise] = useState([]);
    const [modalType, setModalType] = useState(""); // "edit" | "password"
    const [modalOpen, setModalOpen] = useState(false);

    // password fields
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = () => {
        setLoading(true);
        let payload = {
            _id: localStorage.getItem("alumniId"),
        }
        alumniProfile(payload).then((res) => {
            if (res.data.success) {
                setLoading(false);
                setProfile(res.data.data);
                setName(res.data.data.name);
                setPhone(res.data.data.phone);
                setProfileImage(res.data.data.profileImage);
                setBio(res.data.data.bio);
                setGraduationYear(res.data.data.graduationYear);
                setCurrentJob(res.data.data.currentJob);
                setCompany(res.data.data.company);
                setExperience(res.data.data.experience);
                setGender(res.data.data.gender);
                setExpertise(res.data.data.expertise.join(", "));
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

    const openModal = (type) => {
        setModalType(type);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
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
                                Profile
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
            <section>
                <div className="container py-5">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="card mb-4">
                                <div className="card-body text-center">
                                    <img
                                        src={profile.profileImage}
                                        alt="avatar"
                                        className="rounded-circle img-fluid"
                                        style={{ width: 150, height: 150, objectFit: "cover" }}
                                    />
                                    <h5 className="my-3">{profile.name}</h5>
                                    <p className="text-muted mb-1">{profile.currentJob}</p>

                                    <div className="d-flex justify-content-center mb-2">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => openModal("password")}
                                        >
                                            Change Password
                                        </button>

                                        <button
                                            className="btn btn-outline-primary ms-1"
                                            onClick={() => openModal("edit")}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-lg-8">
                            <div className="card mb-4">
                                <div className="card-body">
                                    {/* Full Name */}
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Full Name</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{profile.name}</p>
                                        </div>
                                    </div>
                                    <hr />

                                    {/* Email */}
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Email</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{profile.email}</p>
                                        </div>
                                    </div>
                                    <hr />

                                    {/* Phone */}
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Phone</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{profile.phone}</p>
                                        </div>
                                    </div>
                                    <hr />

                                    {/* Current Job */}
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Current Job</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{profile.currentJob || "Not provided"}</p>
                                        </div>
                                    </div>
                                    <hr />

                                    {/* Company */}
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Company</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{profile.company || "Not provided"}</p>
                                        </div>
                                    </div>
                                    <hr />

                                    {/* Experience */}
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Experience</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{profile.experience || "Not provided"}</p>
                                        </div>
                                    </div>
                                    <hr />

                                    {/* Expertise */}
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Expertise</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">
                                                {
                                                    profile.expertise && profile.expertise.length > 0
                                                        ? profile.expertise.join(", ")
                                                        : "Not provided"
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <hr />

                                    {/* Graduation Year */}
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Graduation Year</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{profile.graduationYear || "Not provided"}</p>
                                        </div>
                                    </div>
                                    <hr />

                                    {/* Bio */}
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Bio</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{profile.bio || "Not provided"}</p>
                                        </div>
                                    </div>
                                    <hr />

                                    {/* Gender */}
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Gender</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{profile.gender}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ReactModal
                isOpen={modalOpen}
                onRequestClose={closeModal}
                style={modalStyle}
            >
                <div className="container-xxl ">
                    <div className="container">
                        <div className="text-center">

                            {/* TITLE */}
                            <h6 className="section-title bg-white text-center text-primary px-3">
                                {modalType === "edit" ? "Update Profile" : "Change Password"}
                            </h6>
                        </div>
                    </div>

                    {/* ===================== UPDATE PROFILE ===================== */}
                    {modalType === "edit" && (
                        <form onSubmit={async (e) => {
                            e.preventDefault();

                            try {
                                setLoading(true);

                                const formData = new FormData();
                                formData.append("_id", localStorage.getItem("_id")); // ⚠️ IMPORTANT (userId)
                                formData.append("name", name);
                                formData.append("email", profile.email); // required in backend
                                formData.append("phone", phone);
                                formData.append("gender", gender);
                                formData.append("bio", bio);
                                formData.append("graduationYear", graduationYear);
                                formData.append("currentJob", currentJob);
                                formData.append("company", company);
                                formData.append("experience", experience);

                                expertise.split(",").forEach(item => {
                                    if (item.trim()) formData.append("expertise[]", item.trim());
                                });

                                if (profileImage instanceof File) {
                                    formData.append("image", profileImage);
                                }

                                const res = await UpdateAlumniProfile(formData);

                                if (res.data.success) {
                                    toast.success(res.data.message);
                                    closeModal();
                                    getProfile(); // 🔥 refresh UI
                                } else {
                                    toast.error(res.data.message);
                                }

                            } catch (err) {
                                console.log(err);
                                toast.error(err.response?.data?.message || "Update failed");
                            } finally {
                                setLoading(false);
                            }
                        }}>

                            <div className="row g-4">

                                {/* NAME */}
                                <div className="col-md-6">
                                    <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                                </div>

                                {/* PHONE */}
                                <div className="col-md-6">
                                    <input className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
                                </div>

                                {/* GENDER */}
                                <div className="col-md-6">
                                    <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)}>
                                        <option value="">Select Gender</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                {/* GRAD YEAR */}
                                <div className="col-md-6">
                                    <input className="form-control" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} placeholder="Graduation Year" />
                                </div>

                                {/* JOB */}
                                <div className="col-md-6">
                                    <input className="form-control" value={currentJob} onChange={(e) => setCurrentJob(e.target.value)} placeholder="Current Job" />
                                </div>

                                {/* COMPANY */}
                                <div className="col-md-6">
                                    <input className="form-control" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" />
                                </div>

                                {/* EXPERIENCE */}
                                <div className="col-md-6">
                                    <input className="form-control" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Experience" />
                                </div>

                                {/* EXPERTISE */}
                                <div className="col-md-6">
                                    <input className="form-control" value={expertise} onChange={(e) => setExpertise(e.target.value)} placeholder="Expertise (comma separated)" />
                                </div>

                                {/* IMAGE */}
                                <div className="col-md-12">
                                    <input type="file" className="form-control" onChange={(e) => setProfileImage(e.target.files[0])} />
                                </div>

                                {/* BIO */}
                                <div className="col-md-12">
                                    <textarea className="form-control" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" />
                                </div>

                            </div>

                            <div className="d-flex justify-content-end mt-3 gap-2">
                                <button type="button" className="btn btn-danger" onClick={closeModal}>Cancel</button>
                                <button className="btn btn-primary">Update</button>
                            </div>

                        </form>
                    )}

                    {/* ===================== CHANGE PASSWORD ===================== */}
                    {modalType === "password" && (
                        <form onSubmit={async (e) => {
                            e.preventDefault();

                            if (newPassword !== confirmPassword) {
                                return toast.error("Passwords do not match");
                            }

                            try {
                                setLoading(true);

                                const payload = {
                                    _id: localStorage.getItem("_id"),
                                    oldPassword,
                                    newPassword
                                };

                                const res = await AlumniChangePassword(payload);

                                if (res.data.success) {
                                    toast.success(res.data.message);

                                    setOldPassword("");
                                    setNewPassword("");
                                    setConfirmPassword("");

                                    closeModal();
                                } else {
                                    toast.error(res.data.message);
                                }

                            } catch (err) {
                                console.log(err);
                                toast.error(err.response?.data?.message || "Password change failed");
                            } finally {
                                setLoading(false);
                            }
                        }}>

                            <div className="row g-4">

                                <div className="col-md-12">
                                    <input type="password" className="form-control" placeholder="Old Password"
                                        value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                                </div>

                                <div className="col-md-12">
                                    <input type="password" className="form-control" placeholder="New Password"
                                        value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                </div>

                                <div className="col-md-12">
                                    <input type="password" className="form-control" placeholder="Confirm Password"
                                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                </div>

                            </div>

                            <div className="d-flex justify-content-end mt-3 gap-2">
                                <button type="button" className="btn btn-danger" onClick={closeModal}>Cancel</button>
                                <button className="btn btn-primary">Change Password</button>
                            </div>

                        </form>
                    )}

                </div>
            </ReactModal>

        </>
    )
}

