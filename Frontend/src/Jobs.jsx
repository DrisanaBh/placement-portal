import { useEffect, useState } from "react";

function Jobs() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5220/api/jobs")
            .then((res) => res.json())
            .then((data) => setJobs(data));
    }, []);

    return (
        <div>
            <h1 className="page-title">💼 Jobs</h1>

            <div className="table-card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Job Title</th>
                            <th>Company</th>
                        </tr>
                    </thead>

                    <tbody>
                        {jobs.map((job) => (
                            <tr key={job.jobID}>
                                <td>{job.jobID}</td>
                                <td>{job.jobTitle}</td>
                                <td>{job.companyName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Jobs;