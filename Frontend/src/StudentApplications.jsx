import { useEffect, useState } from "react";

function StudentApplications() {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const user = JSON.parse(
            localStorage.getItem("user")
        );

        fetch(
            `http://localhost:5220/api/student/by-name/${encodeURIComponent(
                user.fullName
            )}`
        )
            .then((res) => res.json())
            .then((student) => {
                fetch(
                    "http://localhost:5220/api/applications"
                )
                    .then((res) => res.json())
                    .then((data) =>
                        setApplications(
                            data.filter(
                                (app) =>
                                    app.studentID ===
                                    student.studentID
                            )
                        )
                    );
            });
    }, []);

    return (
        <div className="table-card">
            <h2 style={{ padding: "20px" }}>
                My Applications
            </h2>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Job</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {applications.map((app, index) => (
                        <tr key={index}>
                            <td>{app.companyName}</td>
                            <td>{app.jobTitle}</td>
                            <td>{app.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StudentApplications;