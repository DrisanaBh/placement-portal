import TopBar from "./components/TopBar";
import Notifications from "./Notifications";
import StudentApplications from "./StudentApplications";
import StudentRecommendations from "./StudentRecommendations";
import StudentProfile from "./StudentProfile";
import MenteeDetails from "./MenteeDetails";
import Login from "./Login";
import Faculty from "./Faculty";
import FacultyDashboard from "./FacultyDashboard";
import Recommendations from "./Recommendations";
import Offers from "./Offers";
import Applications from "./Applications";
import Jobs from "./Jobs";
import Students from "./Students";
import { useEffect, useState } from "react";
import "./App.css";
import {
    FaChartPie,
    FaUserGraduate,
    FaUserTie,
    FaBriefcase,
    FaFileCircleCheck,
    FaAward,
    FaLightbulb,
    FaRightFromBracket,
    FaAddressCard
} from "react-icons/fa6";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function App() {
    const [currentPage, setCurrentPage] = useState(() => {
        const user = JSON.parse(
            localStorage.getItem("user")
        );

        if (user?.role === "Student")
            return "studentprofile";

        return (
            localStorage.getItem("currentPage") ||
            "dashboard"
        );
    });

    const [students, setStudents] = useState(0);
    const [jobs, setJobs] = useState(0);
    const [applications, setApplications] = useState(0);
    const [offers, setOffers] = useState(0);
    const [notificationCount, setNotificationCount] =
        useState(0);
    useEffect(() => {
        localStorage.setItem("currentPage", currentPage);
    }, [currentPage]);
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    );
    console.log(user);
    const handleProfileUpload = async (e) => {
        console.log("Upload started");

        const file = e.target.files[0];

        console.log(file);

        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
            `http://localhost:5220/api/upload-profile-image?userId=${user.userID}`,
            {
                method: "POST",
                body: formData
            }
        );

        console.log("Upload response:", response.status);

        const updatedUser = await fetch(
            `http://localhost:5220/api/user/${user.userID}`
        ).then(r => r.json());

        console.log(updatedUser);

        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );

        setUser(updatedUser);
    };

    useEffect(() => {
        fetch("http://localhost:5220/api/dashboard/students/count")
            .then((res) => res.json())
            .then((data) => setStudents(data));

        fetch("http://localhost:5220/api/dashboard/jobs/count")
            .then((res) => res.json())
            .then((data) => setJobs(data));

        fetch("http://localhost:5220/api/dashboard/applications/count")
            .then((res) => res.json())
            .then((data) => setApplications(data));

        fetch("http://localhost:5220/api/dashboard/offers/count")
            .then((res) => res.json())
            .then((data) => setOffers(data));
        if (user) {
            fetch(
                `http://localhost:5220/api/notifications/${user.userID}/count`
            )
                .then((res) => res.json())
                .then((count) =>
                    setNotificationCount(count)
                );
        }
        }, [user, currentPage]);

    const chartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Applications",
                data: [12, 19, 25, 30, 35, applications],
                borderColor: "#4F7B78",
                backgroundColor: "#4F7B78",
                tension: 0.4,
            },
            {
                label: "Offers",
                data: [2, 4, 5, 5, 6, offers],
                borderColor: "#97B3AD",
                backgroundColor: "#97B3AD",
                tension: 0.4,
            },
        ],
    };
    if (!user) {
        return (
            <Login
                onLogin={(loggedInUser) => {
                    setUser(loggedInUser);

                    if (loggedInUser.role === "Faculty") {
                        setCurrentPage("faculty");
                    }
                    else if (loggedInUser.role === "Student") {
                        setCurrentPage("studentprofile");
                    }
                    else {
                        setCurrentPage("dashboard");
                    }
                }}
            />
        );
    }

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <div>
                    <h2 className="sidebar-title">
                        Placement Portal
                    </h2>

                    <div className="sidebar-profile">

                        <>
                            <input
                                type="file"
                                id="profileUpload"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleProfileUpload}
                            />

                            <label
                                htmlFor="profileUpload"
                                className="profile-avatar"
                            >
                                {user.profileImage ? (
                                    <img
                                        src={`http://localhost:5220${user.profileImage}?t=${Date.now()}`}
                                        alt="Profile"
                                        className="profile-avatar-image"
                                    />
                                ) : (
                                    user.fullName.charAt(0)
                                )}
                            </label>
                        </>

                        <div className="profile-details">
                            <h3>{user.fullName}</h3>
                            <p>
                                {user.role === "Admin"
                                    ? "System Administrator"
                                    : user.role}
                            </p>
                        </div>

                    </div>
                    <ul className="sidebar-menu">
                        {user.role === "Faculty" ? (
                            <>
                                <li
                                    className={currentPage === "faculty" ? "active" : ""}
                                    onClick={() => setCurrentPage("faculty")}
                                >
                                    <>
                                        <FaChartPie />
                                        <span>Dashboard</span>
                                    </>
                                </li>

                                <li
                                    className={currentPage === "mentees" ? "active" : ""}
                                    onClick={() => setCurrentPage("mentees")}
                                >
                                    <>
                                        <FaUserGraduate />
                                        <span>Mentee Details</span>
                                    </>
                                </li>
                            </>
                        )  : user.role === "Student" ? (
                                <>
                                    <li
                                        className={
                                            currentPage === "studentprofile"
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setCurrentPage("studentprofile")
                                        }
                                    >
                                        <>
                                            <FaAddressCard />
                                            <span>My Profile</span>
                                        </>
                                    </li>
                                    <li
                                        className={
                                            currentPage === "studentapplications"
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setCurrentPage("studentapplications")
                                        }
                                    >
                                        <>
                                            <FaFileCircleCheck />
                                            <span>My Applications</span>
                                        </>
                                    </li>

                                    <li
                                        className={
                                            currentPage === "studentrecommendations"
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                "studentrecommendations"
                                            )
                                        }
                                    >
                                        <>
                                            <FaLightbulb />
                                            <span>Job Recommendations</span>
                                        </>
                                    </li>
                                </> ):(
                            <>
                                <li
                                    className={currentPage === "dashboard" ? "active" : ""}
                                    onClick={() => setCurrentPage("dashboard")}
                                >
                                            <>
                                                <FaChartPie />
                                                <span>Dashboard</span>
                                            </>
                                </li>

                                <li
                                    className={currentPage === "students" ? "active" : ""}
                                    onClick={() => setCurrentPage("students")}
                                >
                                            <>
                                                <FaUserGraduate />
                                                <span>Students</span>
                                            </>
                                </li>

                                <li
                                    className={currentPage === "faculty" ? "active" : ""}
                                    onClick={() => setCurrentPage("faculty")}
                                >
                                            <>
                                                <FaUserTie/>
                                                <span>Faculty</span>
                                            </>
                                </li>

                                <li
                                    className={currentPage === "jobs" ? "active" : ""}
                                    onClick={() => setCurrentPage("jobs")}
                                >
                                            <>
                                                <FaBriefcase />
                                                <span>Jobs</span>
                                            </>
                                </li>

                                <li
                                    className={currentPage === "applications" ? "active" : ""}
                                    onClick={() => setCurrentPage("applications")}
                                >
                                            <>
                                                <FaFileCircleCheck />
                                                <span>Applications</span>
                                            </>
                                </li>

                                <li
                                    className={currentPage === "offers" ? "active" : ""}
                                    onClick={() => setCurrentPage("offers")}
                                >
                                            <>
                                                <FaAward />
                                                <span>Offers</span>
                                            </>
                                </li>

                                <li
                                    className={
                                        currentPage === "recommendations"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setCurrentPage("recommendations")
                                    }
                                >
                                            <>
                                                <FaLightbulb />
                                                <span>Recommendations</span>
                                            </>
                                </li>
                            </>
                        )}

                        
                    </ul>
                    <button
                        className="logout-btn"
                        onClick={() => {
                            localStorage.removeItem("user");
                            localStorage.removeItem("currentPage");
                            setUser(null);
                        }}
                    >
                        
                            <FaRightFromBracket />
                            <span>Logout</span>
                       
                    </button>
                </div> 
                
            </aside>

            <main className="content">

                {currentPage === "dashboard" && (
                    <>
                        <TopBar
                            user={user}
                            notificationCount={notificationCount}
                            onNotificationsClick={() =>
                                setCurrentPage("notifications")
                            }
                        />

                        <div className="hero-card">
                            <div>
                                <h1>Dashboard Overview</h1>
                                <p>
                                    Monitor placements, applications and recruitment from one dashboard.
                                </p>
                            </div>

                            <div className="hero-stat">
                                <span>Offer Rate</span>
                                <h2>
                                    {applications > 0
                                        ? Math.round((offers / applications) * 100)
                                        : 0}
                                    %
                                </h2>
                            </div>
                        </div>

                        <div className="cards">
                            <div className="card students-card">
                                <div className="card-icon">
                                    <FaUserGraduate />
                                </div>
                                <h2>{students}</h2>
                                <p>Total Students</p>
                            </div>

                            <div className="card jobs-card">
                                <div className="card-icon">
                                    <FaBriefcase />
                                </div>
                                <h2>{jobs}</h2>
                                <p>Total Jobs</p>
                            </div>

                            <div className="card applications-card">
                                <div className="card-icon">
                                    <FaFileCircleCheck />
                                </div>
                                <h2>{applications}</h2>
                                <p>Total Applications</p>
                            </div>

                            <div className="card offers-card">
                                <div className="card-icon">
                                    <FaAward />
                                </div>
                                <h2>{offers}</h2>
                                <p>Total Offers</p>
                            </div>
                        </div>

                        <div className="chart-card">
                            <h3>Placement Trends</h3>
                            <Line
                                data={chartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            labels: {
                                                color: "#335D5A",
                                                font: {
                                                    size: 14
                                                }
                                            }
                                        }
                                    },
                                    scales: {
                                        x: {
                                            grid: {
                                                color: "#D0DDD8"
                                            },
                                            ticks: {
                                                color: "#4F7B78"
                                            }
                                        },
                                        y: {
                                            grid: {
                                                color: "#D0DDD8"
                                            },
                                            ticks: {
                                                color: "#4F7B78"
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>

                        <div className="bottom-section">
                            <div className="large-card">
                                <h3>Top Recruiters</h3>

                                <div className="recruiter">
                                    <span>Google</span>
                                    <span>★★★★★</span>
                                </div>

                                <div className="recruiter">
                                    <span>Infosys</span>
                                    <span>★★★★☆</span>
                                </div>

                                <div className="recruiter">
                                    <span>Deloitte</span>
                                    <span>★★★★☆</span>
                                </div>

                                <div className="recruiter">
                                    <span>Amazon</span>
                                    <span>★★★★★</span>
                                </div>
                            </div>

                            <div className="large-card">
                                <h3>Placement Overview</h3>

                                <div className="status-box">
                                    Students: {students}
                                </div>

                                <div className="status-box">
                                    Applications: {applications}
                                </div>

                                <div className="status-box">
                                    Offers: {offers}
                                </div>

                                <div className="status-box success">
                                    Success Rate:{" "}
                                    {applications > 0
                                        ? Math.round((offers / applications) * 100)
                                        : 0}
                                    %
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {currentPage === "students" && (
                    <Students />
                )}
                {currentPage === "faculty" && (
                    user.role === "Faculty"
                        ? (
                            <FacultyDashboard
                                openNotifications={() =>
                                    setCurrentPage("notifications")
                                }
                            />
                        )
                        : <Faculty />
                )}
                {currentPage === "mentees" && (
                    <MenteeDetails />
                )}
                {currentPage === "jobs" && (
                    <Jobs />
                )}
                {currentPage === "applications" && (
                    <Applications />
                )}
                {currentPage === "offers" && (
                    <Offers />
                )}
                {currentPage === "recommendations" && (
                    <Recommendations />
                )}
                {currentPage === "studentprofile" && (
                    <StudentProfile
                        openNotifications={() =>
                            setCurrentPage("notifications")
                        }
                    />
                )}
                {currentPage === "studentapplications" && (
                    <StudentApplications />
                )}
                {currentPage === "studentrecommendations" && (
                    <StudentRecommendations />
                )}
                {currentPage === "notifications" && (
                    <Notifications
                        onBack={() => {
                            setNotificationCount(0);

                            if (user.role === "Admin") {
                                setCurrentPage("dashboard");
                            } else if (user.role === "Faculty") {
                                setCurrentPage("faculty");
                            } else {
                                setCurrentPage("studentprofile");
                            }
                        }}
                    />
                )}

            </main>
        </div>
    );
}

export default App;