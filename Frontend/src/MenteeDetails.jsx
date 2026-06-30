import StudentProfile from "./StudentProfile";
import { useEffect, useState } from "react";
import "./Students.css";
import { FaUsers } from "react-icons/fa6";

function MenteeDetails() {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    useEffect(() => {
        fetch(
            `http://localhost:5220/api/faculty/${user.facultyID}/dashboard`
        )
            .then((res) => res.json())
            .then((data) => setStudents(data.students))
            .catch((err) => console.error(err));
    }, []);

    if (selectedStudent) {
        return (
            <StudentProfile
                studentId={selectedStudent}
                onBack={() => setSelectedStudent(null)}
            />
        );
    }

    return (
        <div className="students-page">
            <h1 className="page-title">
                <FaUsers className="page-icon" />
                Mentee Details
            </h1>

            <div className="students-table-container">
                <table className="students-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>CGPA</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map((student) => (
                            <tr
                                key={student.studentID}
                                onClick={() =>
                                    setSelectedStudent(
                                        student.studentID
                                    )
                                }
                                style={{ cursor: "pointer" }}
                            >
                                <td>{student.studentID}</td>
                                <td>{student.fullName}</td>
                                <td>{student.cgpa}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MenteeDetails;