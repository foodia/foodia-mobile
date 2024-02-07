import styles from "@/styles/Campaign.module.css"
import { IconClock, IconCalendarEvent, IconCreditCard, IconClipboardCheck, IconSoup, IconArrowNarrowRight, IconBellRingingFilled, IconCaretDown, IconCaretUp } from '@tabler/icons-react';
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from 'react';
const DetailCamp = ({ data }) => {
    const [showFullText, setShowFullText] = useState(false);
    const router = useRouter();
    const idCamp = router.query.id;
    const toggleReadMore = () => {
        setShowFullText((prevShowFullText) => !prevShowFullText);
    };


    const formatUang = (nominal) => {
        const formatter = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        });

        return formatter.format(nominal);
    };

    const calculateRemainingTime = (eventDate) => {
        const currentDate = new Date();
        const eventDateObject = new Date(eventDate);
        const timeDifference = eventDateObject - currentDate;

        // Calculate remaining time in days
        const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        return remainingDays;
    };

    if (!data) {
        // Handle the case where data is not available yet
        return <p>Loading...</p>;
    };

    const remainingDays = calculateRemainingTime(data.event_date);
    return (
        <>
            <div className="container mx-auto mt-24 bg-white h-screen">
                <div className="place-content-center">
                    <img src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${data.image_url}`} alt="" className="rounded-lg" style={{ width: '390px', height: '195px', objectFit: 'cover' }} />
                </div>

                <div className="place-content-center mt-4  p-2">
                    <div className="flex">
                        <h1>{data.event_name}</h1>
                    </div>
                    <div className="flex">
                        <p>{data.address}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between ">
                        <h4> {formatUang(data.donation_target)}</h4>
                        <h4 className="flex items-center text-blue-400"><IconClock />{remainingDays} Hari</h4>


                    </div>

                    <div className="flex justify-between ">
                        <ol className="flex items-center mt-2">
                            <li className="flex w-24 items-center after:w-full after:border-b after:border-4 after:border-primary">
                                <span className="flex items-center justify-center w-6 h-6  rounded-full  bg-primary shrink-0">
                                    <IconCalendarEvent className="w-3.5 h-3.5 text-gray-100" />

                                </span>
                            </li>
                            <li className="flex w-24 items-center after:w-full after:w-full after:h-1 after:border-b  after:border-4  after:border-gray-700">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary shrink-0">
                                    <IconCreditCard className="w-3.5 h-3.5 text-gray-100" />
                                </span>
                            </li>
                            <li className="flex items-center w-full">
                                <span className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full bg-gray-700 shrink-0">
                                    <IconClipboardCheck className="w-3.5 h-3.5 text-gray-100" />

                                </span>
                            </li>
                        </ol>
                        <div className={`flex justify-center items-center rounded-full w-24 mt-2 ${data.status === 'waiting' ? 'bg-blue-600' : data.status === 'approved' ? 'bg-green-500' : data.status === 'rejected' ? 'bg-red-500' : ''}`}>
                            <p className="text-white">{data.status}</p>
                        </div>
                    </div>



                </div>
                <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />

                <div className="items-center justify-center mt-1 w-full">
                    <Link href={`/detonator/food/${idCamp}`} className="w-full h-16 bg-white hover:bg-gray-100  text-black rounded-lg inline-flex items-center px-2.5 py-2.5">
                        <div className="flex justify-between w-full">
                            <div className="flex">
                                {/* <IconSoup className=" w-7 h-7" /> */}
                                <div className="w-12 h-12 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
                                    <img src="/img/icon/icon_food_order.png" alt="" className="w-8 h-8" />
                                </div>
                                <div className="text-left place-items-start">
                                    <div className="mb-1 text-primary">Food Campaigner</div>
                                    <div className="-mt-1 font-sans text-xs text-gray-500">{data.orders ? data.orders.length : 0} merchants </div>
                                </div>
                            </div>
                            <div className="grid place-items-center">
                                <IconArrowNarrowRight className=" grid grid-cols-3 gap-4 place-items-end text-gray-500" />
                            </div>
                        </div>
                    </Link>
                    <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
                    <Link href={`/detonator/report/${idCamp}`} className="w-full h-16 bg-white hover:bg-gray-100  text-black rounded-lg inline-flex items-center px-2.5 py-2.5 mt-2">
                        <div className="flex justify-between w-full">
                            <div className="flex">
                                <div className="text-left place-items-start">
                                    <div className="mb-1 text-primary flex">Kabar Terbaru <IconBellRingingFilled size={10} className="text-blue-600" /></div>
                                    <div className="-mt-1 font-sans text-xs text-gray-500">Terahir Update 18 Oktober 2023</div>
                                </div>
                            </div>
                            <div className="grid place-items-center">
                                <IconArrowNarrowRight className=" grid grid-cols-3 gap-4 place-items-end text-gray-500" />
                            </div>
                        </div>
                    </Link>
                </div>



                <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
                <div className="block mt-1 p-6 bg-white rounded-lg shadow bg-blue-100">
                    <h5 className="mb-2 text-sm font-bold tracking-tight text-gray-900">Tentang Program</h5>
                    <p className={`font-normal text-gray-700 text-xs  ${showFullText ? '' : styles.truncate}`}>
                        {data.description}
                    </p>
                    <div className="bg-white hover:bg-gray-100 w-full grid place-content-center rounded-sm text-primary text-xs mt-2">
                        <button className="flex" onClick={toggleReadMore}>
                            Selengkapnya {showFullText ? <IconCaretUp size={20} /> : <IconCaretDown size={20} />}
                        </button>
                    </div>
                </div>

                {/* <CardCampaign /> */}

            </div>

        </>

    );
}

export default DetailCamp;