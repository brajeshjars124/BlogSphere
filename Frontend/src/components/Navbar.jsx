import React, {useState} from 'react'
import { Link} from 'react-router';



export default function Navbar({user, onLogOut, error}) {
    const [isDropdownOpen, setIsDropdownopen] = useState(false);

    const toggleDropdown = () => {
        localStorage.removeItem('user')
        setIsDropdownopen(!isDropdownOpen);
    }

    return (
        <>
        <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Blogify</Link>
                <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
                >
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                    </li>

                    {user? (
                        <>
                        <li className="nav-item">
                            <Link className="nav-link" to="/blog/add-blog">Add Blog</Link>
                        </li>
                        
                        <li className="nav-item dropdown">
                            <Link
                                className="nav-link dropdown-toggle"
                                to={`blog/${user?._id}`}
                                onClick={toggleDropdown}
                                id="navbarDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >{user.fullName}</Link>
                            <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} >
                                <li><Link className="dropdown-item" to="#">Profile</Link></li>
                                <li><Link className="dropdown-item" to="/signin" onClick={onLogOut}>Logout</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><Link className="dropdown-item" to="#">...</Link></li>
                            </ul>
                        </li>
                        </>
                    ):(
                        <>
                        <li className="nav-item">
                            <Link className="nav-link" to="/signup">Signup</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/signin">Signin</Link>
                        </li> 
                        </>
                    )
                    }

                    <li className="nav-item">
                        <Link
                        className="nav-link disabled"
                        href="#"
                        tabIndex="-1"
                        aria-disabled="true"
                        >
                        </Link>
                    </li>
                </ul>
                <form className="d-flex">
                    <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    />
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
                </div>
            </div>
            </nav>
        </div>
        </>
    )
}