import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';  // Import Link
import Image from 'next/image';  // Import Image (if needed)
import { IconCirclePlus } from "@tabler/icons-react";  // Import your IconCirclePlus component
import SlideCard from "../SlideCard"; // Import your SlideCard component
import styles from "@/styles/Home.module.css";
import CardFood from "../CardFood";

const Merchant = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);

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

                setData(response.data.body);
                setFilteredData(response.data.body);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);

                // You may want to handle specific errors differently (e.g., show an error message)
                if (error.response && error.response.status === 401) {
                    // Unauthorized error (e.g., token expired)
                    sessionStorage.clear();
                    router.push('/login');
                }
            }
        };

        fetchData();

        const role = sessionStorage.getItem('role');
        const token = sessionStorage.getItem('token');
        const status = sessionStorage.getItem('status');
        const idMerchant = sessionStorage.getItem('id');

        if (!role || !token || role !== 'merchant' || status !== 'approved' || !idMerchant) {
            sessionStorage.clear();
            router.push('/login');
        } else {
            setLoading(false);
        }
    }, [router]);

    const handleFilterChange = (status) => {
        setSelectedStatus(status);
        const filtered = data.filter((data) => data.status.toLowerCase() === status.toLowerCase());
        setFilteredData(filtered);
    };

    return (
        <>

            <div className="container mx-auto mt-24 bg-white h-screen">
                <div className="place-content-center">
                    <div className={`bg-green-50 rounded-lg ${styles.listMenu}`}>
                        <div className="flex flex-nowrap p-4">
                            {/* <Link href="/creatcampaign?step=1" className="grid justify-items-center mr-2">
                                <div className={`${styles.iconMenu}`}><Image src={'/icon/campaint.jpg'} alt="Girl in a jacket" width={30} height={30} /></div>
                                <p className="text-base font-normal text-gray-500 dark:text-gray-400">Campaign</p>
                            </Link> */}
                            <Link href="/createmenu?step=1" className="grid justify-items-center">
                                <div className={`${styles.iconMenu}`}><IconCirclePlus /></div>
                                <p className="text-base font-normal text-gray-500 dark:text-gray-400">Menu</p>
                            </Link>
                        </div>
                    </div >
                </div>

                <div className={` flex ${styles.slide_card}`}>
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
                </div>
                <div className="place-content-center">
                    <div className="flex my-5">
                        <div
                            className={`mr-2 grid justify-items-center ${selectedStatus === 'approved' ? 'text-blue-500 ' : ''}`}
                            onClick={() => handleFilterChange('approved')}
                        >
                            <span>Approved</span>
                            <div className={`w-24 h-0.5 ${selectedStatus === 'approved' ? 'bg-blue-500 ' : 'bg-black'}`}></div>
                        </div>
                        <div
                            className={`mr-2 grid justify-items-center ${selectedStatus === 'waiting' ? 'text-blue-500' : ''}`}
                            onClick={() => handleFilterChange('waiting')}
                        >
                            <span>Waiting</span>
                            <div className={`w-24 h-0.5 ${selectedStatus === 'waiting' ? 'bg-blue-500 ' : 'bg-black'}`}></div>
                        </div>
                        <div
                            className={`grid justify-items-center ${selectedStatus === 'rejected' ? 'text-blue-500 ' : ''}`}
                            onClick={() => handleFilterChange('rejected')}
                        >
                            <span>Rejected</span>
                            <div className={`w-24 h-0.5 ${selectedStatus === 'rejected' ? 'bg-blue-500 ' : 'bg-black'}`}></div>
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
                                img={data.images.length > 0 ? `/img/${data.images[0].image_url}` : '/img/default-image.png'}
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

            </div>

        </>

    );
}

export default Merchant;