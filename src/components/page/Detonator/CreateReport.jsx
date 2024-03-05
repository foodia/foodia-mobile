import InputForm from "@/components/Imput";
import { IconCamera, IconPhotoScan, IconUser } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from 'axios';
import Swal from "sweetalert2";
import Header from "@/components/Header";

const CreateReport = (CreateReport) => {
    // const { stepForm } = props;
    const router = useRouter();
    const campaign_id = router.query.id;
    const [newReport, setnewReport] = useState({});
    const [title, seTitle] = useState(newReport?.title ?? '');
    const [description, setDescription] = useState(newReport?.description ?? '');
    const [imgReport, setImgReport] = useState(newReport?.imgReport ?? null);
    const [dataCamp, setDataCamp] = useState();

    useEffect(() => {
        const resspones = axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/fetch/${campaign_id}`);
        resspones.then((response) => {
            setDataCamp(response.data.body);
            console.log('respones', response.data.body);
        })
            .catch((error) => {
                console.error(error);
            })
    }, [campaign_id])

    const handletitleChange = (event) => {
        seTitle(event.target.value);
    };

    const handledescriptionChange = (event) => {
        setDescription(event.target.value);
    };
    const handleImgReportChange = (event) => {
        setImgReport(event.target.files[0]);
    };

    const [error, setError] = useState('');


    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevents the default form submission

        // Validation checks
        if (!title || !description || !imgReport) {
            window.alert('All fields are required');
            return;
        }
        try {
            const token = sessionStorage.getItem('token');
            const formData = new FormData();
            formData.append('destination', 'report');
            formData.append('file', imgReport);

            console.log('form', formData);
            const mediaUploadResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}media/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log('API Response media/upload:', mediaUploadResponse.data.body.file_url);
            const Image = mediaUploadResponse.data.body.file_url;

            if (mediaUploadResponse.status === 200) {
                const eventData = {
                    campaign_id: parseInt(campaign_id),
                    title,
                    type: 'detonator',
                    order_id: null,
                    description,
                    images: [
                        {
                            image_url: Image,
                        }
                    ]
                };
                setnewReport(eventData);
                console.log('cek data', eventData);
                console.log('gambar', Image);

                try {
                    const creatReportCamp = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}campaign-report/create`, eventData, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    console.log('API Response create creatReportCamp:', creatReportCamp.data);
                    router.push(`/detonator/report/${campaign_id}`);

                    Swal.fire({
                        icon: 'success',
                        title: 'Campaign Created!',
                        text: 'Campaign Berhasil dibuat Mohon Tunggu approval dari admin',
                        showConfirmButton: false,
                        timer: 2000,
                    });

                    setTimeout(() => {
                        router.push(`/detonator/report/${campaign_id}`);
                    }, 2000);
                } catch (error) {
                    console.error('Error creating campaign:', error.response.data)
                    console.error('Error creating campaign:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal Membuat Campaign',
                        text: 'Gagal Membuat Campaign Mohon Coba Lagi',
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }

            } else {
                console.log(mediaUploadResponse.data.data);
                console.error('Gagal Upload:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Image Gagal Upload',
                    text: 'Gagal Upload Image Mohon Coba Lagi',
                    showConfirmButton: false,
                    timer: 2000,
                });
            }

        } catch (error) {
            console.log(error);
            let errorMessage = 'Gagal membuat kampanye. Mohon coba lagi.';
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            }
            Swal.fire({
                icon: 'error',
                title: 'Gagal Membuat Campaign',
                text: errorMessage,
                showConfirmButton: false,
                timer: 2000,
            });
        }

        // router.push('/registrasi/merchant?step=2');
    }


    useEffect(() => {
        console.log('Data Nee Report:', newReport);
    }, [newReport]);

    return (
        <>
            <div className="container mx-auto pt-14 bg-white h-screen">
                <Header />
                <div className="place-content-center">
                    <div className="mx-auto text-center p-2 text-primary">
                        <h1 className="font-bold text-lg">Form Penyelesaian Detonator</h1>
                        <h1>{dataCamp?.event_name}</h1>
                    </div>
                    <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
                    <form className='p-2 mt-5 w-full' onSubmit={handleSubmit}>

                        <div className="mb-2">
                            <label htmlFor="imgReport" className="text-sm font-medium text-gray-900"></label>
                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="imgReport"
                                    className="flex items-center p-4 w-full h-36 border-2 border-gray-500 border-dashed rounded-lg cursor-pointer bg-gray-200  hover:bg-gray-100"
                                >
                                    {imgReport ? (
                                        <img
                                            src={URL.createObjectURL(imgReport)}
                                            alt="Foto Selfi"
                                            className="w-full h-full rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="flex ">
                                            <div className="flex items-center justify-center bg-primary rounded-lg w-14 h-14">
                                                <IconCamera className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="my-auto ml-2">
                                                <p className="text-sm font-bold text-black">Foto Acara</p>
                                                <p className="text-xs font-semibold text-gray-500">Ambil foto acara</p>
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
                        </div>
                        <div className="mb-2">
                            {/* <label htmlFor='title' className="text-sm font-medium text-gray-900">Report</label> */}
                            <InputForm
                                cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                                label="title" type="text" name="title" value={title} onChange={handletitleChange} placeholder="Judul"
                            />
                        </div>
                        <div className="mb-2">
                            {/* <label htmlFor='description' className="text-sm font-medium text-gray-900">Description </label> */}
                            <textarea
                                id="description"
                                name="description"
                                value={description}
                                onChange={handledescriptionChange}
                                placeholder="Description"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-24"
                            />
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
    )
}

export default CreateReport;