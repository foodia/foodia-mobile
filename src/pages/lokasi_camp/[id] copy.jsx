// lokasi_camp.js
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import styles from "@/styles/Home.module.css"
import { IconCaretDown, IconCaretUp } from '@tabler/icons-react';
import Swal from 'sweetalert2';
// import 'sweetalert2/dist/sweetalert2.min.css';

const DynamicMarkerMap = dynamic(() => import('@/components/page/MarkerMap'), { ssr: false });
// const MySwal = withReactContent(Swal);

const LokasiCamp = () => {
    const router = useRouter();
    const { id } = router.query;
    const [markerPosition, setMarkerPosition] = useState([51.505, -0.09]);
    const [showFullText, setShowFullText] = useState(false);
    const [nominalDonasi, setNominalDonasi] = useState(0);
    const toggleReadMore = () => {
        setShowFullText((prevShowFullText) => !prevShowFullText);
    };

    const handleRadioChange = (value) => {
        setSelectedValue(value);
    };

    const showSweetAlert = async () => {
        const { value } = await Swal.fire({
            title: 'Pilih Nominal Donasi',
            html: `
            <div class="flex flex-col space-y-2">
              <label class="flex items-center bg-primary hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full checked:bg-blue-500">
                <input type="radio" name="donation" value="50000" class="mr-2 custom-radio "> Rp 50.000
              </label>
              <label class="flex items-center bg-primary hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full checked:bg-blue-500">
                <input type="radio" name="donation" value="100000" class="mr-2 custom-radio"> Rp. 100.000
              </label>
              <label class="flex items-center bg-primary hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full checked:bg-blue-500">
                <input type="radio" name="donation" value="250000" class="mr-2 custom-radio"> Rp. 250.000
              </label>
              <label class="flex items-center bg-primary hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full checked:bg-blue-500">
                <input type="radio" name="donation" value="500000" class="mr-2 custom-radio"> Rp. 500.000
              </label>
              <label class="flex items-center">
                <input type="number" name="nominal" class="mr-2 custom-input" placeholder="Masukkan Nominal"> Minimal Rp. 50.000
              </label>
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
                        return nominalValue.value;
                    } else {
                        return 'input nominal value';
                    }
                } else {
                    return radioValue.value;
                }
            },
        });

        if (value) {
            setNominalDonasi(parseInt(value));
        }
    };


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



                                    </div>
                                    <div className="bg-gray-300 w-40 h-11"></div>
                                    <div className="bg-gray-300 w-12 h-12 rounded-full ml-6"></div>
                                </div>


                                <p className={`font-normal text-black text-base ${showFullText ? '' : styles.truncate_info_location}`}>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias reiciendis dolorem vero ducimus quas distinctio deserunt nam quam? Consequuntur similique obcaecati maiores tenetur vel! Officia culpa dolor sunt incidunt fugit.
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea nemo rerum sed deleniti at, porro atque corporis magni iste omnis aperiam harum sint ducimus nulla eum qui temporibus earum est.
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
