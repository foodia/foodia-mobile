import SlideCard from "@/components/SlideCard";
import { useAppState } from "@/components/page/UserContext";
import styles from "@/styles/Home.module.css"
import { IconBuildingStore, IconCheck } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";


const BuktiPembayaran = () => {
    const router = useRouter();
    const { state, setDonation } = useAppState();



    return (

        <main className="">
            <div className="container my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
                <div className="container mx-auto mt-24  h-screen p-4">
                    <div className="p-4  w-full mb-4   bg-white shadow-[rgba(0,0,15,0.5)_0px_0px_10px_2px] rounded-lg">
                        <div className="flex justify-center items-center mb-4">
                            <div className=" h-16 w-16 rounded-full bg-primary grid justify-items-center items-center text-white">
                                <IconCheck size={30} />
                            </div>
                        </div>
                        <div className="flex justify-center items-center mb-2">
                            <p className="font-bold">Payment Total</p>
                        </div>
                        <div className="flex justify-center items-center">
                            <p className="text-3xl font-bold text-primary">Rp. 100.000</p>
                        </div>
                        <hr className="w-full h-1 mx-auto my-2 bg-gray-300 rounded" />
                        <div className="flex justify-between mb-2">
                            <h1 className="font-bold text-gray-400">Tanggal</h1>
                            <p className="font-semibold">12 Mei 2024</p>
                        </div>
                        <div className="flex justify-between mb-2">
                            <h1 className="font-bold text-gray-400">Detail</h1>
                            <p className="font-semibold">Donasi</p>
                        </div>
                        <div className="flex justify-between mb-2">
                            <h1 className="font-bold text-gray-400">Nomer Referensi</h1>
                            <p className="font-semibold">A06453826151</p>
                        </div>
                        <div className="flex justify-between mb-2">
                            <h1 className="font-bold text-gray-400">Akun</h1>
                            <p className="font-semibold">A06453826151</p>
                        </div>

                        <div className="flex justify-between mb-2">
                            <h1 className="font-bold text-gray-400">Metode Pembayaran</h1>
                            <p className="font-semibold">LinkAja</p>
                        </div>
                        <div className="flex justify-between">
                            <h1 className="font-bold text-gray-400">Total Pembayaran</h1>
                            <p className="font-semibold">Rp. 100.000</p>
                        </div>

                        <hr className="w-full h-1 mx-auto my-2 bg-gray-300 rounded" />
                        <div className="flex justify-between">
                            <h1 className="font-bold text-gray-400">Total Pembayaran</h1>
                            <p className="font-semibold text-primary">Rp. 100.000</p>
                        </div>

                    </div>

                    <Link href="/home" className="flex justify-center items-center mb-2 bg-primary p-4 rounded-lg hover:shadow-[rgba(0,0,15,0.5)_0px_0px_10px_2px]">
                        <p className="font-bold">Selesai</p>
                    </Link>





                </div>

            </div>

        </main>


    );
}

export default BuktiPembayaran;