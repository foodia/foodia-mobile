// src/components/FormCampaing/Step.jsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import InputForm from '../Imput';
import RoutStep from '../RoutStep';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';


import dynamic from 'next/dynamic';
import { IconCamera, IconCirclePlus, IconGardenCart, IconPhotoScan, IconTrash } from '@tabler/icons-react';
import CardFood from '../CardFood';
import Link from 'next/link';
import axios from 'axios';
import AddFoodCamp from './AddFoodCamp';
import Swal from 'sweetalert2';
import CardListMerchan from '../page/Detonator/CardListMerchan';
import TimePicker from 'react-time-picker';
const DynamicMap = dynamic(() => import('../page/GeoMap'), { ssr: false });

function StepOne({ updateLocalStorage, setUploadedFile, uploadedFile }) {
    const router = useRouter();


    const [eventName, setEventName] = useState(() => {
        const storedFormData = localStorage.getItem('formData');
        const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
        return parsedFormData.eventName || '';
    });

    const [TypeEvent, setTypeEvent] = useState(() => {
        const storedFormData = localStorage.getItem('formData');
        const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
        return parsedFormData.TypeEvent || '';
    });

    const [Tanggal, setTanggal] = useState(() => {
        const storedFormData = localStorage.getItem('formData');
        const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
        return parsedFormData.Tanggal || '';
    });

    const [Waktu, setWaktu] = useState(() => {
        const storedFormData = localStorage.getItem('formData');
        const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
        return parsedFormData.Waktu || '';
    });

    const [Description, setDescription] = useState(() => {
        const storedFormData = localStorage.getItem('formData');
        const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
        return parsedFormData.Description || '';
    });

    // const [ImageCamp, setImageCamp] = useState(() => {
    //     const storedFormData = localStorage.getItem('formData');
    //     const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
    //     return parsedFormData.ImageCamp || '';
    // });

    const handleEventNameChange = (event) => {
        setEventName(event.target.value);
    };

    const handleTypeEventChange = (event) => {
        setTypeEvent(event.target.value);
    };

    const handleTanggalChange = (event) => {
        const selectedDate = event.target.value;

        // Get the current date
        const currentDate = new Date();

        // Convert the selected date to a Date object for comparison
        const selectedDateObject = new Date(selectedDate);

        // Calculate the minimum allowed date (7 days from the current date)
        const minAllowedDate = new Date();
        minAllowedDate.setDate(currentDate.getDate() + 7);

        // Check if the selected date is at least 7 days from the current date
        if (selectedDateObject >= minAllowedDate) {
            setTanggal(selectedDate);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Date',
                text: 'Please select a date at least 7 days from the current date.',
                timer: 2000,
            });
        }
    };

    const handleWaktuChange = (event) => {

        const selectedTime = event.target.value;

        const isWithinAllowedRange = isTimeWithinRange(selectedTime);

        if (isWithinAllowedRange) {
            setWaktu(selectedTime);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Time',
                text: 'Selected time is not within the allowed range (08:00 - 17:00).',
                timer: 2000,
            });
        }
    };
    const isTimeWithinRange = (time) => {
        const selectedHour = parseInt(time.split(':')[0], 10);
        const selectedMinute = parseInt(time.split(':')[1], 10);
        return (selectedHour === 8 && selectedMinute >= 0) ||
            (selectedHour > 8 && selectedHour < 17) ||
            (selectedHour === 17 && selectedMinute === 0);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleImageCampChange = (event) => {
        // const file = event.target.files[0];
        setUploadedFile(event.target.files[0]);

        // console.log(file)

        // if (file) {
        //     const reader = new FileReader();
        //     reader.onloadend = () => {
        //         setImageCamp(reader.result);
        //     };
        //     reader.readAsDataURL(file);
        // }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!eventName || !TypeEvent || !Tanggal || !Waktu) {
            window.alert('All fields are required');
            return;
        }

        const formData = {
            eventName,
            TypeEvent,
            Tanggal,
            Waktu,
            Description,
        };

        // Update the local storage when form data changes
        updateLocalStorage(formData);

        // Reset form after submit
        setEventName('');
        setTypeEvent('');
        setTanggal('');
        setWaktu('');
        // setImageCamp('');

        // Navigate to the next step
        router.push(`creatcampaign?step=2`);
    };

    useEffect(() => {
        console.log('gambar', uploadedFile);
    }, [uploadedFile]);

    return (
        <>

            <ol className="flex justify-center mb-4 sm:mb-5 w-full p-2">
                <RoutStep
                    liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block  after:border-b after:border-4 after:border-primary`}
                    divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-primary`}
                    iconCss={`w-4 h-4 text-white lg:w-6 lg:h-6 `}
                    iconName={"CalendarEvent"}
                />
                <RoutStep
                    liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block   after:border-b after:border-4 after:border-gray-700`}
                    divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-gray-700`}
                    iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
                    iconName={"Map"}
                />
                <RoutStep
                    liCss={`flex items-center`}
                    divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-gray-700`}
                    iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
                    iconName={"CalendarEvent"}
                />
            </ol>
            <form className="p-2 mt-10 w-full" onSubmit={handleSubmit}>
                <div className="mb-2 px-4 px-4">
                    <label htmlFor="eventName" className="text-sm font-medium text-gray-900">
                        Event Name
                    </label>
                    <InputForm
                        cssInput="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-10 p-2.5"
                        label="eventName"
                        type="text"
                        name="eventName"
                        value={eventName}
                        onChange={handleEventNameChange}
                        placeholder="Event Name"
                    />
                </div>

                <div className="mb-2 px-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type Event:
                        <select
                            name="TypeEvent"
                            value={TypeEvent}
                            onChange={handleTypeEventChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        >
                            <option >---Pilih Type Event---</option>
                            <option value="one_time">One Time</option>
                            <option value="reguler">Reguler</option>
                        </select>
                    </label>
                </div>

                <div className="mb-2 px-4">
                    <label htmlFor="Tanggal" className="text-sm font-medium text-gray-900">
                        Tanggal
                    </label>
                    <InputForm
                        cssInput="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        label="Tanggal"
                        type="date"
                        name="Tanggal"
                        value={Tanggal}
                        onChange={handleTanggalChange}
                        placeholder="Tanggal"
                    />
                </div>
                {/* <TimePicker onChange='' value='' /> */}
                <div className="mb-2 px-4">
                    <label htmlFor="Waktu" className="text-sm font-medium text-gray-900">
                        Waktu
                    </label>
                    <InputForm
                        cssInput="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        label="Waktu"
                        type="time"
                        name="Waktu"
                        value={Waktu}
                        onChange={handleWaktuChange}
                        placeholder="Waktu"
                    />
                </div>

                <div className="mb-2 px-4">
                    <label htmlFor="Description" className="text-sm font-medium text-gray-900">
                        Description
                    </label>
                    <textarea
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        id="Description"
                        name="Description"
                        value={Description}
                        onChange={handleDescriptionChange}
                        placeholder="Description"
                    />
                </div>

                <div className="mb-2 px-4">
                    <label htmlFor="ImageCamp" className="text-sm font-medium text-gray-900">Image</label>
                    <div className="flex items-center justify-center w-full">
                        <label
                            htmlFor="uploadedFile"
                            className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100"
                        >
                            {uploadedFile ? (
                                <img
                                    src={URL.createObjectURL(uploadedFile)}
                                    alt="Image"
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
                                id="uploadedFile"
                                type="file"
                                className="hidden"
                                onChange={handleImageCampChange}
                            />
                        </label>
                    </div>
                </div>

                <div className="grid gap-4 content-center px-4">
                    <button
                        type="submit"
                        className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </>
    );
}
function StepTwo({ updateLocalStorage }) {
    const router = useRouter();

    const [locationInfo, setLocationInfo] = useState(null);
    const [location, setLocation] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [subDistrict, setSubDistrict] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const [Jalan, setJalan] = useState('');// menggunakan respon address
    const [DetaiAlamat, setDetaiAlamat] = useState('');
    const [coordinates, setCoordinates] = useState('');

    const [tracking, setTracking] = useState(true);

    const handleDataFromMap = (receivedLocationInfo) => {
        setLocationInfo(receivedLocationInfo);
    };

    const getCurrentLocation = () => {
        setTracking((prevTracking) => !prevTracking);
    };

    const handleJalanChange = (event) => {
        setJalan(event.target.value);
    };

    const handleDetaiAlamatChange = (event) => {
        setDetaiAlamat(event.target.value);
    };

    useEffect(() => {
        if (locationInfo) {
            setLocation(locationInfo.fullAdres);
            setProvince(locationInfo.province);
            setCity(locationInfo.city);
            setSubDistrict(locationInfo.sub_district);
            setPostalCode(locationInfo.postal_code);
            setJalan(locationInfo.address);
            setCoordinates(locationInfo.coordinates);
        }
    }, [locationInfo]);

    useEffect(() => {
        // Check local storage for existing form data
        const storedFormData = localStorage.getItem('formData');
        if (storedFormData) {
            const parsedFormData = JSON.parse(storedFormData);
            if (parsedFormData) {
                // Merge the existing data with the new data
                setLocation(parsedFormData.location || '');
                setJalan(parsedFormData.Jalan || '');
                setDetaiAlamat(parsedFormData.DetaiAlamat || '');
                setCoordinates(parsedFormData.coordinates || '');
            }
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!location || !Jalan || !DetaiAlamat) {
            window.alert('All fields are required');
            return;
        }

        const formData = {
            // set the existing data
            ...JSON.parse(localStorage.getItem('formData')),
            location,
            Jalan,
            DetaiAlamat,
            coordinates,
            province,
            city,
            subDistrict,
            postalCode,
        };

        // upload data to local storage
        updateLocalStorage(formData);

        console.log(formData);

        router.push(`creatcampaign?step=3`);
    };

    return (
        <>
            <ol className="flex justify-center mb-4 sm:mb-5 w-full p-2">
                <RoutStep
                    liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block  after:border-b after:border-4 after:border-primary`}
                    divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-primary`}
                    iconCss={`w-4 h-4 text-white lg:w-6 lg:h-6 `}
                    iconName={"CalendarEvent"}
                />
                <RoutStep
                    liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block   after:border-b after:border-4 after:border-gray-700`}
                    divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-primary`}
                    iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
                    iconName={"Map"}
                />
                <RoutStep
                    liCss={`flex items-center`}
                    divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-gray-700`}
                    iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
                    iconName={"CalendarEvent"}
                />
            </ol>

            <div className="flex justify-center border-gray-300 rounded-lg w-full mb-2 px-8">

                <button onClick={getCurrentLocation} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    {tracking ?
                        (
                            <p>Set Current Location</p>
                        )
                        : (
                            <p>Custom Location</p>
                        )
                    }
                </button>

            </div>
            <form className="p-2 w-full" onSubmit={handleSubmit}>
                <div className="flex justify-center border-gray-300 rounded-lg mb-2 px-4">
                    <DynamicMap sendDataToPage={handleDataFromMap} tracking={tracking} />
                </div>
                <div className="mb-2 px-4">
                    <label htmlFor='location' className="text-sm font-medium text-gray-900">Location</label>
                    <InputForm
                        cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 m-1`}
                        label="Location Name"
                        type="text"
                        name="location"
                        value={location}
                        defaultValue={location} // Use defaultValue instead of value
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location Name"
                    />

                </div>
                <div className="mb-2 px-4">
                    <label htmlFor='Jalan' className="  text-sm font-medium text-gray-900">Nama Jalan</label>

                    <InputForm
                        cssInput="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 m-1"
                        label="Jalan"
                        type="text"
                        name="Jalan"
                        value={Jalan}
                        onChange={handleJalanChange}
                        placeholder="Nama Jalan"
                    />
                </div>
                <div className="mb-2 px-4">
                    <label htmlFor='DetaiAlamat' className="  text-sm font-medium text-gray-900">Detai Alamat</label>
                    <InputForm
                        cssInput="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 m-1"
                        label="DetaiAlamat"
                        type="text"
                        name="DetaiAlamat"
                        value={DetaiAlamat}
                        onChange={handleDetaiAlamatChange}
                        placeholder="Detail Lainnya (Cth: Block/Unit No., Patokan)"
                    />
                </div>


                <div className="grid gap-4 content-center px-4">
                    <button
                        type="submit"
                        className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </>
    )
}
function StepThree({ cart, updateCart, setUploadedFile, uploadedFile }) {
    const router = useRouter();
    const totalCartPrice = cart.reduce((total, item) => total + item.total, 0);
    const totalCartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    const groupedCart = cart.reduce((acc, item) => {
        const IdMerchan = item.merchant_id;
        if (!acc[IdMerchan]) {
            acc[IdMerchan] = [];
        }
        acc[IdMerchan].push(item);
        return acc;
    }, {});

    const handleDecrease = (IdMerchan, itemId) => {
        const updatedCart = [...cart];

        const itemIndex = updatedCart.findIndex(item => item.merchant_id === parseInt(IdMerchan) && item.id === itemId);

        console.log('IdMerchan:', IdMerchan);
        console.log('itemId:', itemId);
        console.log('Data updatedCart:', updatedCart);
        console.log('itemIndex:', itemIndex);

        if (itemIndex !== -1) {
            const updatedItem = { ...updatedCart[itemIndex] };

            if (updatedItem.quantity > 1) {
                updatedItem.quantity -= 1;
                updatedItem.total = updatedItem.quantity * updatedItem.price;

                updatedCart[itemIndex] = updatedItem;

                const totalCartPrice = updatedCart.reduce((total, item) => total + item.total, 0);
                const totalCartQuantity = updatedCart.reduce((total, item) => total + item.quantity, 0);

                console.log('updatedCart after decrease:', updatedCart);

                updateCart(updatedCart, totalCartPrice, totalCartQuantity);
            } else {
                handleRemove(IdMerchan, itemId);
            }
        } else {
            console.warn('Item not found in cart:', { IdMerchan, itemId });
        }
    };

    const handleIncrease = (IdMerchan, itemId) => {
        const updatedCart = [...cart];
        const itemIndex = updatedCart.findIndex(item => item.merchant_id === parseInt(IdMerchan) && item.id === itemId);

        if (itemIndex !== -1) {
            updatedCart[itemIndex].quantity += 1;
            updatedCart[itemIndex].total = updatedCart[itemIndex].quantity * updatedCart[itemIndex].price;

            const totalCartPrice = updatedCart.reduce((total, item) => total + item.total, 0);
            const totalCartQuantity = updatedCart.reduce((total, item) => total + item.quantity, 0);

            updateCart(updatedCart, totalCartPrice, totalCartQuantity);
        }
    };

    const handleRemove = (IdMerchan, itemId) => {
        const updatedCart = cart.filter(item => !(item.merchant_id === parseInt(IdMerchan) && item.id === itemId));
        const totalCartPrice = updatedCart.reduce((total, item) => total + item.total, 0);
        const totalCartQuantity = updatedCart.reduce((total, item) => total + item.quantity, 0);
        updateCart(updatedCart, totalCartPrice, totalCartQuantity);
    };

    const handleSubmit = async () => {
        console.log('data', cart);
        try {
            // Retrieve formData from local storage
            const totalCartPrice = cart.reduce((total, item) => total + item.total, 0);
            const totalCartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
            const campData = JSON.parse(localStorage.getItem('formData'));
            const detonator_id = sessionStorage.getItem('id');
            const token = sessionStorage.getItem('token');

            const formData = new FormData();
            formData.append('destination', 'campaign');
            formData.append('file', uploadedFile);

            const mediaUploadResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}media/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('API Response media/upload:', mediaUploadResponse.data.body.file_url);

            if (mediaUploadResponse.status === 200) {

                const products = cart.map(item => ({
                    merchant_id: parseInt(item.merchant_id),
                    merchant_product_id: parseInt(item.id),
                    qty: parseInt(item.quantity),
                }));

                const eventData = {
                    detonator_id: parseInt(detonator_id),
                    event_name: campData.eventName,
                    event_type: campData.TypeEvent,
                    event_date: campData.Tanggal,
                    event_time: campData.Waktu, // Check if you intended to use it twice
                    description: campData.Description,
                    donation_target: parseFloat(totalCartPrice),
                    province: campData.province,
                    city: campData.city,
                    sub_district: campData.sub_district ?? "-",
                    postal_code: campData.postal_code ?? "-",
                    address: campData.location,
                    latitude: String(campData.coordinates.lat),
                    longitude: String(campData.coordinates.lng),
                    image_url: mediaUploadResponse.data.body.file_url, // Set to the actual file_url
                    food_required: parseInt(totalCartQuantity),
                    food_total: parseInt(totalCartQuantity),
                    products: products,
                };

                console.log('cek data', eventData);

                try {
                    const createCampaignResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/create`, eventData, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    console.log('API Response create campaign:', createCampaignResponse.data);
                    localStorage.removeItem('cart');
                    localStorage.removeItem('formData');
                    router.push('/detonator');

                    Swal.fire({
                        icon: 'success',
                        title: 'Campaign Created!',
                        text: 'Campaign Berhasil dibuat Mohon Tunggu approval dari admin',
                        showConfirmButton: false,
                        timer: 2000,
                    });

                    setTimeout(() => {
                        router.push('/detonator');
                    }, 2000);
                } catch (error) {
                    console.error('Error creating campaign:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal Membuat Campaign',
                        text: 'Gagal Membuat Campaign Mohon Coba Lagi',
                        showConfirmButton: false,
                        timer: 2000,
                    });

                }
            }

        } catch (error) {
            console.error('API Error:', error);
            if (error.response && error.response.status === 401) {
                router.push('/login/detector');
                localStorage.removeItem('cart');
                localStorage.removeItem('formData');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Image Gagal Upload',
                    text: 'Gagal Upload Image Mohon Coba Lagi',
                    showConfirmButton: false,
                    timer: 2000,
                });

                setTimeout(() => {
                    router.push('/creatcampaign?step=1');
                }, 2000);
            }
        }
    };

    const handleLink = () => {
        router.push('/creatcampaign?step=5');
    };

    // localStorage.removeItem('formData');
    // localStorage.removeItem('cart');

    return (
        <>
            <ol className="flex justify-center mb-4 sm:mb-5 w-full p-2">
                <RoutStep
                    liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block  after:border-b after:border-4 after:border-primary`}
                    divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-primary`}
                    iconCss={`w-4 h-4 text-white lg:w-6 lg:h-6 `}
                    iconName={"CalendarEvent"}
                />
                <RoutStep
                    liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block   after:border-b after:border-4 after:border-primary`}
                    divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-primary`}
                    iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
                    iconName={"Map"}
                />
                <RoutStep
                    liCss={`flex items-center`}
                    divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-primary`}
                    iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
                    iconName={"CalendarEvent"}
                />
            </ol>
            <div className="container mx-auto mt-4 bg-white h-screen">

                <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />

                <div className="items-center justify-center mt-1 w-full">
                    <div className="w-full bg-white  text-black rounded-lg inline-flex items-center px-4 py-2.5 ">
                        <div className="flex justify-between w-full">
                            <div className="flex">
                                <div className="text-left place-items-start">
                                    <div className="mb-1 text-primary">{`Total Harga: Rp${(totalCartPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</div>
                                    <div className="-mt-1 font-sans text-xs text-gray-500">Jumlah Makanan :{totalCartQuantity}</div>
                                </div>
                            </div>
                            <div className="grid place-items-center">
                                <button onClick={handleLink} className="flex rounded-lg w-20 h-10 grid grid-cols-3 gap-4 content-center text-white bg-primary p-2 hover:shadow-lg"><IconCirclePlus />add </button>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="items-center justify-center mt-2 w-full">
                    <div className="items-center justify-center mt-2 w-full">

                        <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
                        {Object.keys(groupedCart).length > 0 ? (
                            Object.keys(groupedCart).map((IdMerchan, storeIndex) => (

                                <div key={storeIndex} className="mb-4 p-2">
                                    <h2 className="text-xl font-semibold my-2">ID :{IdMerchan}</h2>
                                    {groupedCart[IdMerchan].map((item, itemIndex) => (
                                        <div key={itemIndex} className="w-full bg-white text-black rounded-lg inline-flex items-center px-4 py-2.5 mb-2 w-full border border-red-1">
                                            <div className="flex justify-between w-full">
                                                <div className="flex">

                                                    <img className="w-10 h-10 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600" src={item.imageUrl} alt="" />


                                                    <div className="text-left place-items-start">
                                                        <div className="mb-1 text-primary">{item.name}</div>
                                                        <div className="mb-1 font-sans text-xs">{item.id} 1RB terjual | Disukai:20|Max qty:{item.capacity}</div>
                                                        <div className="mb-1 font-sans text-xs">{item.description}</div>
                                                        <p className="text-gray-600 mt-2">{`Harga: Rp${(item.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>
                                                        {/* <p className="text-gray-600 mt-2">{`Total: Rp${(item.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p> */}
                                                        {/* <p className="text-gray-700">{`Total: $${item.total.toFixed(2)}`}</p> */}
                                                    </div>

                                                </div>

                                                <div className="grid place-items-center">
                                                    <div className="flex items-center mt-2">
                                                        <button
                                                            className="bg-blue-500 text-white px-2 py-1 rounded-l hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                                                            onClick={() => handleDecrease(IdMerchan, item.id)}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-4">{item.quantity}</span>
                                                        <button
                                                            className="bg-blue-500 text-white px-2 py-1 rounded-r hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                                                            onClick={() => handleIncrease(IdMerchan, item.id)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-700">Your cart is empty.</p>
                        )}

                    </div>
                    <div className="grid gap-4 content-center">
                        <button onClick={handleSubmit}

                            className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                        >
                            Submit
                        </button>
                    </div>

                </div >
            </div>
        </>
    )
}

function Stepfour({ cart, setCart, setUploadedFile, uploadedFile }) {
    const [groupedFoods, setGroupedFoods] = useState({});
    const router = useRouter();
    const IdMerchan = router.query.id;
    const nameMerchant = router.query.name;
    console.log('router', router);
    const detonator_id = sessionStorage.getItem('id');
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        // Load cart data from local storage on component mount
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);

        // Fetch data from API
        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}merchant-product/filter?merchant_id=${IdMerchan}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                // Filter foods with status 'approved'
                const approvedFoods = response.data.body.filter(food => food.status === 'approved');

                // Group approved foods by store
                const groupedByMerchant = approvedFoods.reduce((acc, food) => {
                    const { merchant_id } = food;
                    if (!acc[merchant_id]) {
                        acc[merchant_id] = [];
                    }
                    acc[merchant_id].push(food);
                    return acc;
                }, {});
                setGroupedFoods(groupedByMerchant);
            })

            .catch((error) => {
                console.log(error);
            });
    }, [setCart]);

    const addToCart = (food) => {
        const existingItemIndex = cart.findIndex((item) => item.id === food.id);

        if (existingItemIndex !== -1) {
            const updatedCart = cart.map((item, index) =>
                index === existingItemIndex
                    ? { ...item, quantity: item.quantity + food.quantity, total: (item.quantity + food.quantity) * item.price }
                    : item
            );
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        } else {
            const updatedCart = [...cart, food];
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    const handleLink = () => {
        router.push('/creatcampaign?step=3');

    };

    // Calculate total price and total quantity
    const totalHarga = cart.reduce((acc, item) => acc + item.total, 0).toFixed(2);
    const jumlahMakanan = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="">
            <div className="items-center justify-center mt-1 w-full">
                <div className="w-full bg-white  text-black rounded-lg inline-flex items-center px-4 py-2.5 ">
                    <div className="flex justify-between w-full">
                        <div className="flex">
                            <div className="text-left place-items-start">
                                <div className="mb-1 text-primary">Total Harga: {totalHarga}</div>
                                <div className="-mt-1 font-sans text-xs text-gray-500">Jumlah Makanan: {jumlahMakanan}</div>
                            </div>
                        </div>
                        <div className="grid place-items-center">
                            <button onClick={handleLink} className="flex rounded-lg w-20 h-10 grid grid-cols-3 gap-4 content-center text-white bg-primary p-2 hover:shadow-lg"><IconGardenCart />Cart </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto mt-4 bg-white h-screen">

                <div className="items-center justify-center mt-2 w-full">
                    <div className="items-center justify-center mt-2 w-full">
                        {Object.keys(groupedFoods).map((IdMerchan) => (
                            <>
                                <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
                                <div key={IdMerchan} className="mb-4">
                                    <h2 className="text-xl font-bold">Store :{nameMerchant}</h2>
                                    {groupedFoods[IdMerchan].map((food) => (
                                        <AddFoodCamp key={groupedFoods.id} {...food} addToCart={addToCart} />
                                    ))}

                                </div>
                            </>))}
                    </div>


                </div >
            </div>
        </div>
    );
}

function Stepfive({ cart, setCart, setUploadedFile, uploadedFile, loading }) {
    const [groupedFoods, setGroupedFoods] = useState({});
    const router = useRouter();
    const [dataApi, setDataApi] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const detonator_id = sessionStorage.getItem('id');
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!detonator_id || !token) {
                    throw new Error('Missing required session data');
                }

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/filter`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const approvedMerchants = response.data.body.filter(merchant => merchant.status === 'approved');
                console.log('page creat camp data', approvedMerchants);
                setDataApi(approvedMerchants);
                setFilteredData(approvedMerchants);
                // setLoading(false);

            } catch (error) {
                console.log('error =', error);
            }
        };

        fetchData();
    }, [detonator_id]);


    const handleLink = () => {
        router.push('/creatcampaign?step=3');

    };

    // Calculate total price and total quantity
    const totalHarga = cart.reduce((acc, item) => acc + item.total, 0).toFixed(2);
    const jumlahMakanan = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (

        <div className="container mx-auto mt-4 bg-white h-screen">
            {/* <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" /> */}

            {/* <div className="items-center justify-center mt-2 w-full h-full ">
                {loading && <p>Loading...</p>}

                {dataApi.map((item) => (
                    <>
                        <CardListMerchan key={item.id} data={item} />
                    </>
                ))}

            </div> */}



            <div className="items-center justify-center mt-2 w-full">
                <div className="items-center justify-center mt-2 w-full">
                    {loading && <p>Loading...</p>}

                    {dataApi.map((item) => (
                        <>
                            <CardListMerchan key={item.id} data={item} />
                        </>
                    ))}

                </div>


            </div >
        </div>

    );
}

export { StepOne, StepTwo, StepThree, Stepfour, Stepfive };