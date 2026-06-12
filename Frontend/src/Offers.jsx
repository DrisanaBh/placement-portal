import { useEffect, useState } from "react";

function Offers() {
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5220/api/applications")
            .then((res) => res.json())
            .then((data) => {
                const offerData = data.filter(
                    (app) => app.status === "Offer"
                );

                setOffers(offerData);
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <div>
            <h1 className="page-title">🏆 Offers</h1>

            <div className="table-card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Company</th>
                            <th>Job Title</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {offers.map((offer, index) => (
                            <tr key={index}>
                                <td>{offer.fullName}</td>
                                <td>{offer.companyName}</td>
                                <td>{offer.jobTitle}</td>
                                <td>🎉 {offer.status}</td>
                                <td>
                                    {new Date(
                                        offer.appliedDate
                                    ).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Offers;