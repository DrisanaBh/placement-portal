import StudentProfile from "./StudentProfile";
import { useEffect, useState } from "react";

function FacultyDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    useEffect(() => {
        fetch(
            `http://localhost:5220/api/faculty/${user.facultyID}/dashboard`
        )
            .then((res) => res.json())
            .then((data) => setDashboard(data));
    }, []);

    if (selectedStudent) {
        return (
            <StudentProfile
                studentId={selectedStudent}
                onBack={() => setSelectedStudent(null)}
            />
        );
    }

    if (!dashboard) {
        return <h2>Loading...</h2>;
    }

    

    return (
        <div>
            <h1>👨‍🏫 {dashboard.fullName}</h1>

            <h3>{dashboard.department}</h3>

            <div className="cards">
                <div className="card students-card">
                    <h2>{dashboard.studentCount}</h2>
                    <p>Students</p>
                </div>

                <div className="card jobs-card">
                    <h2>{dashboard.offerCount}</h2>
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
                            <td>{dashboard.appliedCount}</td>
                        </tr>

                        <tr>
                            <td>Interview</td>
                            <td>{dashboard.interviewCount}</td>
                        </tr>

                        <tr>
                            <td>Offer</td>
                            <td>{dashboard.offerCount}</td>
                        </tr>

                        <tr>
                            <td>Rejected</td>
                            <td>{dashboard.rejectedCount}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            
        </div>
    );
}

export default FacultyDashboard;