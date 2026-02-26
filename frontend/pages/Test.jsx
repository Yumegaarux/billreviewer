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
    const [searchVal, setSearchVal] = useState("");
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

    // async functions allow the user to do other functions until 'await' is finished.
    // it doesn't stuck the whole system up freezing waiting for a function to finish.
    const handleSearch = async (event) => { // event is usually used when trying to use an 'inputs' value for it's onChange function
        try {
            setLoading(true);

            console.log("Fetched Keyword: ", searchVal);

            const res = await axios.get(`${API_BASE_URL}/search/documents`, {
                params: {
                    q: searchVal,
                }
            });
            // 'axios' converts 'params' into query string parameters like '?filter=title&keyword='block' 
            console.log("Handle Search Running...");
            console.log("Axios Get: ", `${API_BASE_URL}/search/documents?q=${searchVal}`);

            const newBills = Array.isArray(res.data.data) ? res.data.data : [];
            console.log("New Billz: ", newBills);

            setBills(newBills);
            setLoading(false);
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

    function clearSearch(){
        
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            searchVal === "" ? fetchBills() : handleSearch(searchVal);
        }, 425)

        return () => clearTimeout(delayDebounce);

    }, [searchVal]);

    return (
        <>
            <button onClick={fetchBills}>Back</button>
            <input type="text" value = {searchVal} onChange={(e) => setSearchVal(e.target.value)} className="searchBar"></input>
{/* 
                <input type="radio" id="Title" name="filter"  onChange={() => setFilter("Title")}></input>
                <label for="Title">Title</label>

                <input type="radio" id="Bill Number" name="filter" onChange={() => setFilter("name")}></input>
                <label for="Bill Number">Bill No.</label>

                <input type="radio" id="Author" name="filter" onChange={() => setFilter("author")}></input>
                <label for="Author">Author</label> */}
            
            {loading && <p>Loading Bills</p>}

            {!loading && bills.map(bill => (
                <div key={bill.id} className="">
                    <h2>Bill Title: {bill.title || "No Available Title."}</h2>
                    <h2>Bill No. {bill.name}</h2>
                    <h3>Date Filed: {bill.date_filed}</h3>
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

            {/* Condition && Expression */}
            {hasMore && !loading && (
                createPagination()              
            )}
        </>
    );
}

export default Test