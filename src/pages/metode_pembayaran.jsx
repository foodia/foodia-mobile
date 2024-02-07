import SlideCard from "@/components/SlideCard";
import { useAppState } from "@/components/page/UserContext";
import styles from "@/styles/Home.module.css"
import { IconBuildingStore } from "@tabler/icons-react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "tabler-icons-react";


const MetodePembayaran = () => {
    const router = useRouter();
    const [metodePembayaran, setMetodePembayaran] = useState('');
    const { state, setDonation } = useAppState();
    const [pajak, setPajak] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!state.donation.amount || !state.donation.detail.campaign_id) {
                    console.log('No data');

                    // Use SweetAlert to show a warning
                    Swal.fire({
                        icon: 'error',
                        title: 'Nominal belum di isi',
                        text: `Silahkan di coba kembali`,
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    setTimeout(() => {
                        router.push('/home');
                    }, 2000);
                } else {
                    const totalBayar = state.donation.amount + pajak;
                    setTotal(totalBayar);
                    console.log('data', state.donation);
                }
            } catch (error) {
                console.error('Error fetching data:', error);

                // Use SweetAlert to show an error
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error fetching data!',
                });
            }
        };

        fetchData();
    }, [state.donation]);

    const handleRadioChange = (event) => {
        setMetodePembayaran(event.target.value);
        ;
    };

    const handleBayarSekarang = async () => {
        console.log('metodePembayaran', metodePembayaran);
        const data = {
            'amount': parseInt(total),
            'payment_channel': metodePembayaran,
            'success_url': `${process.env.NEXT_PUBLIC_URL_PAYMEN}`,
            'detail': {
                'campaign_id': state.donation.detail.campaign_id,
                'description': state.donation.detail.description,
                'donation_type': state.donation.detail.donation_type
            }
        }
        setDonation(data);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}donation/payment`, data);
            console.log('data respone', response.data.body.actions.desktop_web_checkout_url);
            const responeUrl = response.data.body.actions.desktop_web_checkout_url;
            router.push(`${responeUrl}`);

            // Swal.fire({
            //     icon: 'success',
            //     title: 'Campaign Created!',
            //     text: 'Campaign Berhasil dibuat Mohon Tunggu approval dari admin',
            //     showConfirmButton: false,
            //     timer: 2000,
            // });

            // setTimeout(() => {
            //     router.push(`${responeUrl}`);
            // }, 2000);

        } catch {

        }
        // router.push('/bukti_pembayaran');
    };

    const formatRupiah = (amount) => {
        const formatter = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        });

        return formatter.format(amount);
    };


    return (

        <main className="">
            <div className="container my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
                <div className="container mx-auto mt-24  h-screen">
                    <div className="px-4">
                        <label for="default-radio-1" className="my-2 flex items-center justify-between border-gray-500 bottom-1 border rounded-lg h-14 px-4">
                            <div className="flex items-center">
                                <img src="icon/payment/LinkAja.png" alt="" className="w-10 h-10 rounded-lg" />
                                <p for="default-radio-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    LinkAja
                                </p>
                            </div>
                            <input id="default-radio-1" type="radio" value="ID_LINKAJA" name="default-radio" onChange={handleRadioChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        </label>
                        {/* <label for="default-radio-2" className="my-2 flex items-center justify-between border-gray-500 bottom-1 border rounded-lg h-14 px-4">
                            <div className="flex items-center">
                                <img src="icon/payment/gopay.png" alt="" className="w-10 h-10 rounded-lg" />
                                <p className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Gopay
                                </p>
                            </div>
                            <input id="default-radio-2" type="radio" value="Gopay" name="default-radio" onChange={handleRadioChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        </label> */}

                    </div>


                </div>

            </div>
            <div className="p-4 mobile-w fixed h-56 bottom-0 my-0 mx-auto w-full max-w-screen-sm   bg-white shadow-[rgba(0,0,15,0.5)_0px_0px_10px_2px] rounded-lg">
                <div className="text-center">
                    <h1 className="font-bold">Donasi Cepat</h1>
                </div>
                <hr className="w-full h-1 mx-auto my-2 bg-gray-300 rounded" />
                <div className="flex justify-between">
                    <h1 className="font-bold text-gray-400">Nominal Donasi</h1>
                    <p className="font-semibold">{formatRupiah(state.donation.amount)}</p>
                </div>
                <div className="flex justify-between">
                    <h1 className="font-bold text-gray-400">Biaya Pajak</h1>
                    <p className="font-semibold">{formatRupiah(pajak)}</p>
                </div>
                <hr className="w-full h-1 mx-auto my-2 bg-gray-300 rounded" />
                <div className="flex justify-between">
                    <h1 className="font-bold text-gray-400">Total</h1>
                    <p className="font-semibold text-primary">{formatRupiah(total)}</p>
                </div>
                <div className="text-center my-2">
                    <button className="bg-primary text-white w-full h-12 rounded-lg font-bold" onClick={handleBayarSekarang}>Bayar Sekarang</button>
                </div>
            </div>
        </main>


    );
}

export default MetodePembayaran;