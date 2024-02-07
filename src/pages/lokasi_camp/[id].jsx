// lokasi_camp.js
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import styles from "@/styles/Home.module.css"
import { IconCaretDown, IconCaretUp, IconMessage } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useAppState } from '@/components/page/UserContext';
// import 'sweetalert2/dist/sweetalert2.min.css';

const DynamicMarkerMap = dynamic(() => import('@/components/page/MarkerMap'), { ssr: false });
// const MySwal = withReactContent(Swal);

const LokasiCamp = () => {
    const router = useRouter();
    const { id } = router.query;
    const { state, setDonation } = useAppState();
    const [markerPosition, setMarkerPosition] = useState([51.505, -0.09]);
    const [showFullText, setShowFullText] = useState(false);
    const [campaignData, setCampaignData] = useState(null);
    const [nominalDonasi, setNominalDonasi] = useState(0);
    const toggleReadMore = () => {
        setShowFullText((prevShowFullText) => !prevShowFullText);
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/fetch/${id}`, {
                });
                setCampaignData(response.data.body);
                // console.log('data1', campaignData);

            } catch (error) {
                console.error(error);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleSubmit = (value) => {
        setNominalDonasi(parseInt(value));
        const data = {
            'amount': parseInt(value),
            'payment_channel': '',
            'success_url': `${process.env.NEXT_PUBLIC_URL_PAYMEN}`,
            'detail': {
                'campaign_id': id,
                'description': 'Donation',
                'donation_type': 'agnostic',
            }
        }
        setDonation(data);
        router.push('/metode_pembayaran');
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

    useEffect(() => {
        if (campaignData && campaignData.latitude && campaignData.longitude) {
            setMarkerPosition([campaignData.latitude, campaignData.longitude]);
            console.log('markerPosition', markerPosition);
            console.log('campaignData', campaignData);
            console.log('nominalDonasi', nominalDonasi);
            console.log('donation', state?.donation);
        }
    }, [id, nominalDonasi]);



    return (
        <div className="container mx-auto mt-24 bg-white h-full text-primary">
            <div className="flex justify-center">
                <h1 className='text-3xl font-bold'>Nama Camp </h1>
            </div>
            <div className="flex justify-center">
                <h1 className='text-xl font-bold'>info lokasi</h1>
            </div>
            <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
            <div className="grid justify-items-center w-full h-full">
                <div className="container mx-auto mt-4 bg-white h-full">

                    <div className="grid items-center justify-center mt-2 w-full">
                        <div className="items-center justify-center mt-2 w-full">
                            <div className=" rounded-lg">
                                <DynamicMarkerMap position={markerPosition} />
                            </div>
                        </div>

                        <div className="items-center justify-center mt-2 w-full ">
                            <div className="p-6 rounded-lg bg-green-500 w-80 h-full">
                                <div className="flex items-center justify-center">
                                    <div className="bg-gray-300 w-12 h-12 rounded-full mr-3">
                                        <img
                                            src={campaignData && campaignData.detonator && campaignData.detonator.self_photo
                                                ? `${process.env.NEXT_PUBLIC_URL_STORAGE}${campaignData.detonator.self_photo}`
                                                : '/img/default-image.png'}
                                            alt="image" className='w-full h-full object-cover rounded-full'
                                        />
                                    </div>
                                    <div className=" w-40 h-11">
                                        <p className='text-sm text-gray-500 font-medium'>Penyelenggara</p>
                                        <p className='text-lg text-black font-medium'>{campaignData?.detonator.oauth.fullname}</p>
                                    </div>
                                    <div className="text-white bg-blue-500 w-12 h-12 rounded-full ml-6 grid place-items-center">
                                        <IconMessage size={30} />
                                    </div>
                                </div>


                                <p className={`mt-4 font-normal text-black text-base ${showFullText ? '' : styles.truncate_info_location}`}>
                                    {campaignData?.description}
                                </p>
                                <div className="bg-green-500 hover:bg-blue-500 w-full grid place-content-center rounded-lg text-black text-xs mt-2">
                                    <button className="flex" onClick={toggleReadMore}>
                                        Selengkapnya {showFullText ? <IconCaretUp size={20} /> : <IconCaretDown size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center mt-2 w-full ">
                            <button onClick={showSweetAlert} className='bg-primary hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full' >Donasi</button>

                        </div>
                    </div >

                </div>


            </div>

        </div>
    );
};

export default LokasiCamp;
