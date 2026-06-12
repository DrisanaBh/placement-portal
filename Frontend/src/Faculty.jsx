import FacultyProfile from "./FacultyProfile";
import { useEffect, useState } from "react";
import "./Students.css";

function Faculty() {
    const [faculty, setFaculty] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        // If logged-in user is Faculty,
        // automatically open their profile
        if (user?.role === "Faculty" && user?.facultyID) {
            setSelectedFaculty(user.facultyID);
            return;
        }

        fetch("http://localhost:5220/api/faculty")
            .then((res) => res.json())
            .then((data) => setFaculty(data))
            .catch((err) => console.error(err));
    }, []);

    if (selectedFaculty) {
        return (
            <FacultyProfile
                facultyId={selectedFaculty}
                onBack={() => setSelectedFaculty(null)}
            />
        );
    }

    return (
        <div className="students-page">
            <h1>👨‍🏫 Faculty</h1>

            <div className="students-table-container">
                <table className="students-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Department</th>
                        </tr>
                    </thead>

                    <tbody>
                        {faculty.map((f) => (
                            <tr
                                key={f.facultyID}
                                onClick={() => setSelectedFaculty(f.facultyID)}
                                style={{ cursor: "pointer" }}
                            >
                                <td>{f.facultyID}</td>
                                <td>{f.fullName}</td>
                                <td>{f.department}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Faculty;