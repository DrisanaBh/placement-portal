import { useEffect, useState } from "react";

function StudentProfile({ studentId, onBack }) {
    const [student, setStudent] = useState(null);
    const [applications, setApplications] = useState([]);
    const [resolvedStudentId, setResolvedStudentId] =
        useState(studentId);

    useEffect(() => {
        if (studentId) {
            setResolvedStudentId(studentId);
            return;
        }

        const user = JSON.parse(
            localStorage.getItem("user")
        );

        fetch(
            `http://localhost:5220/api/student/by-name/${encodeURIComponent(
                user.fullName
            )}`
        )
            .then((res) => res.json())
            .then((data) => {
                setResolvedStudentId(data.studentID);
            });
    }, [studentId]);

    useEffect(() => {
        if (!resolvedStudentId) return;

        fetch(
            `http://localhost:5220/api/students/${resolvedStudentId}`
        )
            .then((res) => res.json())
            .then((data) => setStudent(data));

        fetch(
            "http://localhost:5220/api/applications"
        )
            .then((res) => res.json())
            .then((data) =>
                setApplications(
                    data.filter(
                        (app) =>
                            app.studentID ===
                            Number(resolvedStudentId)
                    )
                )
            );

       
    }, [resolvedStudentId]);

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
            {onBack && (
                <button
                    className="back-btn"
                    onClick={onBack}
                >
                    ← Back
                </button>
            )}

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

            
        </div>
    );
}

export default StudentProfile;