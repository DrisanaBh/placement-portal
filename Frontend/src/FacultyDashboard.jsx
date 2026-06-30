import StudentProfile from "./StudentProfile";
import TopBar from "./components/TopBar";
import { useEffect, useState } from "react";
import { FaUserTie } from "react-icons/fa6";

function FacultyDashboard({
    openNotifications
}) {
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [dashboard, setDashboard] = useState(null);
    const [selectedStudent, setSelectedStudent] =
        useState(null);
    const [applications, setApplications] =
        useState([]);

    useEffect(() => {
        fetch(
            `http://localhost:5220/api/faculty/${user.facultyID}/dashboard`
        )
            .then((res) => res.json())
            .then((data) => setDashboard(data));
        fetch(
            "http://localhost:5220/api/applications"
        )
            .then((res) => res.json())
            .then((data) =>
                setApplications(data)
            );
    }, []);

    const updateStatus = async (
        applicationId,
        status
    ) => {
        await fetch(
            `http://localhost:5220/api/applications/${applicationId}/status`,
            {
                method: "PUT",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    status
                })
            }
        );

        setApplications(
            applications.map((app) =>
                app.applicationID ===
                    applicationId
                    ? {
                        ...app,
                        status
                    }
                    : app
            )
        );
    };
    if (selectedStudent) {
        return (
            <StudentProfile
                studentId={selectedStudent}
                onBack={() =>
                    setSelectedStudent(null)
                }
            />
        );
    }

    if (!dashboard) {
        return <h2>Loading...</h2>;
    }

    console.log(applications);
    return (
        <div>

            <TopBar
                user={user}
                notificationCount={0}
                onNotificationsClick={openNotifications}
            />

            <h2 className="faculty-title">
                <FaUserTie className="faculty-icon" />
                {dashboard.fullName}
            </h2>

            <h3>{dashboard.department}</h3>

            <div className="cards">
                <div className="card students-card">
                    <h2>
                        {dashboard.studentCount}
                    </h2>
                    <p>Students</p>
                </div>

                <div className="card jobs-card">
                    <h2>
                        {dashboard.offerCount}
                    </h2>
                    <p>Total Offers</p>
                </div>
            </div>

            <div className="chart-card">
                <h3>Placement Status</h3>

                <table className="students-table">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Count</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>Applied</td>
                            <td>
                                {
                                    dashboard.appliedCount
                                }
                            </td>
                        </tr>

                        <tr>
                            <td>Interview</td>
                            <td>
                                {
                                    dashboard.interviewCount
                                }
                            </td>
                        </tr>

                        <tr>
                            <td>Offer</td>
                            <td>
                                {
                                    dashboard.offerCount
                                }
                            </td>
                        </tr>

                        <tr>
                            <td>Rejected</td>
                            <td>
                                {
                                    dashboard.rejectedCount
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="table-card">
                    <h2>Application Management</h2>

                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Application ID</th>
                                <th>Student</th>
                                <th>Company</th>
                                <th>Job</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {applications.map((app) => (
                                <tr
                                    key={app.applicationID}
                                >
                                    <td>
                                        {app.applicationID}
                                    </td>

                                    <td>
                                        {app.fullName}
                                    </td>
                                    <td>
                                        {app.companyName}
                                    </td>
                                    <td>
                                        {app.jobTitle}
                                    </td>

                                    <td>
                                        <select
                                            value={
                                                app.status
                                            }
                                            onChange={(e) =>
                                                updateStatus(
                                                    app.applicationID,
                                                    e.target
                                                        .value
                                                )
                                            }
                                        >
                                            <option>
                                                Applied
                                            </option>

                                            <option>
                                                Interview
                                            </option>

                                            <option>
                                                Offer
                                            </option>

                                            <option>
                                                Rejected
                                            </option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default FacultyDashboard;