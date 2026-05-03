import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../../util/api";
import { NavLink } from "react-router-dom";

function Test() {
    const [bills, setBills] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchVal, setSearchVal] = useState("");

    function buttonNavigate(i) {
        const calculatedOffset = (i-1) * 20;
        console.log("Current Calculated Offset: ", calculatedOffset); 

        fetchBills(calculatedOffset);
    }

    function createPagination() {
        console.log("Pagination Created!");
        const totalPages = Math.ceil(total / 20); // 'ceil' - rounds up to nearest whole num.
                                                 // ex: 1.05 -> 2.
        const windowSize = 10;                  // 'floor' - rounds down.
                                            
        // Math.max picks the highest val, 1 is placed to ensure page don't go below 1.
        const start = Math.max(1, page - Math.floor(windowSize / 2));  
        const end = Math.min(totalPages, start + windowSize - 1);

        console.log("START VALUE: ", start);
        console.log("END VALUE: ", end);

        let buttonPagination = [];
        
        for (let i = start; i <= end; i++) {
            buttonPagination.push(
                <button 
                    onClick={() => {
                        setPage(i);
                        buttonNavigate(i);
                    }}
                    key={i}
                    style={{ fontWeight: i === page ? 'bold' : 'normal' }} 
                    className="p-2 px-3 border border-gray-300 rounded-md ml-1 cursor-pointer hover:bg-blue-50 duration-200"
                >
                    {i}
                </button>
            );
        };
        return buttonPagination;
    }

    function handleBack() {
        console.log("handleBack active");
        setLoading(true);
        setPage(1);
        setSearchVal("");

        const searchBar = document.querySelectorAll("searchBar");
        searchBar.value = "";

        setLoading(false);
    }

    // async functions allow the user to do other functions until 'await' is finished.
    // it doesn't stuck the whole system up freezing waiting for a function to finish.
    // event is usually used when trying to use an 'inputs' value for it's onChange function

    const fetchBills = async (offset = 0) => {
        setLoading(true);
        try {
            console.log("Fetching with offset:", offset);
            let res;
            if (searchVal === '') {
                res = await axios.get(
                    // Using offset based pagination because API was sending cursor=20 by default which is wrong. 
                    `${API_BASE_URL}${API_ENDPOINTS.BILLS}?offset=${offset}`
                );      
                
            } else {
                res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.BILLS}/search/documents`, {
                    params: {
                        q: searchVal,
                        'offset': offset,
                    }
                });

                setPage(1);
            }
            console.log( `${API_BASE_URL}${API_ENDPOINTS.BILLS}?offset=${offset}`);
            // DEBUG
            console.log("API Response:", res.data);
            console.log("Bills count:", res.data.data?.length); // '?' safely returns undefined if pagination is null/undefined
            console.log("Has more:", res.data.pagination?.has_more);
            console.log("Total Left: ", res.data.pagination?.total);
            // Check if we're getting duplicates
            const newBills = Array.isArray(res.data.data) ? res.data.data : [];
            console.log("New bills IDs:", newBills.map(b => b.id));

            setBills(newBills);
            setTotal(res.data.pagination?.total);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchBills();
        }, 425)

        return () => clearTimeout(delayDebounce);

    }, [searchVal]);

    return (
        <>
            <div className="flex flex-row">
                <button className="p-1 bg-white border border-gray-200 rounded-md mr-2.5 cursor-pointer hover:bg-blue-50 duration-200" onClick={handleBack}>Back</button>
                <input type="text" value = {searchVal} onChange={(e) => setSearchVal(e.target.value)} className="searchBar bg-white rounded-sm inset-shadow-sm border border-gray-300"></input>
                <div className="ml-auto">
                    {!loading && ( createPagination() )}
                </div>
            </div>
{/* 
                <input type="radio" id="Title" name="filter"  onChange={() => setFilter("Title")}></input>
                <label for="Title">Title</label>

                <input type="radio" id="Bill Number" name="filter" onChange={() => setFilter("name")}></input>
                <label for="Bill Number">Bill No.</label>

                <input type="radio" id="Author" name="filter" onChange={() => setFilter("author")}></input>
                <label for="Author">Author</label> */}
            
            {loading && <p>Loading Bills</p>}

            {!loading && bills.map(bill => (
                <NavLink key={bill.id} 
                    className="flex flex-col justify-between p-1 border border-gray-300 rounded-md my-2 cursor-pointer hover:bg-white duration-200"
                    to={`/details/${bill.id}`}
                    state={{ bill }} 
                >
                        <div className="flex flex-row gap-10 p-1">
                            <h2 className="font-medium text-3xl">{bill.title || "No Available Title."}</h2>
                            <h2 className="text-2xl ml-auto">{bill.name}</h2>
                        </div>
                        <div className="p-1">
                            <h3>Date Filed: {bill.date_filed}</h3>

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
                </NavLink>
            ))}

            {/* Condition && Expression */}
            {!loading && (
                createPagination()              
            )}
        </>
    );
}

export default Test