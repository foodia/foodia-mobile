import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { IconCirclePlus } from "@tabler/icons-react";
import SlideCard from "../SlideCard";
import styles from "@/styles/Home.module.css";
import CardFood from "../CardFood";
import Swal from "sweetalert2";

const Merchant = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [dataApi, setDataApi] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    useEffect(() => {
        const authenticateUser = async () => {
            // const role = sessionStorage.getItem('role');
            const token = sessionStorage.getItem('token');
            // const status = sessionStorage.getItem('status');
            // const id = sessionStorage.getItem('id');
            // console.log('token', token);

            if (!token) {
                // sessionStorage.clear();
                Swal.fire({
                    icon: 'error',
                    title: 'Akses Dibatasi',
                    text: ` Mohon untuk login kembali menggunakan akun Merchant.`,
                    showConfirmButton: false,
                    timer: 2000,
                });
                setTimeout(() => {
                    router.push('/home');
                }, 2000);

            } else {
                const response = await axios.get(`https://api.foodia-dev.nuncorp.id/api/v1/auth/check-register-status`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const cekData = response.data.body;
                if (cekData.merchant.merchant_id == 0) {
                    router.push('/registrasi/merchant?step=1');
                } else {
                    if (cekData.merchant.status == 'waiting') {
                        sessionStorage.setItem('id', cekData.merchant.merchant_id);
                        sessionStorage.setItem('role', 'merchant');
                        sessionStorage.setItem('status', cekData.merchant.status);
                        sessionStorage.setItem('note', cekData.merchant.note);

                        Swal.fire({
                            icon: 'warning',
                            title: 'Merchant Belum Terverifikasi',
                            text: ` Mohon tunggu konfirmasi dari admin kami.`,
                            showConfirmButton: false,
                            timer: 2000,
                        });
                        setTimeout(() => {
                            router.push('/home');
                        }, 2000);
                    } else if (cekData.merchant.status == 'rejected') {
                        setLoading(false);
                        sessionStorage.setItem('id', cekData.merchant.merchant_id);
                        sessionStorage.setItem('role', 'merchant');
                        sessionStorage.setItem('status', cekData.merchant.status);
                        sessionStorage.setItem('note', cekData.merchant.note);
                        Swal.fire({
                            icon: 'warning',
                            title: 'Merchant Ditolak',
                            text: `${cekData.merchant.note}`,
                            showConfirmButton: false,
                            timer: 2000,
                        });
                        setTimeout(() => {
                            router.push('/home');
                        }, 2000);
                    } else {
                        sessionStorage.setItem('id', cekData.merchant.merchant_id);
                        sessionStorage.setItem('role', 'merchant');
                        sessionStorage.setItem('status', cekData.merchant.status);
                        sessionStorage.setItem('note', cekData.merchant.note);
                    }
                }
                console.log('data', cekData);
            }
        };

        authenticateUser();
    }, [router]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = sessionStorage.getItem('id');
                const token = sessionStorage.getItem('token');

                if (!id || !token) {
                    throw new Error('Missing required session data');
                }

                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}merchant-product/filter?merchant_id=${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setDataApi(response.data.body);
                setFilteredData(response.data.body);
                console.log('respone data menu', response.data.body);
                setLoading(false);

                if (response.data.body.length === 0) {
                    setHasMore(false);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);

                if (error.response && error.response.status === 401) {
                    // Unauthorized error (e.g., token expired)
                    sessionStorage.clear();
                    router.push('/login');
                }
            }
        };

        fetchData();
    }, [page]);

    const handleFilterChange = (status) => {
        let filtered = [];

        if (status === 'listMenu') {
            // Show items with 'waiting' or 'rejected' status
            filtered = dataApi.filter((data) => data.status === 'waiting' || data.status === 'rejected');
        } else {
            // Show items with the selected status
            filtered = dataApi.filter((data) => data.status === status);
        }

        setSelectedStatus(status);
        setFilteredData(filtered);
    };

    return (
        <>
            <div className="container mx-auto mt-24 bg-white h-screen">

                <div className="flex items-center justify-center px-6 my-2">
                    <div className={`bg-green-50 rounded-lg ${styles.listMenu}`}>
                        <div className="flex justify-between p-2.5">
                            <Link href="/merchant" className="grid justify-items-center w-24">
                                <div className={`${styles.iconMenu}`}><IconCirclePlus /></div>
                                <p className="text-base font-normal text-gray-500 dark:text-gray-400">List Menu</p>
                            </Link>
                            <Link href="/merchant/pesanan" className="grid justify-items-center w-24 ">
                                <div className={`${styles.iconMenu}`}><Image src={'/icon/pesanan.png'} alt="Girl in a jacket" width={30} height={30} /></div>
                                <p className="text-base font-normal text-gray-500 dark:text-gray-400">Pesanan</p>
                            </Link>
                            <Link href="/merchant/saldo" className="grid justify-items-center w-24 ">
                                <div className={`${styles.iconMenu}`}><Image src={'/icon/saldo.png'} alt="Girl in a jacket" width={30} height={30} /></div>
                                <p className="text-base font-normal text-gray-500 dark:text-gray-400">Saldo</p>
                            </Link>
                        </div>
                    </div >
                </div>

                {/* <div className={` flex ${styles.slide_card}`}>
                    <SlideCard to={"/campaign/1"}
                        img="/img/card/rectangle_70.png"
                        title="Makanan Untuk Semua"
                        address="Bersama-sama Kita Bisa Mengakhiri Kelaparan."
                        date="30/10/2022"
                        status="Pending"
                    />
                    <SlideCard to={"/campaign/1"}
                        img="/img/card/rectangle_70.png"
                        title="TEBAR 1000 PAKET NASI JUMAT BERKAH"
                        address="Kav Barokah, Gg. Ceria I, Bahagia, Kec. Babelan, Kabupaten Bekasi, Jawa Barat 17121"
                        date="30/10/2022"
                        status="Approved"
                    />
                    <SlideCard to={"/campaign/1"}
                        img="/img/card/rectangle_70.png"
                        title="TEBAR 1000 PAKET NASI JUMAT BERKAH"
                        address="Kav Barokah, Gg. Ceria I, Bahagia, Kec. Babelan, Kabupaten Bekasi, Jawa Barat 17121 ppppppppppppppppppppppppppppppppppppppp"
                        date="30/10/2022"
                        status="Rejected"
                    />

                    <SlideCard to={"/campaign/1"}
                        img="/img/card/rectangle_70.png"
                        title="TEBAR 1000 PAKET NASI JUMAT BERKAH"
                        address="Kav Barokah, Gg. Ceria I, Bahagia, Kec. Babelan, Kabupaten Bekasi, Jawa Barat 17121"
                        date="30/10/2022"
                        status="Approved"
                    />
                </div> */}
                <div className="grid flex justify-end py-2 px-5">
                    <Link href="/createmenu?step=1" className="bg-primary text-white rounded-lg w-28 flex h-10 items-center p-1"><IconCirclePlus />Add Menu</Link>
                </div>
                <div className="place-content-center px-6 my-2 mt-4">
                    <div className="flex my-2 p-2">
                        <div
                            className={`mr-2 grid justify-items-center ${selectedStatus === 'approved' ? 'text-blue-500 ' : ''}`}
                            onClick={() => handleFilterChange('approved')}
                        >
                            <span>Menu Approved</span>
                            <div className={`w-32 h-0.5 ${selectedStatus === 'approved' ? 'bg-blue-500 bg-blue-500 w-32 ' : 'bg-black'}`}></div>
                        </div>
                        <div
                            className={`mr-2 grid justify-items-center ${selectedStatus === 'listMenu' ? 'text-blue-500' : ''}`}
                            onClick={() => handleFilterChange('listMenu')}
                        >
                            <span>List Menu</span>
                            <div className={`w-32 h-0.5 ${selectedStatus === 'listMenu' ? 'bg-blue-500 bg-blue-500 w-32 ' : 'bg-black'}`}></div>
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
                    <div className={`${styles.card}`}>
                        {filteredData.map((data) => (
                            <CardFood
                                key={data.id}
                                to={`/product/${data.id}`}
                                img={data.images.length > 0 ? `${process.env.NEXT_PUBLIC_URL_STORAGE}${data.images[0].image_url}` : '/img/default-image.png'}
                                title={data.name}
                                description={data.description}
                                date={data.created_at}
                                status={data.status}
                                qty={data.qty}
                                price={data.price}
                                images={data.images}
                            />
                        ))}
                    </div>
                )}



            </div >
            <div id="infinite-scroll-trigger" className={`${styles.loadingCard}`}></div>

        </>

    );
}

export default Merchant;