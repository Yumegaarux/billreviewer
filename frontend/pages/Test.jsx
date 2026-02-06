import { useEffect, useState } from "react";
import axios from "axios";

function Test() {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost/billreviewer/billreviewer/backend/api/bills.php")
            .then(res => {
            setBills(res.data.data);
            });
    }, []);

    if (loading) return <p>Loading bills...</p>;

    return (
        <>
            <h1>Hello World</h1>

            {bills.map(bill => (
                <div key={bill.id}>
                    <h3>{bill.title}</h3>
                    <p>Status: {bill.status}</p>
                </div>
            ))}
        </>
    );
}

export default Test