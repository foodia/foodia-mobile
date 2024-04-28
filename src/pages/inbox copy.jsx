import BottomNav from "@/components/BottomNav";
import CardInbox from "@/components/CardInbox";
import { useState } from "react";

const inbox = (inbox) => {
    const [activeOption, setActiveOption] = useState('Donator');

    const handleOptionClick = (option) => {
        setActiveOption(option);
    };
    return (
        <>
            <div className="container mx-auto h-screen max-w-480 bg-white flex flex-col">
                <div className="bg-white h-10 bottom-0 my-0  rounded-md mt-2 mx-2 grid grid-cols-2  place-content-center">
                    <div className={` h-10 w-full col-span-2 flex justify-center items-center`}>
                        <h1 className="text-xl font-bold">Inbox</h1>
                    </div>
                </div>
                <div className="flex flex-row px-4 py-4 justify-between items-end">
                    <div className={`w-full cursor-pointer text-center relative group text-lg font-semibold ${activeOption === "Donator" ? 'text-emerald-600' : 'text-gray-500'} ${activeOption === "Donator" ? 'font-bold' : ''}`} onClick={() => handleOptionClick("Donator")}>
                        <span>Donator</span>
                        <hr className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full border-t-2 ${activeOption === "Donator" ? 'border-emerald-600' : 'border-transparent'}`} />
                    </div>
                    <div className={`w-full cursor-pointer text-center relative group text-lg font-semibold ${activeOption === "Detonator" ? 'text-emerald-600' : 'text-gray-500'} ${activeOption === "Detonator" ? 'font-bold' : ''}`} onClick={() => handleOptionClick("Detonator")}>
                        <span>Detonator</span>
                        <hr className={`absolute bottom-0 left-1/2 transform -translate-x-1/2  w-full border-t-2 ${activeOption === "Detonator" ? 'border-emerald-600' : 'border-transparent'}`} />
                    </div>
                    <div className={`w-full cursor-pointer text-center relative group text-lg font-semibold ${activeOption === "Merchant" ? 'text-emerald-600' : 'text-gray-500'} ${activeOption === "Merchant" ? 'font-bold' : ''}`} onClick={() => handleOptionClick("Merchant")}>
                        <span>Merchant</span>
                        <hr className={`absolute bottom-0 left-1/2 transform -translate-x-1/2  w-full border-t-2 ${activeOption === "Merchant" ? 'border-emerald-600' : 'border-transparent'}`} />
                    </div>
                </div>
                {/* <CardInbox /> */}

                <CardInbox
                    status="Campain Baru"
                    title="Bagi Makanan Jumat Barokah"
                    desc="Ada campaign baru loh, yuk intip detailnya, dan mari bantu sesama"
                    url="/campBaru"
                />

                <CardInbox
                    status="Campaign Selesai"
                    title="TEBAR 1000 PAKET NASI JUMAT BERKAH"
                    desc="Campaign telah selesai, mari cek detail campaign nya"
                    url="/campSelesai"
                />
                <CardInbox
                    status="Laporan Campaign"
                    title="TEBAR 1000 PAKET NASI JUMAT BERKAH"
                    desc="Buka untuk cek laporan kegiatan campaign"
                    url="/LaporanCamp"
                />

            </div>
            <BottomNav />
        </>
    );
}

export default inbox;