import { useEffect, useState, useRef } from "react";
import axios from "axios";

function Test() {
    const [bills, setBills] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const effectRan = useRef(false);

    function buttonNavigate(buttonPagination) {
        fetchBills()
    }

    function createPagination() {
        let i = page;
        let buttonPagination = [];

        for (i ; i <= page + 10; i++) {
            console.log(i);
            buttonPagination.push(<button onClickkey={i}>{i}</button>);
        }
        return buttonPagination;
    }

    const fetchBills = async (offset = 0) => {
        setLoading(true);
        try {
            console.log("Fetching with offset:", offset);
            const res = await axios.get(
                // Using offset based pagination because API was sending cursor=20 by default which is wrong. 
                `http://localhost/billreviewer/billreviewer/backend/api/bills.php?limit=20&congress=20&type=SB&offset=${offset}`
            );  

            console.log("API Response:", res.data);
            console.log("Bills count:", res.data.data?.length);
            console.log("Has more:", res.data.pagination?.has_more);

            // Check if we're getting duplicates
            const newBills = Array.isArray(res.data.data) ? res.data.data : [];
            console.log("New bills IDs:", newBills.map(b => b.id));

            // prev is basically the current state of bills before the update (also a parameter).
            // ... spreads out the elements of an array, with ... both arrays remain flat.
            setBills(prev => [
                ...prev,
                ...newBills
            ]);
            // Calculate next offset
            setOffset(nextOffset);
            console.log("Next offset:", nextOffset);

            // API returns if this pagination still has more.
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
            {bills.map(bill => (
                <div key={bill.id} className="">
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
            {createPagination()}
            {/* {hasMore && (
                
            )}; */}
        </>
    );
}

export default Test