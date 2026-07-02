import { useEffect, useState } from "react";
import TopBar from "./components/TopBar";
import {
    FaBuilding,
    FaChartLine,
    FaUserTie,
    FaGraduationCap,
    FaPenToSquare,
    FaFileLines,
    FaUsers,
    FaBriefcase
} from "react-icons/fa6";


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
    const [editing, setEditing] = useState(false);

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

    <div className="profile-header">

        <h2>My Profile Overview</h2>

        <button
            className="edit-profile-btn"
            onClick={() => setEditing(!editing)}
        >
            <FaPenToSquare />
            <span>
                {editing ? "Done" : "Edit Profile"}
            </span>
        </button>

    </div>

    <div className="profile-summary">

        <div className="summary-item">

    <div className="summary-icon">
        <FaBuilding />
    </div>

    <div className="summary-content">
        <h4>Department</h4>
        <p>{student.department}</p>
    </div>

</div>

        <div className="summary-item">

            <div className="summary-icon">
                <FaChartLine />
            </div>

                        <div className="summary-content">
                            <h4>CGPA</h4>
                            <p>{cgpa}</p>
                        </div>

        </div>

        <div className="summary-item">

            <div className="summary-icon">
                <FaUserTie />
            </div>

                        <div className="summary-content">
                            <h4>Mentor</h4>
                            <p>
                                {student.facultyName || "Not Assigned"}
                            </p>
                        </div>

        </div>

        <div className="summary-item">

            <div className="summary-icon">
                <FaGraduationCap />
            </div>

                        <div className="summary-content">
                            <h4>Graduation Year</h4>
                            <p>{graduationYear}</p>
                        </div>

        </div>

    </div>

</div>
            <div className="stats-grid">

                <div className="dashboard-card">

                    <div className="card-top">

                        <div className="card-icon">
                            <FaFileLines />
                        </div>

                        <div className="card-value">
                            <h2>{applications.length}</h2>
                            <span>Applications</span>
                        </div>

                    </div>

                    <p className="card-footer">
                        Total jobs you applied
                    </p>

                </div>


                <div className="dashboard-card">

                    <div className="card-top">

                        <div className="card-icon">
                            <FaUsers />
                        </div>

                        <div className="card-value">
                            <h2>{interviews}</h2>
                            <span>Interviews</span>
                        </div>

                    </div>

                    <p className="card-footer">
                        Interviews scheduled
                    </p>

                </div>


                <div className="dashboard-card offer-card">

                    <div className="card-top">

                        <div className="card-icon">
                            <FaBriefcase />
                        </div>

                        <div className="card-value">
                            <h2>{offers}</h2>
                            <span>Offers</span>
                        </div>

                    </div>

                    <p className="card-footer">
                        Offers received
                    </p>

                </div>

            </div>
            {editing && (

                <div className="edit-panel">

                    <div className="edit-panel-header">

                        <h2>Edit Profile</h2>

                        <button
                            className="close-edit-btn"
                            onClick={() => setEditing(false)}
                        >
                            ✕
                        </button>

                    </div>

                    <div className="edit-tabs">

                        <button className="active-tab">
                            Resume
                        </button>

                        <button>
                            Skills
                        </button>

                    </div>

                    <div className="edit-panel-content">

                        <div className="resume-card">

                            <h3>Resume</h3>

                            {resume ? (

                                <>

                                    <p>
                                        <strong>File:</strong> {resume.fileName}
                                    </p>

                                    <p>
                                        <strong>Size:</strong> {resume.fileSizeKB} KB
                                    </p>

                                    <p>
                                        <strong>Uploaded:</strong>{" "}
                                        {new Date(
                                            resume.uploadDate
                                        ).toLocaleString()}
                                    </p>

                                    <div className="resume-buttons">

                                        <a
                                            href={`http://localhost:5220/api/resume/download/${resolvedStudentId}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <button>
                                                Download Resume
                                            </button>
                                        </a>

                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) =>
                                                setResumeFile(
                                                    e.target.files[0]
                                                )
                                            }
                                        />

                                        <button
                                            onClick={uploadResume}
                                        >
                                            Replace Resume
                                        </button>

                                    </div>

                                </>

                            ) : (

                                <>

                                    <p>
                                        No resume uploaded.
                                    </p>

                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) =>
                                            setResumeFile(
                                                e.target.files[0]
                                            )
                                        }
                                    />

                                    <button
                                        onClick={uploadResume}
                                    >
                                        Upload Resume
                                    </button>

                                </>

                            )}

                            {resumeMessage && (
                                <p>{resumeMessage}</p>
                            )}

                        </div>

                        <div className="skills-card">

                            <h3>Skills</h3>

                            <div className="skill-input-row">

                                <input
                                    type="text"
                                    value={newSkill}
                                    placeholder="Add a skill"
                                    onChange={(e) =>
                                        setNewSkill(
                                            e.target.value
                                        )
                                    }
                                />

                                <button
                                    onClick={addSkill}
                                >
                                    Add Skill
                                </button>

                            </div>

                            <div className="skills-list">

                                {skills.map((skill) => (

                                    <div
                                        className="skill-chip"
                                        key={skill.skillID}
                                    >

                                        <span>
                                            {skill.skillName}
                                        </span>

                                        <button
                                            onClick={() =>
                                                deleteSkill(
                                                    skill.skillID
                                                )
                                            }
                                        >
                                            ✕
                                        </button>

                                    </div>

                                ))}

                            </div>

                        </div>

                    </div>

                </div>

            )}
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