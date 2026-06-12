import { useEffect, useState } from "react";

function StudentProfile({ studentId, onBack }) {
    const [student, setStudent] = useState(null);
    const [applications, setApplications] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5220/api/students/${studentId}`)
            .then((res) => res.json())
            .then((data) => setStudent(data));

        fetch("http://localhost:5220/api/applications")
            .then((res) => res.json())
            .then((data) =>
                setApplications(
                    data.filter(
                        (app) => app.studentID === Number(studentId)
                    )
                )
            );

        fetch(
            `http://localhost:5220/api/recommendations/${studentId}`
        )
            .then((res) => res.json())
            .then((data) => setRecommendations(data));
    }, [studentId]);

    if (!student) {
        return <h2>Loading...</h2>;
    }

    const interviews = applications.filter(
        (a) => a.status === "Interview"
    ).length;

    const offers = applications.filter(
        (a) => a.status === "Offer"
    ).length;

    return (
        <div>
            <button className="back-btn" onClick={onBack}>
                ← Back
            </button>

            <div className="profile-card">
                <h1>{student.fullName}</h1>

                <div className="profile-info">
                    <div>
                        <strong>Department</strong>
                        <p>{student.department}</p>
                    </div>

                    <div>
                        <strong>CGPA</strong>
                        <p>{student.cgpa}</p>
                    </div>

                    <div>
                        <strong>Graduation Year</strong>
                        <p>{student.graduationYear}</p>
                    </div>
                </div>
            </div>

            <div className="cards">
                <div className="card students-card">
                    <h2>{applications.length}</h2>
                    <p>Applications</p>
                </div>

                <div className="card applications-card">
                    <h2>{interviews}</h2>
                    <p>Interviews</p>
                </div>

                <div className="card offers-card">
                    <h2>{offers}</h2>
                    <p>Offers</p>
                </div>
            </div>

            <div className="table-card">
                <h2 style={{ padding: "20px" }}>
                    Applications
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

            <div className="table-card">
                <h2 style={{ padding: "20px" }}>
                    Recommended Jobs
                </h2>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Company</th>
                            <th>Matching Skills</th>
                        </tr>
                    </thead>

                    <tbody>
                        {recommendations.map((job) => (
                            <tr key={job.jobID}>
                                <td>{job.jobTitle}</td>
                                <td>{job.companyName}</td>
                                <td>⭐ {job.matchingSkills}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StudentProfile;