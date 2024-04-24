import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import Link from "next/link";
import { useState } from "react";

const mydonation = (mydonation) => {
    const [bulanOptions, setBulanOptions] = useState([]);

    // Fungsi untuk mengambil lima bulan terbaru
    const getLatestMonths = () => {
        const today = new Date();
        const months = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

        for (let i = 0; i < 5; i++) {
            let month = today.getMonth() - i;
            let year = today.getFullYear();
            if (month < 0) {
                month += 12;
                year -= 1;
            }
            months.push(`${monthNames[month]} ${year}`);
        }
        return months;
    };

    // Memperbarui state bulanOptions dengan lima bulan terbaru
    useState(() => {
        setBulanOptions(getLatestMonths());
    }, []);

    return (
        <>
            <div className="container mx-auto h-screen max-w-480 bg-white flex flex-col">
                <Header title="Donasi Saya" />
                <div className="bg-white h-screen mt-12 justify-cente px-4">
                    <div className="bg-primary w-full h-[91px] px-4 py-2 rounded-lg">
                        <div className="flex justify-between text-white font-semibold text-base">
                            <p>Total Donasi</p>
                            <p>Rp 0</p>
                        </div>
                        <hr className="mt-2 h-[1px] bg-white" />
                        <div className="flex justify-between text-white font-semibold text-base">
                            <p>Total Donasi</p>
                            <p>Rp 0</p>
                        </div>
                        {/* Input Dropdown */}
                        <div class="">
                            <select class="text-[12px] font-semibold text-white custom-select w-20 h-[25px] py-auto rounded-md bg-primary border border-primary focus:outline-none focus:border-primary">
                                {/* <option value="" className="bg-white">Mar 2024</option> */}
                                {bulanOptions.map((bulan, index) => (
                                    <option key={index} value={bulan} className="bg-white text-black">{bulan}</option>
                                ))}

                            </select>
                        </div>
                    </div>

                    <div className="bg-blue-800 w-full h-[60px] px-4 py-2 mt-2 rounded-lg">

                        <div className="flex justify-between items-center text-white font-semibold text-base">
                            <div className="">
                                <p className="font-bold">Tabunganku</p>
                                <p className="text-xs">Akan dikelola oleh Foodia</p>
                            </div>
                            <p className="">Rp 0</p>
                        </div>
                    </div>


                    <div className=" w-full h-[140px] px-2 py-2 mt-2.5 rounded-lg shadow-[0px_0px_8px_0px_#00000024]">
                        <div className="flex justify-between items-center  font-semibold text-[10px]">
                            <div className="">
                                <p className="font-bold">Tanggal Donasi</p>
                                <p className="">22 Maret 2024 15:30 WIB</p>
                            </div>
                            <p className="text-sm font-bold text-primary">Rp 100.000</p>
                        </div>
                        <hr className="mt-2 h-[1px] bg-gray-200" />
                        <div className="">
                            <h1 className=" font-bold text-sm">
                                TEBAR 1000 PAKET NASI JUMAT BERKAH
                            </h1>
                            <p className=" font-normal text-xs">Kav Barokah, Gg. Ceria I, Bahagia, Kec. Babelan, Kabupaten Bekasi, Jawa Barat 17121</p>
                        </div>
                        <hr className="mt-2 h-[1px] bg-gray-200" />
                        <div class="flex justify-between items-center font-semibold text-xs mt-1 text-primary">
                            <button class="text-sm font-semibold w-full focus:outline-none">Detail Donasi</button>
                            <hr class="w-1 h-5 bg-gray-200 mx-2" />
                            <button class="text-sm font-semibold w-full focus:outline-none">Campaign</button>
                        </div>
                    </div>

                    <div className=" w-full h-[140px] px-2 py-2 mt-2.5 rounded-lg shadow-[0px_0px_8px_0px_#00000024]">
                        <div className="flex justify-between items-center  font-semibold text-[10px]">
                            <div className="">
                                <p className="font-bold">Tanggal Donasi</p>
                                <p className="">22 Maret 2024 15:30 WIB</p>
                            </div>
                            <p className="text-sm font-bold text-blue-800">Rp 100.000</p>
                        </div>
                        <hr className="mt-2 h-[1px] bg-gray-200" />
                        <div className="">
                            <h1 className=" font-bold text-sm">
                                TEBAR 1000 PAKET NASI JUMAT BERKAH
                            </h1>
                            <p className=" font-normal text-xs">Kav Barokah, Gg. Ceria I, Bahagia, Kec. Babelan, Kabupaten Bekasi, Jawa Barat 17121</p>
                        </div>
                        <hr className="mt-2 h-[1px] bg-gray-200" />
                        <div class="flex justify-between items-center font-semibold text-xs mt-1 text-primary">
                            <button class="text-sm font-semibold w-full focus:outline-none">Detail Donasi</button>
                            <hr class="w-1 h-5 bg-gray-200 mx-2" />
                            <button class="text-sm font-semibold w-full focus:outline-none">Campaign</button>
                        </div>
                    </div>
                </div>
            </div>
            <BottomNav />
        </>
    );

}

export default mydonation;