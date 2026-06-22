import { useEffect, useState } from "react";

function StudentRecommendations() {
    const [recommendations, setRecommendations] =
        useState([]);

    const [studentId, setStudentId] =
        useState(null);

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
                setStudentId(student.studentID);
                fetch(
                    `http://localhost:5220/api/recommendations/${student.studentID}`
                )
                    .then((res) => res.json())
                    .then((data) =>
                        setRecommendations(data)
                    );
            });
    }, []);

    const applyForJob = async (jobId) => {
        const response = await fetch(
            "http://localhost:5220/api/apply",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    studentID: studentId,
                    jobID: jobId
                })
            }
        );

        if (response.ok) {
            alert("Application submitted!");
        }
    };
    return (
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
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {recommendations.map((job) => (
                        <tr key={job.jobID}>
                            <td>{job.jobTitle}</td>
                            <td>{job.companyName}</td>
                            <td>
                                ⭐ {job.matchingSkills}
                            </td>

                            <td>
                                <button
                                    onClick={() =>
                                        applyForJob(job.jobID)
                                    }
                                >
                                    Apply
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StudentRecommendations;