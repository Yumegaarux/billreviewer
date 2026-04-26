import { useEffect, useState, useRef } from "react";
import { useParams , useLocation } from "react-router-dom";

import BillSummary from "../components/BillSummary.jsx";

export default function Details() {
    const { id } = useParams(); // uses the params that was passed on in NavLink call.
    const { state } = useLocation();
    const bill = state?.bill;

    return(
        <div className="flex flex-col">
            <div className="m-1.5 bg-white border border-gray-200 rounded-md">
                <div className="m-3">
                    <h1 className="text-2xl">{bill.long_title}</h1>
                    <h3>Filed on: {bill.date_filed}</h3>
                </div>
            </div>
            <div className="flex flex-row">
                <BillSummary bill={bill}>
                </BillSummary>
                <div className="m-1.5 bg-white border border-gray-200 rounded-md p-2">
                    <h2>Avg. Rating:</h2>
                </div>
                <div className="m-1.5 bg-white border border-gray-200 rounded-md p-2">
                    <h2>Comments Received:</h2>
                </div>
                <div className="m-1.5 bg-white border border-gray-200 rounded-md p-2">
                    <h2 className="text-center">Authors:</h2>
                    <h2>{bill.authors_raw}</h2>
                </div>
            </div>
        </div>
    );
};