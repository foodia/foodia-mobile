// src/components/page/FormDetonator.jsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { StepOne, StepTwo, StepThree } from '@/components/FormCampaing/StepDetonator';

const FormDetonator = () => {
    const router = useRouter();
    const { step } = router.query;
    const [stepNumber, setStepNumber] = useState(1);
    const [registrasiDetonator, setRegistrasiDetonator] = useState(null);

    useEffect(() => {
        setStepNumber(parseInt(step) || 1);
    }, [router.query.step]);

    useEffect(() => {
        console.log('Registrasi Detonator:', registrasiDetonator);
    }, [registrasiDetonator]);

    let stepComponent;
    let setTitle;

    switch (stepNumber) {
        case 1:
            stepComponent = <StepOne setRegistrasiDetonator={setRegistrasiDetonator} registrasiDetonator={registrasiDetonator} />;
            setTitle = 'Register Detonator';
            break;
        case 2:
            stepComponent = <StepTwo setRegistrasiDetonator={setRegistrasiDetonator} registrasiDetonator={registrasiDetonator} />;
            setTitle = 'Identifikasi Pribadi';
            break;
        case 3:
            stepComponent = <StepThree setRegistrasiDetonator={setRegistrasiDetonator} registrasiDetonator={registrasiDetonator} />;
            setTitle = 'Konfirmasi OTP';
            break;
        // Add cases for other steps if needed
        default:
            stepComponent = <div>Invalid step value</div>;
            setTitle = 'Default Title';
            break;
    }
    // console.log('Combined Data:', registrasiDetonator);

    return (
        <div className="container mx-auto mt-24 bg-white h-screen text-primary">
            {/* ... (your existing code) */}
            <div className="grid justify-items-center w-full">
                {stepComponent}
            </div>
        </div>
    );
};

export default FormDetonator;
