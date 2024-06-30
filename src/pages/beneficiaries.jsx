import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useRouter } from "next/router";
import { useState } from "react";

const Beneficiaries = () => {
    const router = useRouter();
    const [selectedStatus, setSelectedStatus] = useState("Aktif");
    const [loading, setLoading] = useState(false);
    const [jumlahKupon, setJumlahKupon] = useState(100);
    const handleFilterChange = (status) => {
        let filtered = [];
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        setLoading(true);
        setSelectedStatus(status);
        if (status === "Aktif") {
            setLoading(false);
        } else if (status === "Hangus") {
            setLoading(false);
        } else if (status === "Selesai") {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="container mx-auto h-screen max-w-480 bg-white flex flex-col">
                <Header title="Beneficiaries" backto="/home" />
                <div className="bg-white h-screen pt-10">
                    <div className={`bg-gradient-to-b ${jumlahKupon === 0 ? "from-[#C1C1C1] to-[#707070]" : "from-[#FF2F2F]  to-[#FFBD5B]"} rounded-lg p-6 my-2 text-white max-w-md mx-auto w-[328px] `}>
                        <div className="flex justify-between">
                            <div className="">
                                <h1 className="text-[24px] font-bold">KUPON BERSAMA</h1>
                                <p className="text-[16px] font-bold">Makan Gratis</p>
                                <p className="text-[10px] italic mt-[24px]">Dapat ditukarkan di merchant Foodia</p>
                            </div>
                            <div className="flex items-end">
                                <div className="pt-[30px] text-center">
                                    <p className="text-[14px]">Tersedia</p>
                                    <p className="text-[36px] font-bold">{jumlahKupon}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 my-2">
                        <button onClick={() => router.push("/beneficiaries/order-merchant?step=1")}
                            disabled={
                                loading ||
                                jumlahKupon === 0
                            }
                            className={`w-full h-14 ${loading || jumlahKupon === 0 ? "text-[#A1A5C1] bg-[#F5F4F8]" : "text-white bg-primary hover:bg-blue-500"} rounded-2xl px-2 font-semibold text-[18px]`}>
                            Klaim Kupon
                        </button>
                    </div>

                    <div className="flex flex-row px-6 py-2 my-2 justify-between">
                        <div
                            className={`cursor-pointer text-center w-full pb-2 text-[16px] ${selectedStatus === "Aktif"
                                ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                                : "text-gray-400 font-bold border border-t-0 border-x-0 border-b-[2px] border-b-transparent"
                                }`}
                            onClick={() => handleFilterChange("Aktif")}
                        >
                            <p>Aktif</p>
                        </div>
                        <div
                            className={`cursor-pointer text-center w-full pb-2 ml-2 text-[16px] ${selectedStatus === "Hangus"
                                ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                                : "text-gray-400 font-bold border border-t-0 border-x-0 border-b-[2px] border-b-transparent"
                                }`}
                            onClick={() => handleFilterChange("Hangus")}
                        >
                            <p>Hangus</p>
                        </div>
                        <div
                            className={`cursor-pointer text-center w-full pb-2 text-[16px] ${selectedStatus === "Selesai"
                                ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                                : "text-gray-400 font-bold border border-t-0 border-x-0 border-b-[2px] border-b-transparent"
                                }`}
                            onClick={() => handleFilterChange("Selesai")}
                        >
                            <p>Selesai</p>
                        </div>
                    </div>

                    {loading && <Loading />}
                </div>
            </div>
            <BottomNav />
        </>
    );
}

export default Beneficiaries;