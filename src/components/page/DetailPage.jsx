import styles from "@/styles/Campaign.module.css"
import { IconClock, IconCalendarEvent, IconCreditCard, IconClipboardCheck, IconSoup, IconArrowNarrowRight, IconBellRingingFilled, IconCaretDown, IconCaretUp, IconMapPin } from '@tabler/icons-react';
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';
import Swal from "sweetalert2";
import { useAppState } from "./UserContext";
const DetailCamp = ({ data }) => {
    const router = useRouter();
    const idCamp = router.query.id;
    const [showFullText, setShowFullText] = useState(false);
    const { state, setDonation } = useAppState();
    const [nominalDonasi, setNominalDonasi] = useState(0);
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

    const showSweetAlert = async () => {
        const { value } = await Swal.fire({
            title: 'Pilih Nominal Donasi',
            html: `
            <div class="flex flex-col space-y-2">
                <label>
                    <input  type="radio" name="donation" id="donation" class="hidden peer" value="50000"  />
                    <div class="peer-checked:bg-primary bg-green-200 py-2 px-4 rounded-lg font-semibold">Rp 50.000</div>
                </label>
                <label>
                    <input  type="radio" name="donation" id="donation" class="hidden peer" value="100000"  />
                    <div class="peer-checked:bg-primary bg-green-200 py-2 px-4 rounded-lg font-semibold">Rp. 100.000</div>
                </label>
                <label>
                    <input  type="radio" name="donation" id="donation" class="hidden peer" value="250000"  />
                    <div class="peer-checked:bg-primary bg-green-200 py-2 px-4 rounded-lg font-semibold">Rp. 250.000</div>
                </label>
                <label>
                    <input  type="radio" name="donation" id="donation" class="hidden peer" value="500000"  />
                    <div class="peer-checked:bg-primary bg-green-200 py-2 px-4 rounded-lg font-semibold">Rp. 500.000</div>
                </label>
                    
                
                <div class="bg-gray-200 p-2 rounded-lg">
              <label class=" items-center text-base ">
              Nominal Donasi Lainnya
              </label>
                <input type="number" name="nominal" class="items-center mt-2 bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 0 dark:placeholder-gray-400  "> 
                
              </div>
            </div>`,
            focusConfirm: false,
            showCancelButton: true,
            cancelButtonText: 'Batal',
            confirmButtonText: 'Pilih',
            preConfirm: () => {
                const radioValue = document.querySelector('input[name="donation"]:checked');
                if (!radioValue) {
                    const nominalValue = document.querySelector('input[name="nominal"]');
                    if (nominalValue && nominalValue.value) {
                        // return nominalValue.value;
                        handleSubmit(nominalValue.value);
                    } else {
                        return 'input nominal value';
                    }
                } else {
                    // return radioValue.value;
                    handleSubmit(radioValue.value);
                }
            },
            customClass: {
                container: 'your-custom-container-class',
                popup: 'your-custom-popup-class',
                title: 'your-custom-title-class',
                content: 'your-custom-content-class',
                confirmButton: 'your-custom-confirm-button-class',
                cancelButton: 'your-custom-cancel-button-class',
            },
        });

        // if (value) {
        //     setNominalDonasi(parseInt(value));
        // }
    };

    const handleSubmit = (value) => {
        setNominalDonasi(parseInt(value));
        const data = {
            'amount': parseInt(value),
            'payment_channel': '',
            'success_url': `${process.env.NEXT_PUBLIC_URL_PAYMEN}`,
            'detail': {
                'campaign_id': idCamp,
                'description': 'Donation',
                'donation_type': 'campaign',
            }
        }
        setDonation(data);
        router.push('/metode_pembayaran');
    };

    useEffect(() => {
        console.log('data', data);
        console.log('donatur data', data?.campaign_donation);
    }, [data]);

    const cart = data?.campaign_donation || [];
    const [showAll, setShowAll] = useState(false);

    // Mengurutkan item dalam keranjang belanja
    const sortedCart = [...cart].sort();

    const calculateTimeAgo = (createdAt) => {
        const now = new Date();
        const createdAtDate = new Date(createdAt);
        const difference = now - createdAtDate;

        const seconds = Math.floor(difference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} hari yang lalu`;
        } else if (hours > 0) {
            return `${hours} jam yang lalu`;
        } else if (minutes > 0) {
            return `${minutes} menit yang lalu`;
        } else {
            return `${seconds} detik yang lalu`;
        }
    };

    const formatToRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
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
                        <h1 className="font-bold">{data.event_name}</h1>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-normal">{data.address}</p>
                        <Link href={`/lokasi_camp/${idCamp}`} className="text-sm font-normal text-red-500"><IconMapPin /></Link>

                    </div>
                    <div className="flex flex-wrap items-center justify-between ">
                        <h4 className="font-semibold text-base"> {formatUang(data.donation_target)}</h4>
                        <h4 className="flex items-center text-blue-500 text-base">
                            <IconClock size={16} />
                            {remainingDays} Hari
                        </h4>


                    </div>

                    <button onClick={showSweetAlert} className="w-full h-14 mt-4 text-white rounded-lg inline-flex items-center justify-center px-2.5 py-2.5 bg-primary">
                        Donasi
                    </button>



                </div>
                <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />

                <div className="items-center justify-center mt-1 w-full">
                    <Link href={`/food/${idCamp}`} className="w-full h-16 bg-white hover:bg-gray-100  text-black rounded-lg inline-flex items-center px-2.5 py-2.5 ">
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
                    <Link href={`/report/${idCamp}`} className="w-full h-16 bg-white hover:bg-gray-100  text-black rounded-lg inline-flex items-center px-2.5 py-2.5 mt-2">
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

                <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
                <div className="w-full rounded-lg items-center px-4 py-2.5 mt-4">
                    <div className="flex ">
                        <p className="text-base font-bold text-black">Donasi Terkumpul</p>
                        <div className="bg-green-300 px-1 rounded-lg ml-2 flex items-center">
                            <p className="text-xs font-bold text-primary">
                                {cart.length}
                            </p>
                        </div>
                    </div>
                    {/* Looping untuk menampilkan item yang dimuat dalam keranjang belanja */}
                    {(showAll ? cart : sortedCart.slice(0, 4)).map((item, index) => (


                        <div key={index} className="w-full h-16 bg-white text-black rounded-lg inline-flex items-center m-2 shadow-md ">
                            <div className="flex justify-between w-full hover:bg-gray-100 p-2 rounded-lg">
                                <div className="flex">
                                    {/* <IconSoup className=" w-7 h-7" /> */}
                                    <div className="w-12 h-12 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
                                        <img src="/icon/user.png" alt="" className="w-8 h-8" />
                                    </div>
                                    <div className="text-left place-items-start">
                                        <div className="text-primary text-sm font-bold"> {item.transaction.sender_name}</div>
                                        <div className="font-sans text-xs text-gray-500">Berdonasi Sebesar: <span className="font-bold">{formatToRupiah(item.amount)}</span></div>
                                        <div className="mt-1 font-sans text-xs text-gray-500"> {calculateTimeAgo(item.created_at)}</div>
                                    </div>
                                </div>
                                {/* <div className="grid place-items-center">
                                        <IconArrowNarrowRight className=" grid grid-cols-3 gap-4 place-items-end text-gray-500" />
                                    </div> */}
                            </div>
                        </div>


                    ))}
                    <div className="block mt-1 p-2 ">

                        <div className="bg-white hover:bg-gray-100 w-full grid place-content-center rounded-sm text-primary text-xs mt-2  p-2 rounded-md">
                            {/* Tampilkan tombol "Show All" jika belum menampilkan semua item */}
                            {!showAll && (
                                <button onClick={() => setShowAll(true)}><IconCaretDown size={20} /></button>
                            )}
                            {/* Tampilkan tombol "Sort" jika sudah menampilkan semua item */}
                            {showAll && (
                                <button onClick={() => setShowAll(false)}><IconCaretUp size={20} /></button>
                            )}
                        </div>
                    </div>
                    {/* <div className="bg-white hover:bg-gray-100 w-full grid place-content-center rounded-sm text-primary text-xs mt-2">
                        <button className="flex" onClick={toggleReadMore}>
                            Selengkapnya {showFullText ? <IconCaretUp size={20} /> : <IconCaretDown size={20} />}
                        </button>
                    </div> */}
                </div>

            </div>

        </>

    );
}

export default DetailCamp;