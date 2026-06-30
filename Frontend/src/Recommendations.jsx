import { useEffect, useState } from "react";
import {
    FaLightbulb,
} from "react-icons/fa6";

function Recommendations() {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(1);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5220/api/students")
            .then((res) => res.json())
            .then((data) => setStudents(data));
    }, []);

    useEffect(() => {
        fetch(
            `http://localhost:5220/api/recommendations/${selectedStudent}`
        )
            .then((res) => res.json())
            .then((data) => setRecommendations(data));
    }, [selectedStudent]);

    return (
        <div>
            <h1 className="page-title">
                <FaLightbulb className="page-icon" />
                Recommendations
            </h1>

            <div className="recommendation-controls">
                <label>Select Student:</label>

                <select
                    value={selectedStudent}
                    onChange={(e) =>
                        setSelectedStudent(e.target.value)
                    }
                >
                    {students.map((student) => (
                        <option
                            key={student.studentID}
                            value={student.studentID}
                        >
                            {student.fullName}
                        </option>
                    ))}
                </select>
            </div>

            <div className="table-card">
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

export default Recommendations;