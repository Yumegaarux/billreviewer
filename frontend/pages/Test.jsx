import { useEffect, useState, useRef } from "react";
import axios from "axios";

function Test() {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const effectRan = useRef(false);

    const fetchBills = async (offset = 0) => {
        setLoading(true);
        try {
            console.log("Fetching with offset:", offset);
            const res = await axios.get(
                `http://localhost/billreviewer/billreviewer/backend/api/bills.php?limit=20&congress=20&type=SB&offset=${offset}`
            );

            console.log("API Response:", res.data);
            console.log("Bills count:", res.data.data?.length);
            console.log("Has more:", res.data.pagination?.has_more);

            // Check if we're getting duplicates
            const newBills = Array.isArray(res.data.data) ? res.data.data : [];
            console.log("New bills IDs:", newBills.map(b => b.id));

            setBills(prev => [
                ...prev,
                ...newBills
            ]);

            // Calculate next offset
            const nextOffset = offset + 20;
            setOffset(nextOffset);
            console.log("Next offset:", nextOffset);
            setHasMore(res.data.pagination?.has_more || false);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (effectRan.current) return;
        effectRan.current = true;
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
                <button onClick={() => fetchBills(offset)}>
                    {loading ? "Loading... " : "Load More"}
                </button>
            )}
        </>
    );
}

export default Test