import { useEffect, useState } from "react";

function Notifications() {
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
        <div className="table-card">
            <h2 style={{ padding: "20px" }}>
                🔔 Notifications
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
    );
}

export default Notifications;