import StudentProfile from "./StudentProfile";
import { useEffect, useState } from "react";
import "./Students.css";
import {
    FaUserGraduate,
} from "react-icons/fa6";

function Students() {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5220/api/students")
            .then((res) => res.json())
            .then((data) => setStudents(data))
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
                <FaUserGraduate className="page-icon" />
                 Students
            </h1>

            <div className="students-table-container">
                <table className="students-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>CGPA</th>
                            <th>Graduation Year</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map((student) => (
                            <tr key={student.studentID}>
                                <td>{student.studentID}</td>

                                <td>
                                    <button
                                        className="student-link"
                                        onClick={() =>
                                            setSelectedStudent(
                                                student.studentID
                                            )
                                        }
                                    >
                                        {student.fullName}
                                    </button>
                                </td>

                                <td>{student.department}</td>
                                <td>{student.cgpa}</td>
                                <td>{student.graduationYear}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Students;