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

    const [selectedRating, setSelectedRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);

    const bill = state?.bill;
    const billNo = bill?.name;

    const handleComments = async (billid) => {
        try{
            const res = await axios.get(
                `${API_BASE_URL}${API_ENDPOINTS.COMMENTS}/${billid}`
            );
            return res.data;
            console.log(`${API_BASE_URL}${API_ENDPOINTS.COMMENTS}/${billid}`);
            console.log(res);
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    const handleStars = (rating) => {   
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={16}
                fill={i < rating ? "gold" : "none"}
                strokeWidth={1}
                color={i < rating ? "gold" : "gray"}
            />
        ));
    };

    const handleRating = (rating) => {
        setSelectedRating(rating);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        
    };

    useEffect(() => {
        handleComments(billNo).then(data => setReviews(data)); 
    }, [])


    return(
        <div className="flex flex-col">
            <div className="m-1.5 bg-white border border-gray-200 rounded-md">
                <div className="m-3">
                    <h1 className="text-2xl">{bill.long_title}</h1>
                    <div className="flex flex-row justify-between items-baseline">
                        <div className="border border-gray-200 p-2 rounded-md">
                            <h3>Filed on: {bill.date_filed}</h3>
                        </div>
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
                            <div className="flex flex-row gap-2 items-baseline">
                                <User className="w-5 h-5 text-gray-500" />
                                <p className="text-xl">{review.fname} {review.lname}</p>
                                {handleStars(review.rating)}
                            </div>
                            <div className="flex flex-row">
                                <p>{review.body}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col m-1.5 bg-white border border-gray-200 rounded-md p-2 px-5 gap-3">
                <h1>Add a Comment</h1>
                <div className="flex flex-row gap-2 ">
                    <User className="w-5 h-5 text-gray-500" />

                    <form onSubmit={handleSubmit} className="flex-1">
                        <textarea
                            placeholder="Write your review..."
                            rows={4}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />

                        <div className="flex flex-row justify-end items-center gap-3.5">
                            <p className="text-sm text-gray-500">{selectedRating > 0 ? `${selectedRating} out of 5` : "Select a rating"}</p>
                            <div className="flex flex-row">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <Star
                                        key={i}
                                        size={24}
                                        fill={(hoveredRating || selectedRating) > i ? "gold" : "none"}
                                        strokeWidth={1}
                                        color={(hoveredRating || selectedRating) > i ? "gold" : "gray"}
                                        className="cursor-pointer"
                                        onClick={() => handleRating(i + 1)}
                                        onMouseEnter={() => setHoveredRating(i + 1)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-700 text-white text-sm px-4 py-2 rounded-sm hover:bg-blue-800"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};