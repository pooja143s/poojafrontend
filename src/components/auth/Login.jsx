import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import { login } from "../../services/userService";
import { PuffLoader } from "react-spinners";

export default function Login() {
    const nav = useNavigate()

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
    }, [])

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [submitted, setSubmitted] = useState(false);
    const [touched, setTouched] = useState({
        email: false,
        password: false,
    });

    const submit = (e) => {
        e.preventDefault()
        setSubmitted(true);
        setLoading(true);
        let payload = {
            email: email,
            password: password
        }
        login(payload).then((res) => {
            if (res.data.success) {
                setLoading(false);
                toast.success(res.data.message)
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("email", res.data.data.email)
                localStorage.setItem("name", res.data.data.name)
                localStorage.setItem("_id", res.data.data._id)
                localStorage.setItem("userType", res.data.data.userType)
                if (res.data.data.userType == 1) {
                    nav("/admin/dashboard")
                }
                else if (res.data.data.userType == 2) {
                    localStorage.setItem("alumniId", res.data.data.alumniId)
                    nav("/alumni/dashboard")
                }
                else if (res.data.data.userType == 3) {
                    localStorage.setItem("studentId", res.data.data.studentId)
                    nav("/")
                }
                else {
                    toast.error("Invalid User Type")
                }
            }
            else {
                setLoading(false);
                toast.error(res.data.message)
            }
        }).catch((err) => {
            setLoading(false);
            console.log(err);
            toast.error(err)
        })
    }

    return (
        <>
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
                                <h1 className="display-3 text-white animated slideInDown">Login</h1>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb justify-content-center">
                                        <li className="breadcrumb-item">
                                            <a className="text-white" href="#">
                                                Home
                                            </a>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <a className="text-white" href="#">
                                                Login
                                            </a>
                                        </li>

                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Header End */}
                {/* Contact Start */}
                <div className="container-xxl py-5">
                    <div className="container">
                        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                            <h6 className="section-title bg-white text-center text-primary px-3">
                                Login
                            </h6>
                        </div>

                        <div className="row g-4">
                            <div className="col-lg-6 offset-lg-3 col-md-12 wow fadeInUp" data-wow-delay="0.5s">
                                <form onSubmit={submit}>
                                    <div className="row g-3">
                                        <div className="col-md-12">
                                            <div className="form-floating">
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email" value={email}
                                                    placeholder="Your Email"
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                                                />
                                                {(submitted || touched.email) && email === '' ? <small className="text-danger">Email is required</small> : null}


                                                <label htmlFor="email">Your Email</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="subject"
                                                    placeholder="Password" value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                                                />
                                                {(submitted || touched.password) && password === '' ? <small className="text-danger">Password is required</small> : null}


                                                <label htmlFor="subject">Password</label>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <button className="btn btn-primary w-100 py-3" type="submit" disabled={loading} >
                                                {loading ? "Please wait..." : "Login"}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Contact End */}
            </>


        </>
    )
}