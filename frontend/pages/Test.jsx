import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "../util/api";

function Test() {
    const [bills, setBills] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [filter, setFilter] = useState("");
    const effectRan = useRef(false);

    function buttonNavigate(buttonPagination) {
        const calculatedOffset = buttonPagination * 20;
        console.log("Current Calculated Offset: ", calculatedOffset);

        fetchBills(calculatedOffset);
    }

    function createPagination() {
        let buttonPagination = [];

        for (let i = page ; i <= page + 10; i++) { 
            buttonPagination.push(
                <button onClick={() => buttonNavigate(i, setPage(i))}
                    key={i}>{i}
                 </button>
            );
        }

        return buttonPagination;
    }

    const handleSearch = async (event) => { // event is usually used when trying to use an 'inputs' value for it's onChange function
        try {
            console.log("Fetched Keyword: ", event.target.value);
            console.log("Filter Selected: ", filter);
            const res = await axios.get(
                `${API_BASE_URL}?${filter}=${offset}`
            );
        } catch (err) {
            console.log(err);
        }    
    }

    const fetchBills = async (offset = 0) => {
        setLoading(true);
        try {
            console.log("Fetching with offset:", offset);
            const res = await axios.get(
                // Using offset based pagination because API was sending cursor=20 by default which is wrong. 
                `${API_BASE_URL}?offset=${offset}`
            );  

            // DEBUG
            console.log("API Response:", res.data);
            console.log("Bills count:", res.data.data?.length);
            console.log("Has more:", res.data.pagination?.has_more);

            // Check if we're getting duplicates
            const newBills = Array.isArray(res.data.data) ? res.data.data : [];
            console.log("New bills IDs:", newBills.map(b => b.id));

            setBills(newBills);
            // Calculate next offset
            setOffset(offset);
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
            <form>
                <input type="text" onChange={handleSearch}></input>

                <input type="radio" id="Title" name="filter"  onChange={() => setFilter={"Title"}}></input>
                <label for="Title">Title</label>

                <input type="radio" id="Bill Number" name="filter" onChange={() => setFilter={"name"}}></input>
                <label for="Bill Number">Bill No.</label>

                <input type="radio" id="Author" name="filter" onChange={() => setFilter={"author"}}></input>
                <label for="Author">Author</label>
            </form>
            
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

            {hasMore && (
                createPagination()                
            )}
        </>
    );
}

export default Test