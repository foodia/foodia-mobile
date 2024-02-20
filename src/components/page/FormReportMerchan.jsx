import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IconCamera, IconUser } from "@tabler/icons-react";
import InputForm from "../Imput";
import { useAppState } from "./UserContext";
import Swal from "sweetalert2";
import axios from "axios";
import Header from "../Header";

const FormReportMerchan = () => {
    const router = useRouter();
    const { state, setReportMechant } = useAppState();
    const [image_url, setimage_url] = useState(null);
    const [description, setdescription] = useState('');

    // the bug is here
    useEffect(() => {
        console.log('state p', state.reportMechant);
    }, [state]);

    useEffect(() => {
        // Ensure the user is logged in
        const token = sessionStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    const handleimage_urlChange = (event) => {
        setimage_url(event.target.files[0]);
    };

    const handledescriptionChange = (event) => {
        setdescription(event.target.value);
    };


    const handleStepTwoSubmit = async (event) => {
        event.preventDefault();
        // setReportMechant((prevData) => ({
        //     // ...prevData,
        //     image_url,
        //     description,
        // }));

        // setReportMechant({
        //     ...state.reportMechant,
        //     reportMechant: {
        //         image_url,
        //         description,
        //     },
        // });

        console.log('data baru', state);

        // Ensure all required fields are filled
        if (!image_url || !description) {
            alert('Please fill in all fields.');
            return;
        }
        // const reqData = {
        //     campaign_id: state.reportMechant?.campaign_id,
        //     title: `Peanan ${state.reportMechant?.merchant.merchant_name}`,
        //     description,
        //     order_id: state.reportMechant?.id,
        //     images: [
        //         {
        //             image_url: 'mediaUploadResponse.data.body.file_url',
        //         },
        //     ],
        // };
        // console.log('reqData', reqData);


        try {
            const token = sessionStorage.getItem('token');
            const id_merchant = sessionStorage.getItem('id');
            const formData = new FormData();
            formData.append('destination', 'rating');
            formData.append('file', image_url);

            // Upload media
            const mediaUploadResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}media/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Tambahkan header Content-Type untuk FormData
                },
            }
            );

            console.log('API Response media/upload:', mediaUploadResponse.data.body.file_url);

            if (mediaUploadResponse.status === 200) {
                // Jika upload media berhasil, buat request data untuk mengirim data campaign
                const reqData = {
                    campaign_id: state.reportMechant?.campaign_id,
                    title: `Peanan ${state.reportMechant?.merchant.merchant_name}`,
                    description,
                    type: 'merchant',
                    order_id: state.reportMechant?.id,
                    images: [
                        {
                            image_url: mediaUploadResponse.data.body.file_url,
                        },
                    ],
                };

                try {
                    const createReportMerchan = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}campaign-report/create`, reqData, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    console.log('API Response Report:', createReportMerchan.data);
                    Swal.fire({
                        icon: 'success',
                        title: 'Report Berhasilat',
                        text: `Report Berhasilat, silahkan lakukan penilaian campaign.`,
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    setTimeout(() => {
                        router.push('/merchant/reting');
                    }, 2000);

                } catch (error) {
                    console.error('Error creating report:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal Membuat Report',
                        text: 'Gagal Membuat Report Mohon Coba Lagi',
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }

            } else {
                // Handle kesalahan jika upload media gagal
                console.error('Error uploading media:', mediaUploadResponse.data.error);
            }

        } catch (error) {
            // Tangani kesalahan umum
            console.error('Error upload:', error);
        }

    };

    return (
        <>
            <Header title="Bukti Pengiriman" />
            <div className="container mx-auto mt-20 bg-white h-screen text-primary">
                {/* ... (your existing code) */}
                <div className="grid justify-items-center w-full">

                    <form className='p-2 mt-6 w-full' onSubmit={handleStepTwoSubmit}>
                        <div className="mb-2">
                            <label htmlFor="image_url" className="text-sm font-medium text-gray-900">Foto Selfi</label>
                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="image_url"
                                    className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100"
                                >
                                    {image_url ? (
                                        <img
                                            src={URL.createObjectURL(image_url)}
                                            alt="Foto Selfi"
                                            className="w-full h-full rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 bg-gray-50 rounded-lg w-28">
                                            <IconUser className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                                            <div className="flex flex-col items-center justify-center bg-primary rounded-lg w-20">
                                                <IconCamera className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        id="image_url"
                                        type="file"
                                        className="hidden"
                                        onChange={handleimage_urlChange}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="mb-2">
                            <label htmlFor='description' className="text-sm font-medium text-gray-900">Merchant Name</label>
                            <InputForm
                                cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                                label="description" type="text" name="description" value={description} onChange={handledescriptionChange} placeholder="Merchant Name"
                            />
                        </div>



                        <div className="grid gap-4 content-center">
                            <button
                                type="submit"
                                className='text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center'
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default FormReportMerchan;