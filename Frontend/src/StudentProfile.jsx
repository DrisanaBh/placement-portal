import { useEffect, useState } from "react";
import TopBar from "./components/TopBar";


function StudentProfile({
    studentId,
    onBack,
    openNotifications
}) {
    const [student, setStudent] = useState(null);
    const [applications, setApplications] = useState([]);
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState("");
    const [cgpa, setCgpa] = useState("");
    const [graduationYear, setGraduationYear] = useState("");
    const [message, setMessage] = useState("");
    const [resume, setResume] = useState(null);
    const [resumeFile, setResumeFile] =
        useState(null);

    const [resumeMessage, setResumeMessage] =
        useState("");

    const [resolvedStudentId, setResolvedStudentId] =
        useState(studentId);

    const user = JSON.parse(
        localStorage.getItem("user")
    );
    const isAdmin =
        user?.role === "Admin";

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
        fetch(
            `http://localhost:5220/api/resume/${resolvedStudentId}`
        )
            .then((res) => {
                if (!res.ok) return null;
                return res.json();
            })
            .then((data) => {
                if (data) {
                    setResume(data);
                }
            });
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
    const uploadResume = async () => {
        if (!resumeFile) {
            alert("Please select a file");
            return;
        }

        const formData = new FormData();

        formData.append(
            "file",
            resumeFile
        );

        const response = await fetch(
            `http://localhost:5220/api/upload-resume?studentId=${resolvedStudentId}`,
            {
                method: "POST",
                body: formData
            }
        );

        if (response.ok) {
            setResumeMessage(
                "Resume uploaded successfully"
            );

            const updatedResume =
                await fetch(
                    `http://localhost:5220/api/resume/${resolvedStudentId}`
                );

            const data =
                await updatedResume.json();

            setResume(data);
        }
        else {
            setResumeMessage(
                "Upload failed"
            );
        }
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
                <TopBar
                    user={user}
                    notificationCount={0}
                    onNotificationsClick={openNotifications}
                />
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

                        {isAdmin ? (
                            <input
                                type="number"
                                step="0.01"
                                value={cgpa}
                                onChange={(e) =>
                                    setCgpa(e.target.value)
                                }
                            />
                        ) : (
                            <p>{cgpa}</p>
                        )}
                    </div>

                    <div>
                        <strong>
                            Graduation Year
                        </strong>

                        {isAdmin ? (
                            <input
                                type="number"
                                value={graduationYear}
                                onChange={(e) =>
                                    setGraduationYear(
                                        e.target.value
                                    )
                                }
                            />
                        ) : (
                            <p>{graduationYear}</p>
                        )}
                    </div>
                </div>

                {isAdmin && (
                    <button
                        onClick={saveProfile}
                    >
                        Save Changes
                    </button>
                )}

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
                    Resume
                </h2>

                {resume ? (
                    <div style={{ padding: "20px" }}>
                        <p>
                            <strong>File:</strong>{" "}
                            {resume.fileName}
                        </p>

                        <p>
                            <strong>Size:</strong>{" "}
                            {resume.fileSizeKB} KB
                        </p>

                        <p>
                            <strong>Uploaded:</strong>{" "}
                            {new Date(
                                resume.uploadDate
                            ).toLocaleString()}
                        </p>

                        <a
                            href={`http://localhost:5220/api/resume/download/${resolvedStudentId}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <button
                                style={{
                                    marginTop: "10px"
                                }}
                            >
                                📄 Download Resume
                            </button>
                        </a>
                        <div style={{ marginTop: "15px" }}>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) =>
                                    setResumeFile(e.target.files[0])
                                }
                            />

                            <button
                                style={{
                                    marginLeft: "10px"
                                }}
                                onClick={uploadResume}
                            >
                                Replace Resume
                            </button>
                        </div>

                        {resumeMessage && (
                            <p>{resumeMessage}</p>
                        )}
                    </div>
                ) : (
                    <div style={{ padding: "20px" }}>
                        <p>No resume uploaded.</p>

                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) =>
                                setResumeFile(e.target.files[0])
                            }
                        />

                        <button
                            style={{
                                marginLeft: "10px"
                            }}
                            onClick={uploadResume}
                        >
                            Upload Resume
                        </button>

                        {resumeMessage && (
                            <p>{resumeMessage}</p>
                        )}
                    </div>
                )}
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