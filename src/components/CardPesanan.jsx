import handler from "@/pages/api/hello";
import styles from "@/styles/Home.module.css";
import { IconCircleCheck, IconClockFilled, IconHelpCircle, IconPlaystationX, } from "@tabler/icons-react";
import Link from "next/link";
import axios from 'axios';
import Swal from "sweetalert2";
import { useState } from "react";

const CardPesanan = (props) => {
    const { to, img, title, productName, date, status, price, qty, idOrder, setLoading } = props;


    const totalHarga = price * qty
    const formatPrice = (price) => {
        const formatter = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        });

        return formatter.format(price);
    };
    const getStatusIcon = () => {
        switch (status) {
            case 'review':
                return <IconHelpCircle size={22} />;
            case 'diproses':
                return <IconCircleCheck size={22} />;
            case 'canceled':
                return <IconPlaystationX size={22} />;
            default:
                return null;
        }
    };
    const handleRejectButtonClick = async (e) => {
        e.preventDefault();

        // Show SweetAlert confirmation dialog
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to reject the order. This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, reject it!',
        });


        // If the user confirms, call the handleReject function
        if (result.isConfirmed) {
            setLoading(false)
            await handleReject();
        }
    };
    const handleReject = async () => {

        try {
            const id = sessionStorage.getItem('id');
            const token = sessionStorage.getItem('token');

            if (!id || !token) {
                throw new Error('Missing required session data');
            }

            const response = await axios.put(
                `https://api.foodia-dev.nuncorp.id/api/v1/order/update/${idOrder}`,
                {
                    order_status: 'canceled', // Add the data object here
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setLoading(true)

            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAprovButtonClick = async (e) => {
        e.preventDefault();

        // Show SweetAlert confirmation dialog
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to approve the order. This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3FB648',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, approve it!',
        });


        // If the user confirms, call the handleReject function
        if (result.isConfirmed) {
            setLoading(false)
            await handleAprov();
        }
    };
    const handleAprov = async () => {

        try {
            const id = sessionStorage.getItem('id');
            const token = sessionStorage.getItem('token');

            if (!id || !token) {
                throw new Error('Missing required session data');
            }

            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}order/update/${idOrder}`,
                {
                    order_status: 'diproses', // Add the data object here
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setLoading(true)
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex justify-center mt-1 w-full mb-2">

            <Link href={to} className={`bg-white hover:bg-gray-100 text-black rounded-lg inline-flex items-center ${styles.item_card}`}>
                <div className="flex justify-between w-80">
                    <div className="flex p-1">
                        <img
                            src={img}
                            className={`grid grid-cols-3 gap-4 place-items-end text-gray-500 rounded-lg object-cover ${styles.img_card}`}
                            alt=""
                        />
                        <div className={`text-left ml-1 ${styles.text_card}`}>
                            <div className="flex justify-between">
                                <p className="mb-1 text-black font-sans font-semibold text-sm truncate">{title}</p>
                                {/* <div className={`flex justify-center items-center rounded-full ${status === 'review' ? 'text-blue-600' : status === 'diproses' ? 'text-green-500' : status === 'canceled' ? 'text-red-500' : ''}`}>
                                    <p className="">{getStatusIcon()}</p>
                                </div> */}
                            </div>

                            <p className="mb-1 text-black font-sans font-semibold text-xs truncate">{`${qty} x ${productName} |`} <span className="text-primary">{formatPrice(price)}</span></p>
                            <div className="flex justify-between mt-4">
                                <p className="font-sans text-xs text-gray-500 mr-2">{date}</p>
                                <div className="flex">
                                    {status === 'review' &&
                                        <>
                                            <div className="font-sans text-xs text-white rounded-lg w-14 flex justify-center items-center bg-blue-500 ml-2" >Review</div>
                                        </>
                                    }

                                    {status === 'diproses' &&
                                        <div className="font-sans text-xs text-white rounded-lg w-14 flex justify-center items-center bg-yellow-500 ml-2" >DiProses</div>
                                    }

                                    {status === 'canceled' &&
                                        <div className="font-sans text-xs text-white rounded-lg w-14 flex justify-center items-center bg-red-500 h-5">Tolak</div>
                                    }
                                    {status === 'selesai' &&
                                        <div className="font-sans text-xs text-white rounded-lg w-14 flex justify-center items-center bg-primary h-5">Selesai</div>
                                    }

                                    {!['review', 'diproses', 'canceled', 'selesai'].includes(status) &&
                                        <span>Unknown status</span>
                                    }
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="grid place-items-center"></div>
                </div>
            </Link >

        </div >
    );
};

export default CardPesanan;
