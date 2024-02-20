import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';
import axios from 'axios';

import { IconCaretDown } from "@tabler/icons-react";

import { IconCaretUp } from "@tabler/icons-react";
import Swal from "sweetalert2";
import { useAppState } from "../UserContext";
import Header from "@/components/Header";


const DetailPesanan = () => {
    const router = useRouter();
    const { state, setReportMechant } = useAppState();

    const id_order = router.query.id;
    const [loading, setLoading] = useState(true);
    const [showFullText, setShowFullText] = useState(false);
    const [dataApi, setDataApi] = useState();


    const toggleReadMore = () => {
        setShowFullText((prevShowFullText) => !prevShowFullText);
    };


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
                const token = sessionStorage.getItem('token');

                if (!token) {
                    throw new Error('Missing required session data token');
                }
                if (!id_order) {
                    throw new Error('Missing required session data id');
                }
                // console.log('id', id_order);


                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}order/fetch/${id_order}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setDataApi(response.data.body);
                setLoading(false);
                // console.log('data', dataApi);

            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [loading, id_order]);
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
            try {
                const id = sessionStorage.getItem('id');
                const token = sessionStorage.getItem('token');

                if (!id || !token) {
                    throw new Error('Missing required session data');
                }

                const response = await axios.put(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}order/update/${id_order}`,
                    {
                        order_status: 'tolak',
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
        }
    };
    const handleAprovButtonClick = async (e) => {
        e.preventDefault();

        // Show SweetAlert confirmation dialog
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Anda akan menyetujui pesanan. Tindakan ini tidak dapat dibatalkan.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3FB648',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, setujui!',
        });


        // If the user confirms, call the handleReject function
        if (result.isConfirmed) {
            setLoading(false)
            try {
                const id = sessionStorage.getItem('id');
                const token = sessionStorage.getItem('token');

                if (!id || !token) {
                    throw new Error('Missing required session data');
                }

                const response = await axios.put(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}order/update/${id_order}`,
                    {
                        order_status: 'diproses',
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
            // await handleAprov();
        }
    };

    const handleBuktiPengiriman = async (e) => {
        e.preventDefault();
        // setReportMechant(dataApi);
        try {
            // Menggunakan setReportMechant untuk menyimpan data
            setReportMechant(dataApi);

            // Arahkan pengguna ke '/merchant/report'
            router.push('/merchant/report');
        } catch (error) {
            console.error('Gagal memasukkan data:', error);
            console.log('Tidak berhasil dimasukan');
        }

    };
    const getStatusIcon = () => {
        switch (dataApi?.order_status) {
            case 'review':
                return 'Review';
            case 'diproses':
                return 'Diproses';
            case 'tolak':
                return 'DiTolak';
            default:
                return null;
        }
    };

    return (
        <>
            <Header title="Detail Pesanan" />
            <div className="container mx-auto mt-20 bg-white h-full">
                <div className="place-content-center p-2">

                    <div className="bg-gray-200 p-2 rounded-md h-20">


                        <div className="flex justify-between ">
                            <div className="flex grid-cols-2 gap-2 content-center ">
                                <div className="rounded-md bg-purple-50 h-14 w-14">
                                    {dataApi?.merchant_product?.images?.length > 0 && (
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataApi.merchant_product.images[0].image_url}`}
                                            alt="Product Image"
                                            className="object-cover h-full w-full rounded-md"
                                        />
                                    )}
                                </div>
                                <p className="mt-4">{`${dataApi?.order_status === 'review' ? 'Menunggu konfirmasi' : dataApi?.order_status === 'diproses' ? 'Pesanan Sedang Diproses' : dataApi?.order_status === 'tolak' ? 'Pesana Ditolak' : ''}`} </p>
                            </div>
                            {/* <p className="text-right text-sm">{dataApi?.campaign.event_name}</p> */}
                            <div className={`mt-4 rounded-md h-6 px-2 ${dataApi?.order_status === 'review' ? 'text-white bg-blue-500' : dataApi?.order_status === 'diproses' ? 'text-black bg-yellow-500' : dataApi?.order_status === 'tolak' ? 'text-black bg-red-500' : ''}`}>
                                <p className="">{getStatusIcon()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-200 p-2 rounded-md mt-2">
                        <h5 className="text-base mb-1">Rangkuman Pesanan</h5>

                        <div className="flex justify-between grid grid-cols-2 gap-2 ">
                            <p className="text-sm">Campain</p>
                            <p className="text-right text-sm">{dataApi?.campaign.event_name}</p>
                        </div>

                        <hr className="h-px bg-black border-0 " />
                        <div className="flex justify-between grid grid-cols-2 gap-2 py-4">
                            <p className="text-sm">PIC</p>
                            <p className="text-right text-sm">{dataApi?.campaign.detonator.oauth.fullname}</p>
                            <p className="text-sm">No telpon</p>
                            <p className="text-right text-sm">{dataApi?.campaign.detonator.oauth.phone} </p>
                        </div>

                        <hr className="h-px bg-black border-0" />
                        <div className="flex justify-between grid grid-cols-2 gap-2 py-4">
                            <p className="text-sm">Tanggal Pelaksana</p>
                            <p className="text-right text-sm">{(dataApi?.campaign?.event_date || '').split('-').reverse().join('/')}</p>
                        </div>
                        <hr className="h-px bg-black border-0" />
                        <div className="flex justify-between grid grid-cols-2 gap-2 py-4">
                            <p className="text-sm">Tempat</p>
                            <p className="text-right text-sm">{dataApi?.campaign.address}</p>
                        </div>
                        <hr className="h-px bg-black border-0" />
                        <div className="flex justify-between grid grid-cols-2 gap-2 py-4">
                            <p className="text-sm">Pesanan</p>
                            <p className="text-right text-sm">{dataApi?.qty} x {dataApi?.merchant_product.name}</p>
                        </div>
                        <hr className="h-px bg-black border-0" />
                        <div className="flex justify-between grid grid-cols-2 gap-2 py-4">
                            <p className="text-sm">Total</p>
                            <p className="text-right text-sm text-primary">
                                Rp. {((dataApi?.qty || 0) * (dataApi?.merchant_product.price || 0)).toLocaleString('id-ID')}
                            </p>
                        </div>
                        <hr className="h-px bg-black border-0" />
                        <div className=" py-4">
                            <p className="text-sm">Tentang Program</p>
                            <p className={`font-normal  text-sm  ${showFullText ? '' : 'ketProduk'}`}>
                                {dataApi?.campaign.description}
                            </p>
                            <div className="bg-gray-200 hover:bg-gray-100 w-full grid place-content-center rounded-sm text-primary text-sm mt-2">
                                <button className="flex" onClick={toggleReadMore}>
                                    Selengkapnya {showFullText ? <IconCaretUp size={20} /> : <IconCaretDown size={20} />}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
                <div className=" h-20 bottom-0 my-0 p-2 bg-gray-200 rounded-md mt-2 mx-2 grid grid-cols-2 gap-4 place-content-center bg-gray-300">
                    {dataApi?.order_status === 'review' ?
                        <>
                            <button onClick={handleRejectButtonClick} className="bg-red-500 text-white rounded-md h-10">Tolak</button>
                            <button onClick={handleAprovButtonClick} className="bg-yellow-500 text-black rounded-md h-10">Terima</button>
                        </>
                        : dataApi?.order_status === 'diproses' ?
                            <button onClick={handleBuktiPengiriman} className="bg-primary text-black rounded-md h-10 w-full col-span-2">Buat Bukti Pegiriman</button>
                            : dataApi?.order_status === 'tolak' ?
                                <button className="bg-red-500 text-white rounded-md h-10 col-span-2">Pesanan Ditolak</button>
                                : ''}


                </div>

            </div >

        </>

    );
}

export default DetailPesanan;