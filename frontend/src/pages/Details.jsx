import { useEffect, useState, useRef } from "react";
import { useParams , useLocation } from "react-router-dom";

import BillSummary from "../components/BillSummary.jsx";
import SenatorAvatar from "../components/SenatorAvatar.jsx";
import { MessageSquare, Star, User } from "lucide-react";
import { API_BASE_URL, API_ENDPOINTS } from "../../util/api.js";
import axios from "axios";

export default function Details() {
    const { id } = useParams(); // uses the params that was passed on in NavLink call.
    const { state } = useLocation();

    const [rating, setRating] = useState(3.2);
    const [totalComments, setTotalComments] = useState(0.5);

    const [reviews, setReviews] = useState ([]);

    const bill = state?.bill;
    const billNo = bill?.name;

    const handleComments = async (billid) => {
        try{
            const res = await axios.get(
                `${API_BASE_URL}${API_ENDPOINTS.COMMENTS}/${billid}`
            );
            console.log(`${API_BASE_URL}${API_ENDPOINTS.COMMENTS}/${billid}`);
            console.log(res);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        handleComments(billNo).then(data => setReviews(data)); 
    }, [])

    return(
        <div className="flex flex-col">
            <div className="m-1.5 bg-white border border-gray-200 rounded-md">
                <div className="m-3">
                    <h1 className="text-2xl">{bill.long_title}</h1>
                    <div className="flex flex-row justify-between">
                        <h3>Filed on: {bill.date_filed}</h3>
                        <div className=" border border-gray-200 p-2 rounded-md">
                            <h3 className="text-2xl">{bill.name}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-row">
                <BillSummary bill={bill}/>
                <div className="flex flex-col m-1.5 bg-white border border-gray-200 rounded-md p-2 px-5">
                    <h2 className="text-center">Avg. Rating:</h2>
                    <div className="flex items-center justify-center h-full">
                        <h1 className="text-2xl">{rating}</h1>
                        <Star size={30} fill="yellow" strokeWidth={1} color="gray"/>
                    </div>
                </div>
                <div className="flex flex-col m-1.5 bg-white border border-gray-200 rounded-md p-2 px-5">
                    <h2 className="text-center">Comments Received:</h2>
                    <div className="flex items-center justify-center h-full">
                        <h1 className="text-2xl">{totalComments}</h1>   
                        <MessageSquare size={30} fill="aqua" strokeWidth={1} color="gray"/> 
                    </div>
                </div>
                <div className="flex flex-col m-1.5 bg-white border border-gray-200 rounded-md p-2 px-5">
                    <h2 className="text-center">Authors:</h2>
                    <div className="flex flex-col gap-2">
                        {bill.authors.map((author) => {
                            const fullName = `${author.last_name}, ${author.first_name}`;
                            return (
                                <div key={author.id} className="flex items-center justify-start gap-2 w-52 h-10 mt-2 border-gray-200">
                                    <SenatorAvatar name={fullName} />
                                    <span>{author.first_name} {author.last_name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col m-1.5 bg-white border border-gray-200 rounded-md p-2 px-5">
                <h1>Bill Reviews</h1>
                {reviews.map((review) => {
                    return(
                        <div className="flex flex-col m-1.5 bg-white border border-gray-200 rounded-md p-2 px-5">
                            <div>
                                <User className="w-5 h-5 text-gray-500" />
                            </div>
                        </div>
                    );
                })}
                
            </div>
        </div>
    );
};