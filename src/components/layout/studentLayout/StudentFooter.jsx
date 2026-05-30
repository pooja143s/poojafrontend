export default function StudentFooter() {
    return (
        <>
            {/* Footer Start */}
            <div className="container-fluid bg-dark text-light mt-5 footer wow fadeIn"
                data-wow-delay="0.1s"
            >
                <div className="container">
                    <div className="copyright">
                        <div className="row">
                            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">© <a className="border-bottom">ALUMNI FY</a>, All Rights Reserved. Designed By <a className="border-bottom">QWERTY</a></div>
                            <div className="col-md-6 text-center text-md-end">
                                <div className="footer-menu">
                                    <a href="">Home</a>
                                    <a href="">About</a>
                                    <a href="">Contact</a>
                                    <a href="">Registration</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
  
            <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top">
                <i className="bi bi-arrow-up" />
            </a>
        </>
    )
}