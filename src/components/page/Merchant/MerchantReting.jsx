import InputForm from "@/components/Imput";
import { IconArrowNarrowRight, IconCamera, IconPhotoScan } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAppState } from "../UserContext";
import Swal from "sweetalert2";
import axios from "axios";
import Header from "@/components/Header";

const MerchantReting = (MerchantReting) => {
    const router = useRouter();
    const { id } = router.query;
    const { state, setReportMechant } = useAppState();
    const [newReport, setnewReport] = useState({});
    const [star, setStar] = useState(newReport?.star || 0);
    const [description, setDescription] = useState(newReport?.description ?? '');
    // const [imgReport, setImgReport] = useState(newReport?.imgReport ?? null);


    useEffect(() => {
        console.log(star);
        console.log('dara state', state.reportMechant);
    }, [star]);

    const handleStarChange = (index) => {
        setStar(index);
    };

    const handledescriptionChange = (event) => {
        setDescription(event.target.value);
    };
    // const handleImgReportChange = (event) => {
    //     setImgReport(event.target.files[0]);
    // };
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevents the default form submission
        const id_merchant = sessionStorage.getItem('id');
        const token = sessionStorage.getItem('token');

        // Validation checks
        if (!star || !description) {
            window.alert('All fields are required');
            return;
        }

        // const eventData = {
        //     relation_id: parseInt(id_merchant),
        //     order_id: parseInt(id),
        //     relation_type: "merchant",
        //     star,
        //     note: description,
        //     photo: Image,
        //     data_order: state.reportMechant
        // };
        // console.log('event data', eventData);
        const eventData = {
            relation_id: parseInt(id_merchant),
            relation_type: "detonator",
            order_id: parseInt(state.reportMechant?.id),
            star,
            photo: 'reting_merchat_to_cempain',
            note: description,
        };
        setnewReport(eventData);
        console.log('cek data', eventData);

        try {
            const creatretingmerchant = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}rating/create`, eventData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log('API Response create rating:', creatretingmerchant.data);


            Swal.fire({
                icon: 'success',
                title: 'Reting Campaign!',
                text: 'Berhasil memberi rating',
                showConfirmButton: false,
                timer: 2000,
            });

            setTimeout(() => {
                router.push('/merchant');
            }, 2000);
        } catch (error) {
            // console.error('1Error creating reting:', error.response.data)
            console.error('2Error creating reting:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal memberi rating',
                text: 'Gagal memberi rating Mohon Coba Lagi',
                showConfirmButton: false,
                timer: 2000,
            });
        }

    }
    return (
        <>
            <div className="container mx-auto pt-14 bg-white h-screen">
                <Header title="Review Detonator" />
                <div className="place-content-center">
                    <div className=" w-full p-2">
                        <div className="flex justify-between items-center  w-full p-2  border border-1 border-gray-500 rounded-lg">
                            <div className="flex ">

                                <div className="w-12 h-12 bg-white rounded-full">
                                    <img src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${state.reportMechant.campaign?.detonator.self_photo}`} className="w-12 h-12 rounded-full object-cover" alt="" />
                                </div>
                                <div className="ml-2">

                                    <p className="text-base text-primary">{state.reportMechant.campaign?.detonator.oauth.fullname}</p>
                                    <p className="text-sm">Verified Campaigner</p>
                                </div>
                            </div>
                            <IconArrowNarrowRight className=" grid grid-cols-3 gap-4 place-items-end text-black" />
                        </div>

                    </div>
                    <hr className="w-full h-0.5 mx-auto mt-2 bg-gray-300 border-0 rounded" />
                    <form className='p-2 mt-2 w-full' onSubmit={handleSubmit}>

                        <div className="mb-2">
                            <InputForm
                                cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                                label="description" type="text" name="description" value={description} onChange={handledescriptionChange} placeholder="Komentar"
                            />
                        </div>
                        {/* <div className="mb-2">
                        <label htmlFor="imgReport" className="text-sm font-medium text-gray-900"></label>
                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="imgReport"
                                className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100"
                            >
                                {imgReport ? (
                                    <img
                                        src={URL.createObjectURL(imgReport)}
                                        alt="Foto Selfi"
                                        className="w-full h-full rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 bg-gray-50 rounded-lg w-28">
                                        <IconPhotoScan className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                                        <div className="flex flex-col items-center justify-center bg-primary rounded-lg w-20">
                                            <IconCamera className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                                        </div>
                                    </div>
                                )}
                                <input
                                    id="imgReport"
                                    type="file"
                                    className="hidden"
                                    onChange={handleImgReportChange}
                                />
                            </label>
                        </div>
                    </div> */}
                        <div className="mb-2 flex justify-center">
                            {/* Field input Rating star 1 to 5 */}
                            {[1, 2, 3, 4, 5].map((index) => (
                                <svg
                                    key={index}
                                    className={`w-4 h-4 ms-1 cursor-pointer ${index <= star ? 'text-yellow-300' : 'text-gray-500'}`}
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 22 20"
                                    onClick={() => handleStarChange(index)}
                                >
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                </svg>
                            ))}
                        </div>
                        <div className="grid gap-4 content-center">
                            <button
                                type="submit"
                                className='text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
                                Submit
                            </button>
                        </div>
                    </form>

                </div >
            </div>
        </>
    );
}

export default MerchantReting;