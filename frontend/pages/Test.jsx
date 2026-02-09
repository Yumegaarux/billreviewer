import { useEffect, useState } from "react";
import axios from "axios";

function Test() {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cursor, setCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchBills = async (cursor = null) => {
        setLoading(true);
        try {
            const res = await axios.get(
                `http://localhost/billreviewer/billreviewer/backend/api/bills.php?limit=20&congress=20&type=SB${cursor ? `&cursor=${cursor}` : ""}`
            );
            console.log(cursor);

            // prev is basically the current state of bills before the update (also a parameter).
            // ... spreads out the elements of an array, with ... both arrays remain flat.
            setBills(prev => [
                ...prev,
                ...(Array.isArray(res.data.data) ? res.data.data : [])
            ]);

            // store API cursor to React cursor for future use like in axios.
            // next_cursor is used to tell where to start the next bar
            setCursor(res.data.pagination?.next_cursor || null);
            console.log(res.data.pagination?.next_cursor);
            setHasMore(res.data.pagination?.has_more || false);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBills();
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

            {hasMore && (
                <button onClick={() => fetchBills(cursor)}>
                    {loading ? "Loading... " : "Load More"}
                </button>
            )}
        </>
    );
}

export default Test