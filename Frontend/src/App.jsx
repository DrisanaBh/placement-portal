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
    const [currentPage, setCurrentPage] = useState(
        localStorage.getItem("currentPage") || "dashboard"
    );

    const [students, setStudents] = useState(0);
    const [jobs, setJobs] = useState(0);
    const [applications, setApplications] = useState(0);
    const [offers, setOffers] = useState(0);
    useEffect(() => {
        localStorage.setItem("currentPage", currentPage);
    }, [currentPage]);
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    );

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
    }, []);

    const chartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Applications",
                data: [12, 19, 25, 30, 35, applications],
                borderColor: "#6C63FF",
                backgroundColor: "#6C63FF",
                tension: 0.4,
            },
            {
                label: "Offers",
                data: [2, 4, 5, 5, 6, offers],
                borderColor: "#00C896",
                backgroundColor: "#00C896",
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
                    } else {
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
                    <h2>🎓 Placement Portal</h2>
                    <p>{user.fullName}</p>
                    <p>{user.role}</p>

                    <ul>
                        {user.role === "Faculty" ? (
                            <>
                                <li
                                    className={currentPage === "faculty" ? "active" : ""}
                                    onClick={() => setCurrentPage("faculty")}
                                >
                                    👨‍🏫 Faculty Dashboard
                                </li>

                                <li
                                    className={currentPage === "mentees" ? "active" : ""}
                                    onClick={() => setCurrentPage("mentees")}
                                >
                                    👥 Mentee Details
                                </li>
                            </>
                        ) : (
                            <>
                                <li
                                    className={currentPage === "dashboard" ? "active" : ""}
                                    onClick={() => setCurrentPage("dashboard")}
                                >
                                    📊 Dashboard
                                </li>

                                <li
                                    className={currentPage === "students" ? "active" : ""}
                                    onClick={() => setCurrentPage("students")}
                                >
                                    🎓 Students
                                </li>

                                <li
                                    className={currentPage === "faculty" ? "active" : ""}
                                    onClick={() => setCurrentPage("faculty")}
                                >
                                    👨‍🏫 Faculty
                                </li>

                                <li
                                    className={currentPage === "jobs" ? "active" : ""}
                                    onClick={() => setCurrentPage("jobs")}
                                >
                                    💼 Jobs
                                </li>

                                <li
                                    className={currentPage === "applications" ? "active" : ""}
                                    onClick={() => setCurrentPage("applications")}
                                >
                                    📝 Applications
                                </li>

                                <li
                                    className={currentPage === "offers" ? "active" : ""}
                                    onClick={() => setCurrentPage("offers")}
                                >
                                    🏆 Offers
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
                                    🤖 Recommendations
                                </li>
                            </>
                        )}

                        <button
                            onClick={() => {
                                localStorage.removeItem("user");
                                localStorage.removeItem("currentPage");
                                setUser(null);
                            }}
                        >
                            Logout
                        </button>
                    </ul>
                </div>

                <div className="sidebar-footer">
                    <p>Active Students</p>
                    <h3>{students}</h3>
                </div>
            </aside>

            <main className="content">

                {currentPage === "dashboard" && (
                    <>
                        <div className="topbar">
                            <div>
                                <h3>Welcome Back, Admin 👋</h3>
                            </div>

                            <div className="topbar-right">
                                <span>🔔 Notifications</span>
                                <span>📅 June 2026</span>
                                <span>👤 Admin</span>
                            </div>
                        </div>

                        <div className="hero-card">
                            <div>
                                <h1>Placement Analytics</h1>
                                <p>
                                    Track students, applications, jobs and offers in one place.
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
                                <div className="card-icon">🎓</div>
                                <h2>{students}</h2>
                                <p>Total Students</p>
                            </div>

                            <div className="card jobs-card">
                                <div className="card-icon">💼</div>
                                <h2>{jobs}</h2>
                                <p>Total Jobs</p>
                            </div>

                            <div className="card applications-card">
                                <div className="card-icon">📝</div>
                                <h2>{applications}</h2>
                                <p>Total Applications</p>
                            </div>

                            <div className="card offers-card">
                                <div className="card-icon">🏆</div>
                                <h2>{offers}</h2>
                                <p>Total Offers</p>
                            </div>
                        </div>

                        <div className="chart-card">
                            <h3>Placement Trends</h3>
                            <Line data={chartData} />
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
                        ? <FacultyDashboard />
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

            </main>
        </div>
    );
}

export default App;