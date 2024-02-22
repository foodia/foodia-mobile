import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import axios from "axios";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

const saldo = (saldo) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [dataApi, setDataApi] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('diproses');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    useEffect(() => {
        const role = sessionStorage.getItem('role');
        const token = sessionStorage.getItem('token');
        const status = sessionStorage.getItem('status');
        const id = sessionStorage.getItem('id');

        if (!role || !token || role !== 'merchant' || status !== 'approved' || !id) {
            // Redirect to login if either role or token is missing or role is not 'detonator' or status is not 'approved'
            sessionStorage.clear();
            router.push('/login/merchant');
        } else {
            // Role is 'detonator' and token is present
            setLoading(false); // Set loading to false once the check is complete
        }
    }, [router]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = sessionStorage.getItem('id');
                const token = sessionStorage.getItem('token');

                if (!id || !token) {
                    throw new Error('Missing required session data');
                }

                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}order/filter?merchant_id=${id}&order_status=${selectedStatus}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const approvedPesanan = response.data.body.filter(pesanan => pesanan.campaign.status === 'approved');
                setDataApi(approvedPesanan);
                setFilteredData(approvedPesanan);
                setLoading(false);
                console.log('data page merchan', approvedPesanan);

                if (approvedPesanan.length === 0) {
                    setHasMore(false);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);

                if (error.response && error.response.status === 401) {
                    // Unauthorized error (e.g., token expired)
                    sessionStorage.clear();
                    router.push('/login/merchant');
                }
            }
        };

        fetchData();
    }, [loading, selectedStatus]);
    const handleFilterChange = (status = 'review') => {
        let filtered = [];

        if (status === 'review') {
            filtered = dataApi.filter((data) => data.order_status === 'review');
        } else if (status === 'diproses') {
            filtered = dataApi.filter((data) => data.order_status === 'diproses');
        } else if (status === 'selesai') {
            filtered = dataApi.filter((data) => data.order_status === 'canceled' || data.order_status === 'selesai');
        }

        setSelectedStatus(status);
    };

    const handleRequestError = () => {
        Swal.fire({
            title: 'Informasi Penarikan Saldo',
            text: 'Penarikan Saldo akan dikirimkan ke nomor LinkAja anda. Pastikan nomor tujuan sudah sesuai',
            confirmButtonText: 'Mengerti',
        }).then((result) => {
            if (result.isConfirmed) {
                // Arahkan ke /pembayaran saat pengguna menekan tombol "Mengerti"
                router.push('/merchant/penarikan');
            }
        })
    }
    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div>
            <main className="">
                <Header title="Saldo" />
                <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
                    <div className="container mx-auto mt-24 bg-white h-screen">
                        <div className="  mx-4 p-3 rounded-lg border-solid border-2 border-gray-300">
                            <div className="">
                                <p>Saldo Penghasilan</p>
                                <p>Rp 300.000</p>
                            </div>
                        </div>

                        <div className="mx-4 mt-2">
                            <button onClick={handleRequestError} className="bg-primary text-white p-2 w-full rounded-lg">Tarik Saldo</button>
                        </div>

                        <div className="flex justify-center w-full">
                            <div className="flex my-5 p-2">

                                <div
                                    className={`mr-2 grid justify-items-center ${selectedStatus === 'diproses' ? 'text-blue-500' : ''}`}
                                    onClick={() => handleFilterChange('diproses')}
                                >
                                    <span>Berlangsung</span>
                                    <div className={`w-24 h-0.5 ${selectedStatus === 'diproses' ? 'bg-blue-500 ' : 'bg-black'}`}></div>
                                </div>
                                <div
                                    className={`mr-2 grid justify-items-center ${selectedStatus === 'selesai' ? 'text-blue-500' : ''}`}
                                    onClick={() => handleFilterChange('selesai')}
                                >
                                    <span>Selesai</span>
                                    <div className={`w-24 h-0.5 ${selectedStatus === 'selesai' ? 'bg-blue-500 ' : 'bg-black'}`}></div>
                                </div>

                            </div>
                        </div>

                        {loading ? (
                            <div className={`${styles.card}`}>
                                {[...Array(4)].map((_, index) => (
                                    <div key={index} className={`${styles.loadingCard}`}>
                                        <div className={`${styles.shimmer}`}></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={`${styles.card} `} >
                                {filteredData.map((data) => (
                                    <div className="mx-4 mt-2 bg-white shadow-md p-4 rounded-lg" key={data.id}>
                                        <p className="font-bold">{data.campaign.event_name}</p>
                                        <p className="text-gray-600">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.merchant_product.price * data.qty)}</p>
                                        <p className="text-sm">{`${data.qty} x ${data.merchant_product.name}`}</p>
                                        <p className="text-gray-500 text-xs">21 Feb 2024 15:30:00 WIB</p>
                                    </div>
                                ))}


                            </div>
                        )}


                    </div >
                </div>
                <BottomNav />
            </main>
        </div>
    );
}

export default saldo;