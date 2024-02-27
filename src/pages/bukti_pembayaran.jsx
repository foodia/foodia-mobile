import SlideCard from "@/components/SlideCard";
import { useAppState } from "@/components/page/UserContext";
import styles from "@/styles/Home.module.css"
import { IconBuildingStore, IconCheck } from "@tabler/icons-react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";


const BuktiPembayaran = () => {
    const router = useRouter();
    console.log("router", router.query.external_id);
    const external_id = router.query.external_id;
    const { state, setDonation } = useAppState();
    // const [external_id, setExternal_id] = useState(router.query.external_id);
    const [pembayaran, setPembayaran] = useState("");

    // useEffect(() => {
    //     setExternal_id(router.query.external_id);
    // }, [router]);

    useEffect(() => {
        const resspone = axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}donation/transaction/${external_id}`)
            .then((response) => {
                setPembayaran(response.data.body);
                console.log("pembayaran", response.data.body);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
    }, [router]);


    return (

        <main className="">
            <div className="container my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
                <div className="container mx-auto mt-24  h-screen p-4">
                    <div className="p-4  w-full mb-4   bg-white shadow-[rgba(0,0,15,0.5)_0px_0px_10px_2px] rounded-lg">
                        <div className="flex justify-center items-center mb-4 animate-zoom">
                            <div className="h-16 w-16 rounded-full bg-primary grid justify-items-center items-center text-white">
                                <IconCheck size={30} />
                            </div>
                        </div>
                        <div className="flex justify-center items-center mb-2">
                            <p className="font-bold">Payment Total</p>
                        </div>
                        <div className="flex justify-center items-center">
                            <p className="text-3xl font-bold text-primary">{pembayaran.amount ? pembayaran.amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : 'Rp 0,00'}</p>

                        </div>
                        <hr className="w-full h-1 mx-auto my-2 bg-gray-300 rounded" />
                        <div className="flex justify-between mb-2">
                            <h1 className="font-bold text-gray-400">Tanggal</h1>
                            {/* <p className="font-semibold"> {pembayaran.transaction_date}</p> */}
                            <p className="font-semibold">{pembayaran.transaction_date ? new Date(pembayaran.transaction_date).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', '') : '00/00/0000 00:00'}</p>


                        </div>
                        <div className="flex justify-between mb-2">
                            <h1 className="font-bold text-gray-400">Detail</h1>
                            <p className="font-semibold">{pembayaran ? 'Donasi' : '-'}</p>
                        </div>
                        <div className="flex justify-between mb-2">
                            <h1 className="font-bold text-gray-400">Nomer Referensi</h1>
                            <p className="font-semibold">{pembayaran.id ? pembayaran.id : '-'}</p>
                        </div>
                        <div className="flex justify-between mb-2">
                            <h1 className="font-bold text-gray-400">Akun</h1>
                            <p className="font-semibold">{pembayaran.sender_name ? pembayaran.sender_name : '-'}</p>
                        </div>

                        <div className="flex justify-between mb-2">
                            <h1 className="font-bold text-gray-400">Metode Pembayaran</h1>
                            <p className="font-semibold">{pembayaran ? 'Mayang' : '-'}</p>
                        </div>
                        <div className="flex justify-between">
                            <h1 className="font-bold text-gray-400">Total Pembayaran</h1>
                            <p className="font-semibold">{pembayaran.amount ? pembayaran.amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : 'Rp 0,00'}</p>

                        </div>

                        <hr className="w-full h-1 mx-auto my-2 bg-gray-300 rounded" />
                        <div className="flex justify-between">
                            <h1 className="font-bold text-gray-400">Total Pembayaran</h1>
                            <p className="font-semibold text-primary">{pembayaran.amount ? pembayaran.amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : 'Rp 0,00'}</p>
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