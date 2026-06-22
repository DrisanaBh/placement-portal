import { useEffect, useState } from "react";

function StudentProfile({ studentId, onBack }) {
    const [student, setStudent] = useState(null);
    const [applications, setApplications] = useState([]);
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState("");
    const [cgpa, setCgpa] = useState("");
    const [graduationYear, setGraduationYear] = useState("");
    const [message, setMessage] = useState("");

    const [resolvedStudentId, setResolvedStudentId] =
        useState(studentId);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    useEffect(() => {
        if (studentId) {
            setResolvedStudentId(studentId);
            return;
        }

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

    const loadSkills = (studentId) => {
        fetch(
            `http://localhost:5220/api/students/${studentId}/skills`
        )
            .then((res) => res.json())
            .then((data) => setSkills(data));
    };

    useEffect(() => {
        if (!resolvedStudentId) return;

        loadSkills(resolvedStudentId);

        fetch(
            `http://localhost:5220/api/students/${resolvedStudentId}`
        )
            .then((res) => res.json())
            .then((data) => {
                setStudent(data);
                setCgpa(data.cgpa);
                setGraduationYear(data.graduationYear);
            });

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

    const saveProfile = async () => {
        const response = await fetch(
            `http://localhost:5220/api/students/${resolvedStudentId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cgpa: Number(cgpa),
                    graduationYear: Number(graduationYear)
                })
            }
        );

        if (response.ok) {
            setMessage(
                "Profile updated successfully"
            );

            setStudent({
                ...student,
                cgpa,
                graduationYear
            });
        } else {
            setMessage("Update failed");
        }
    };

    const addSkill = async () => {
        if (!newSkill.trim()) return;

        await fetch(
            `http://localhost:5220/api/students/${resolvedStudentId}/skills`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    skillName: newSkill
                })
            }
        );

        setNewSkill("");
        loadSkills(resolvedStudentId);
    };

    const deleteSkill = async (skillId) => {
        await fetch(
            `http://localhost:5220/api/students/${resolvedStudentId}/skills/${skillId}`,
            {
                method: "DELETE"
            }
        );

        loadSkills(resolvedStudentId);
    };

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
            {!studentId && (
                <h1>
                    Welcome Back, {user.fullName} 👋
                </h1>
            )}

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

                        <input
                            type="number"
                            step="0.01"
                            value={cgpa}
                            onChange={(e) =>
                                setCgpa(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div>
                        <strong>
                            Graduation Year
                        </strong>

                        <input
                            type="number"
                            value={graduationYear}
                            onChange={(e) =>
                                setGraduationYear(
                                    e.target.value
                                )
                            }
                        />
                    </div>
                </div>

                <button
                    onClick={saveProfile}
                    style={{ marginTop: "20px" }}
                >
                    Save Changes
                </button>

                {message && <p>{message}</p>}
            </div>

            <div className="cards">
                <div className="card students-card">
                    <h2>
                        {applications.length}
                    </h2>
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
                    Skills
                </h2>

                <div style={{ padding: "20px" }}>
                    <input
                        type="text"
                        placeholder="Add a skill"
                        value={newSkill}
                        onChange={(e) =>
                            setNewSkill(
                                e.target.value
                            )
                        }
                    />

                    <button
                        style={{
                            marginLeft: "10px"
                        }}
                        onClick={addSkill}
                    >
                        Add Skill
                    </button>
                </div>

                <ul>
                    {skills.map((skill) => (
                        <li
                            key={skill.skillID}
                            style={{
                                padding:
                                    "10px 20px"
                            }}
                        >
                            {skill.skillName}

                            <button
                                style={{
                                    marginLeft:
                                        "10px"
                                }}
                                onClick={() =>
                                    deleteSkill(
                                        skill.skillID
                                    )
                                }
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {studentId && (
                <div className="table-card">
                    <h2
                        style={{
                            padding: "20px"
                        }}
                    >
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
                            {applications.map(
                                (app, index) => (
                                    <tr
                                        key={index}
                                    >
                                        <td>
                                            {
                                                app.companyName
                                            }
                                        </td>
                                        <td>
                                            {
                                                app.jobTitle
                                            }
                                        </td>
                                        <td>
                                            {
                                                app.status
                                            }
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default StudentProfile;