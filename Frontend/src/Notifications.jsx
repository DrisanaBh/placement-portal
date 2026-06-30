import { useEffect, useState } from "react";
import { FaArrowLeftLong, FaBell } from "react-icons/fa6";

function Notifications({ onBack }) {
    const [notifications, setNotifications] =
        useState([]);

    useEffect(() => {
        const user = JSON.parse(
            localStorage.getItem("user")
        );

        fetch(
            `http://localhost:5220/api/notifications/${user.userID}`
        )
            .then((res) => res.json())
            .then((data) =>
                setNotifications(data)
            );
    }, []);

    return (
        <>
            <button
                className="back-btn"
                onClick={onBack}
            >
                <FaArrowLeftLong />
                Dashboard
            </button>

            <div className="table-card">

                <h2
                    style={{
                        padding: "20px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "12px"
                    }}
                >
                    <FaBell />
                    Notifications
                </h2>

                <table className="data-table">

                    <thead>
                        <tr>
                            <th>Message</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {notifications.map((n) => (
                            <tr key={n.notificationID}>
                                <td>{n.message}</td>

                                <td>
                                    {new Date(
                                        n.createdDate
                                    ).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>
        </>
    );
}

export default Notifications;