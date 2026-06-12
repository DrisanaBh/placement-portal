import { useEffect, useState } from "react";

function FacultyProfile({ facultyId, onBack }) {
    const [faculty, setFaculty] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5220/api/faculty/${facultyId}`)
            .then((res) => res.json())
            .then((data) => setFaculty(data));
    }, [facultyId]);

    if (!faculty) {
        return <h2>Loading...</h2>;
    }

    return (
        <div>
            <button onClick={onBack}>
                ← Back
            </button>

            <h1>👨‍🏫 {faculty.fullName}</h1>

            <p>
                <strong>Faculty ID:</strong> {faculty.facultyID}
            </p>

            <p>
                <strong>Department:</strong> {faculty.department}
            </p>

            <h2>Students Under Faculty</h2>

            <table className="students-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>CGPA</th>
                    </tr>
                </thead>

                <tbody>
                    {faculty.students.map((student) => (
                        <tr key={student.studentID}>
                            <td>{student.studentID}</td>
                            <td>{student.fullName}</td>
                            <td>{student.cgpa}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default FacultyProfile;