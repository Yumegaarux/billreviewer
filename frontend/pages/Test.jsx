import { useEffect, useState } from "react";
import axios from "axios";

function Test() {
    const [bills, setBills] = useState([]);

    useEffect(() => {
        axios.get("https://open-congress-api.bettergov.ph/api/bills")
            .then(res => {
            setBills(res.data.data);
            });
    }, []);

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