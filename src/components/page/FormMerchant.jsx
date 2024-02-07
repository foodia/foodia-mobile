// src/components/FormCampaing.jsx

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AddFood from './AddFoodCamp';
import { StepOne, StepThree, StepTwo, Stepfour } from '../FormCampaing/StepMerchant';
// import StepThree from '../FormCampaing/CreateCamp';


const FormMenu = () => {
    const router = useRouter();
    const { step } = router.query;
    const [cart, setCart] = useState([]);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [registrasiMerchant, setRegistrasiMerchant] = useState(null)
    const [loading, setLoading] = useState(false); // Add loading state

    // Retrieve form data from local storage on component mount
    useEffect(() => {
        const storedFormData = localStorage.getItem('formData');
        if (storedFormData) {
            console.log(JSON.parse(storedFormData));
        }
    }, []);


    useEffect(() => {
        // Membaca nilai dari localStorage setelah rendering pada sisi klien
        const cartData = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(cartData);
    }, []); // Empty dependency array ensures that this effect runs only once after the initial render

    const updateCart = (updatedCart) => {
        setCart(updatedCart);
        // Menyimpan data keranjang ke localStorage setelah diperbarui
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    let stepComponent;
    let setTitle;

    if (step === '1') {
        stepComponent = <StepOne registrasiMerchant={registrasiMerchant} setRegistrasiMerchant={setRegistrasiMerchant} />;
        setTitle = 'Tanggal Pelaksanaan';
    } else if (step === '2') {
        stepComponent = <StepTwo registrasiMerchant={registrasiMerchant} setRegistrasiMerchant={setRegistrasiMerchant} />;
        setTitle = 'Lokasi Pelaksanaan';
    } else if (step === '3') {
        stepComponent = <StepThree registrasiMerchant={registrasiMerchant} setRegistrasiMerchant={setRegistrasiMerchant} />;
        setTitle = 'Tambah Menu Makan';
    } else if (step === '4') {
        stepComponent = <Stepfour registrasiMerchant={registrasiMerchant} setRegistrasiMerchant={setRegistrasiMerchant} />;
        setTitle = 'Tambah Menu Makan';
    } else {
        stepComponent = <div>Invalid step value</div>;
        setTitle = 'Default Title';
    }

    // Update local storage when formData changes
    const updateLocalStorage = (data) => {
        localStorage.setItem('formData', JSON.stringify(data));
    };

    return (
        <div className="container mx-auto mt-24 bg-white h-full text-primary">
            <div className="flex justify-center">
                <h1 className='text-3xl font-bold'>FOODIA </h1>
            </div>
            <div className="flex justify-center">
                <h1 className='text-xl font-bold'>{setTitle}</h1>
            </div>
            <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
            <div className="grid justify-items-center w-full h-">
                {/* Pass the updateLocalStorage function to each step component */}
                {React.cloneElement(stepComponent, { updateLocalStorage })}
            </div>
        </div>
    );
}

export default FormMenu;