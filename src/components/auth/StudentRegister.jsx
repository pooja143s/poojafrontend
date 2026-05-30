import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import { studentRegister } from "../../services/userService";
import { PuffLoader } from "react-spinners";


export default function StudentRegister() {

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [gender, setGender] = useState('')
    const [password, setPassword] = useState('')
    const [address, setAddress] = useState('')
    const [bio, setBio] = useState("");
    const [educationLevel, setEducationLevel] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    const [touched, setTouched] = useState({
        name: false,
        email: false,
        phone: false,
        gender: false,
        educationLevel: false,
        password: false,
        address: false,
    });

    const nav = useNavigate()
    const submit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setLoading(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("gender", gender);
        formData.append("address", address);
        formData.append("bio", bio);
        formData.append("educationLevel", educationLevel);
        if (profileImage) {
            formData.append("profileImage", profileImage);
        }
        studentRegister(formData)
            .then((res) => {
                setLoading(false);
                if (res.data.success) {
                    toast.success(res.data.message);
                    nav("/login");
                } else {
                    setLoading(false);
                    toast.error(res.data.message);
                }
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
                toast.error("Something went wrong");
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
                    zIndex: 9999
                }}>
                    <PuffLoader color="#fff" size={80} />
                </div>
            )}
            {/* Header Start */}
            <div className="container-fluid bg-primary  page-header">
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 text-center">
                            <h2 className="text-white animated slideInDown">Register</h2>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb justify-content-center">
                                    <li className="breadcrumb-item">
                                        <a className="text-white" href="#">
                                            Home
                                        </a>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <a className="text-white" href="#">
                                            Register
                                        </a>
                                    </li>

                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            {/* Header End */}
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                        <h6 className="section-title bg-white text-center text-primary px-3">
                            Register as Student
                        </h6>

                    </div>
                    <div className="row g-4 justify-content-center">
                        <div className="col-lg-10">
                            <form onSubmit={submit}>
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={name}
                                                placeholder="Enter full name"
                                                onChange={(e) => setName(e.target.value)}
                                                onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                                            />
                                            <label>Full Name</label>
                                            {(submitted || touched.name) && name === '' ? <small className="text-danger">Name is required</small> : null}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-floating">
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={email}
                                                placeholder="Enter email"
                                                onChange={(e) => setEmail(e.target.value)}
                                                onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                                            />
                                            <label>Email</label>
                                            {(submitted || touched.email) && email === '' ? <small className="text-danger">Email is required</small> : null}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-floating">
                                            <input
                                                type="tel"
                                                className="form-control"
                                                value={phone}
                                                placeholder="Enter phone"
                                                maxLength={10}
                                                onChange={(e) => setPhone(e.target.value)}
                                                onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                                            />
                                            <label>Phone</label>
                                            {(submitted || touched.phone) && phone.length !== 10 ? <small className="text-danger">Phone must be 10 digits</small> : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="row g-3 mt-1">
                                    <div className="col-md-4">
                                        <div className="form-floating">
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={password}
                                                placeholder="Create password"
                                                onChange={(e) => setPassword(e.target.value)}
                                                onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                                            />
                                            <label>Password</label>
                                            {(submitted || touched.password) && password === '' ? <small className="text-danger">Password is required</small> : null}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-floating">
                                            <select
                                                className="form-control"
                                                value={gender}
                                                onChange={(e) => setGender(e.target.value)}
                                                onBlur={() => setTouched(prev => ({ ...prev, gender: true }))}
                                            >
                                                <option value="">Select gender</option>
                                                <option>Male</option>
                                                <option>Female</option>
                                                <option>Other</option>
                                            </select>
                                            <label>Gender</label>
                                            {(submitted || touched.gender) && gender === '' ? <small className="text-danger">Gender is required</small> : null}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-floating">
                                            <select
                                                className="form-control"
                                                value={educationLevel}
                                                onChange={(e) => setEducationLevel(e.target.value)}
                                                onBlur={() => setTouched(prev => ({ ...prev, educationLevel: true }))}
                                            >
                                                <option value="">Select education</option>
                                                <option>High School</option>
                                                <option>Diploma</option>
                                                <option>Bachelor's</option>
                                                <option>Master's</option>
                                                <option>PhD</option>
                                            </select>
                                            <label>Education</label>
                                            {(submitted || touched.educationLevel) && educationLevel === '' ? <small className="text-danger">Education level is required</small> : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="row g-3 mt-2">
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <textarea
                                                className="form-control"
                                                placeholder="Enter address"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                onBlur={() => setTouched(prev => ({ ...prev, address: true }))}

                                            ></textarea>
                                            <label>Address</label>
                                            {(submitted || touched.address) && address === '' ? <small className="text-danger">Address is required</small> : null}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <textarea
                                                className="form-control"
                                                placeholder="Write bio"
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}

                                            ></textarea>
                                            <label>Bio</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row g-3 mt-2">
                                    <div className="col-md-12">
                                        <label className="form-label">Profile Image</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={(e) => setProfileImage(e.target.files[0])}
                                            onBlur={() => setTouched(prev => ({ ...prev, profileImage: true }))}
                                        />
                                        {(submitted || touched.profileImage) && profileImage === null ? <small className="text-danger">Profile image is required</small> : null}
                                    </div>

                                </div>
                                {/* Submit */}
                                <div className="row mt-4">
                                    <div className="col-12">
                                        <button className="btn btn-primary w-100 py-3" type="submit" disabled={loading} >
                                            {loading ? "Please wait..." : "Register"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}