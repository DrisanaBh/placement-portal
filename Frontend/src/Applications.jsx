import { useEffect, useState } from "react";
import {
    FaFileCircleCheck,
} from "react-icons/fa6";

function Applications() {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5220/api/applications")
            .then((res) => res.json())
            .then((data) => setApplications(data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div>
            <h1 className="page-title">
                <FaFileCircleCheck className="page-icon" />
                Applications
            </h1>

            <div className="table-card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Company</th>
                            <th>Job Title</th>
                            <th>Status</th>
                            <th>Applied Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {applications.map((app, index) => (
                            <tr key={index}>
                                <td>{app.fullName}</td>
                                <td>{app.companyName}</td>
                                <td>{app.jobTitle}</td>
                                <td>
                                    <span className={`status-badge ${app.status.toLowerCase()}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td>
                                    {new Date(
                                        app.appliedDate
                                    ).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Applications;