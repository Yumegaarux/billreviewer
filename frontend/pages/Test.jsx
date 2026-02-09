import { useEffect, useState } from "react";
import axios from "axios";

function Test() {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cursor, setCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);


    useEffect(() => {
        axios.get("http://localhost/billreviewer/billreviewer/backend/api/bills.php?limit=20&congress=20&type=SB")
            .then(res => {
                setBills(res.data.data);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading bills...</p>;

    return (
        <>
            <h1>Hello World</h1>

            {bills.map(bill => (
                <div key={bill.id}>
                    <h2>Bill Title: {bill.long_title || "No Available Title."}</h2>
                    <h2>Bill No. {bill.name}</h2>
                    <h3>Date Filed: {bill.date_filed}</h3>
                    <p>Status: {bill.status}</p>
                    <p>Subtype: {bill.subtype}</p>

                    {bill.authors.length > 0 ? (
                        bill.authors.map((author) => (
                            <div key={author.id}>
                                <p>Authors: {author.first_name + ' ' + author.middle_name + ' ' + author.last_name}</p>
                            </div>
                        )) 
                    ) : (
                        <p>Authors: No Authors Listed</p>
                    )}
                    
                </div>
            ))}
        </>
    );
}

export default Test