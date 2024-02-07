import styles from "@/styles/Home.module.css";
import Image from "next/image";
import { IconCirclePlus } from '@tabler/icons-react';
import CardCampaign from "../CardCampaign";
import SlideCard from "../SlideCard";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";

const dummyData = [
    { id: 1, to: '/event/1', img: '/img/card/rectangle_70.png', title: 'Event A', address: 'Address A', date: '2023-01-01', status: 'Pending' },
    { id: 2, to: '/event/1', img: '/img/card/rectangle_70.png', title: 'Event A', address: 'Address A', date: '2023-01-01', status: 'Pending' },
    { id: 3, to: '/event/2', img: '/img/card/rectangle_70.png', title: 'Event B', address: 'Address B', date: '2023-02-02', status: 'Approved' },
    { id: 4, to: '/event/2', img: '/img/card/rectangle_70.png', title: 'Event B', address: 'Address B', date: '2023-02-02', status: 'Approved' },
    { id: 5, to: '/event/3', img: '/img/card/rectangle_70.png', title: 'TEBAR 1000 PAKET NASI JUMAT BERKAH', address: 'Kav Barokah, Gg. Ceria I, Bahagia, Kec. Babelan, Kabupaten Bekasi, Jawa Barat 17121', date: '2023-03-03', status: 'Rejected' },
    { id: 6, to: '/event/3', img: '/img/card/rectangle_70.png', title: 'TEBAR 1000 PAKET NASI JUMAT BERKAH', address: 'Kav Barokah, Gg. Ceria I, Bahagia, Kec. Babelan, Kabupaten Bekasi, Jawa Barat 17121', date: '2023-03-03', status: 'Rejected' },
    { id: 7, to: '/event/4', img: '/img/card/rectangle_70.png', title: 'Event D', address: 'Address D', date: '2023-04-04', status: 'Pending' },
    { id: 8, to: '/event/5', img: '/img/card/rectangle_70.png', title: 'Event E', address: 'Address E', date: '2023-05-05', status: 'Approved' },
];

const Detonator = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [filteredData, setFilteredData] = useState(dummyData);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const handleFilterChange = (status) => {
        setSelectedStatus(status);
        const filtered = dummyData.filter((data) => data.status === status);
        setFilteredData(filtered);
    };

    useEffect(() => {
        const role = sessionStorage.getItem('role');
        const token = sessionStorage.getItem('token');
        const status = sessionStorage.getItem('status');
        const idDetonator = sessionStorage.getItem('id');

        if (!role || !token || role !== 'detonator' || status !== 'approved' || !idDetonator) {
            // Redirect to login if either role or token is missing or role is not 'detonator' or status is not 'approved'
            sessionStorage.clear();
            router.push('/login');
        } else {
            // Role is 'detonator' and token is present
            setLoading(false); // Set loading to false once the check is complete
        }
    }, [router]);




    return (
        <>
            {loading && <div>Loading...</div>}
            <div className="container mx-auto mt-24 bg-white h-screen">
                <div className="place-content-center">
                    <div className={`bg-green-50 rounded-lg ${styles.listMenu}`}>
                        <div className="flex flex-nowrap p-4">
                            {/* <Link href="/creatcampaign?step=1" className="grid justify-items-center mr-2">
                                <div className={`${styles.iconMenu}`}><Image src={'/icon/campaint.jpg'} alt="Girl in a jacket" width={30} height={30} /></div>
                                <p className="text-base font-normal text-gray-500 dark:text-gray-400">Campaign</p>
                            </Link> */}
                            <Link href="/creatcampaign?step=1" className="grid justify-items-center">
                                <div className={`${styles.iconMenu}`}><IconCirclePlus /></div>
                                <p className="text-base font-normal text-gray-500 dark:text-gray-400">Campaign</p>
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
                            className={`mr-2 grid justify-items-center ${selectedStatus === 'Approved' ? 'text-blue-500 ' : ''}`}
                            onClick={() => handleFilterChange('Approved')}
                        >
                            <span>Approved</span>
                            <div className={` w-24 h-0.5 ${selectedStatus === 'Approved' ? 'bg-blue-500 ' : 'bg-black'}`}></div>
                        </div>
                        <div
                            className={`mr-2 grid justify-items-center ${selectedStatus === 'Pending' ? 'text-blue-500' : ''}`}
                            onClick={() => handleFilterChange('Pending')}
                        >
                            <span>Pending</span>
                            <div className={` w-24 h-0.5 ${selectedStatus === 'Pending' ? 'bg-blue-500 ' : 'bg-black'}`}></div>
                        </div>
                        <div
                            className={`grid justify-items-center ${selectedStatus === 'Rejected' ? 'text-blue-500 ' : ''}`}
                            onClick={() => handleFilterChange('Rejected')}
                        >
                            <span>Rejected</span>
                            <div className={` w-24 h-0.5 ${selectedStatus === 'Rejected' ? 'bg-blue-500 ' : 'bg-black'}`}></div>
                        </div>
                    </div>
                </div>

                <div className={` ${styles.card}`}>
                    {filteredData.map((data) => (
                        <CardCampaign
                            key={data.id}  // Use a unique identifier (id) as the key
                            to={data.to}
                            img={data.img}
                            title={data.title}
                            address={data.address}
                            date={data.date}
                            status={data.status}
                        />
                    ))}
                </div>
            </div>

        </>

    );
}

export default Detonator;