import { useEffect, useState } from "react";

function StudentRecommendations() {
    const [recommendations, setRecommendations] =
        useState([]);

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
                    `http://localhost:5220/api/recommendations/${student.studentID}`
                )
                    .then((res) => res.json())
                    .then((data) =>
                        setRecommendations(data)
                    );
            });
    }, []);

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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StudentRecommendations;