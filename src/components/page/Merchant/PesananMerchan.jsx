import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { IconCirclePlus } from "@tabler/icons-react";
import styles from "@/styles/Home.module.css";
import CardFood from "@/components/CardFood";
import SlideCard from "@/components/SlideCard";
import CardPesanan from "@/components/CardPesanan";


const PesananMerchan = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [dataApi, setDataApi] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('review');
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
    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    return (
        <>

            <div className="container mx-auto mt-24 bg-white h-screen">
                <div className="place-content-center">
                    <div className={`bg-green-50 rounded-lg ${styles.listMenu}`}>
                        <div className="flex flex-nowrap p-4">
                            <Link href="/merchant" className="grid justify-items-center mr-2">
                                <div className={`${styles.iconMenu}`}><IconCirclePlus /></div>
                                <p className="text-base font-normal text-gray-500 dark:text-gray-400">List Menu</p>
                            </Link>
                            <Link href="/merchant/pesanan" className="grid justify-items-center ">
                                <div className={`${styles.iconMenu}`}><Image src={'/icon/pesanan.png'} alt="Girl in a jacket" width={30} height={30} /></div>
                                <p className="text-base font-normal text-gray-500 dark:text-gray-400">Pesanan</p>
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
                <div className="place-content-center">
                    <div className="flex my-5 p-2">
                        <div
                            className={`mr-2 grid justify-items-center ${selectedStatus === 'approved' ? 'text-blue-500 ' : ''}`}
                            onClick={() => handleFilterChange('review')}
                        >
                            <span>Pesanan</span>
                            <div className={`w-24 h-0.5 ${selectedStatus === 'review' ? 'bg-blue-500 ' : 'bg-black'}`}></div>
                        </div>
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
                            <span>History</span>
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
                    <div className={`${styles.card}`}>
                        {filteredData.map((data) => (
                            <CardPesanan
                                key={data.id}
                                to={`/merchant/detailpesanan/${data.id}`}
                                idOrder={data.id}
                                img={data.merchant_product.images.length > 0 ? `${process.env.NEXT_PUBLIC_URL_STORAGE}${data.merchant_product.images[0].image_url}` : '/img/default-image.png'}
                                title={data.campaign.event_name}
                                productName={data.merchant_product.name}
                                date={formatDate(data.merchant_product.created_at)}
                                qty={data.qty}
                                price={data.merchant_product.price}
                                status={data.order_status}
                                setLoading={setLoading}

                            />
                        ))}
                    </div>
                )}



            </div >
            <div id="infinite-scroll-trigger" className={`${styles.loadingCard}`}></div>

        </>

    );
}

export default PesananMerchan;