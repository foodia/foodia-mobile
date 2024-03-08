import Loading from "@/components/Loading";
import React, { useState } from "react";

export default function Tes() {
    const [loading, setLoading] = useState(false);

    return (
        <>
            <div className="container mx-auto h-screen max-w-480 bg-white flex justify-center items-center">
                <button onClick={() => setLoading(!loading)} className="text-white text-center rounded-xl bg-primary p-2 w-full flex justify-center items-center">
                    <span className="btn-loader mr-2"></span>
                    <p>button</p>
                </button>
                {loading && (
                    <Loading />
                )}
            </div>

        </>
    );
}
