// src/components/FormCampaing.jsx

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { StepOne, StepTwo, StepThree, Stepfour } from "@/components/FormCampaing/StepGantiMenu";
import Loading from "@/components/Loading";
import axios from "axios";
import Error401 from "@/components/error401";

const FormCampaing = () => {
    const router = useRouter();
    const { step } = router.query;
    const ord = router.query.ord;
    const id_camp = router.query.cmp;
    const [cart, setCart] = useState([]);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dataCamopaign, setDataCampaign] = useState(null);
    const [order_id, setOrder_id] = useState(null);
    const [totalRejected, setTotalRejected] = useState(0);
    const [RejectedQty, setRejectedQty] = useState(0);

    // useEffect(() => {
    //     const role = sessionStorage.getItem('role');
    //     const token = sessionStorage.getItem('token');
    //     const status = sessionStorage.getItem('status');
    //     const idDetonator = sessionStorage.getItem('id');

    //     if (!role || !token || role !== 'detonator' || status !== 'approved' || !idDetonator) {
    //         // Redirect to login if either role or token is missing or role is not 'detonator' or status is not 'approved'
    //         sessionStorage.clear();
    //         localStorage.removeItem('cart');
    //         localStorage.removeItem('formData');
    //         router.push('/login/detonator');
    //     } else {
    //         // Role is 'detonator' and token is present
    //         setLoading(false); // Set loading to false once the check is complete
    //     }
    // }, [router]);

    // Retrieve form data from local storage on component mount
    useEffect(() => {
        setOrder_id(ord);
        const token = sessionStorage.getItem('token');
        const response = axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/fetch/${id_camp}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setDataCampaign(response.data.body);
                const DataOrder = response.data.body.orders;
                const rejectedOrders = DataOrder.filter((order) => order.id === parseInt(ord));
                const totalRejectedAmount = rejectedOrders.reduce((total, item) => total + item.total_amount, 0);
                // console.log('Total jumlah total_amount dari order yang ditolak:', totalRejectedAmount);
                setTotalRejected(totalRejectedAmount);
                setRejectedQty(rejectedOrders[0].qty);
                console.log('jumlah qty rejected', RejectedQty);
                console.log('data Camp', response.data.body);
                console.log('data order rejected', rejectedOrders);
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    Error401(error, router);

                }
            })
    }, [id_camp]);
    useEffect(() => {
        const storedFormData = localStorage.getItem("formData");
        if (storedFormData) {
            console.log(JSON.parse(storedFormData));
        }
    }, []);

    useEffect(() => {
        console.log('router.query', router);
        console.log('id_camp', id_camp);
        // Membaca nilai dari localStorage setelah rendering pada sisi klien
        const cartData = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(cartData);
    }, []); // Empty dependency array ensures that this effect runs only once after the initial render

    const updateCart = (updatedCart) => {
        setCart(updatedCart);
        // Menyimpan data keranjang ke localStorage setelah diperbarui
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    let stepComponent;
    let setTitle;

    if (step === "1") {
        stepComponent = (
            <StepOne
                cart={cart}
                setCart={setCart}
                dataCamopaign={dataCamopaign}
                RejectedQty={RejectedQty}
                order_id={order_id}
                totalRejected={totalRejected}
                setUploadedFile={setUploadedFile}
                uploadedFile={uploadedFile}
                loading={loading}
                updateCart={updateCart}
                setLoading={setLoading}
            />
        );
        setTitle = "Tanggal Pelaksanaan";
    } else if (step === "2") {
        stepComponent = (
            <StepTwo

                cart={cart}
                setCart={setCart}
                dataCamopaign={dataCamopaign}
                order_id={order_id}
                setUploadedFile={setUploadedFile}
                uploadedFile={uploadedFile}
                loading={loading}
                setLoading={setLoading}
            />
        );
        setTitle = "Tambah Menu Makan";
    } else if (step === "3") {
        stepComponent = (
            <StepThree
                cart={cart}
                setCart={setCart}
                RejectedQty={RejectedQty}
                order_id={order_id}
                totalRejected={totalRejected}
                dataCamopaign={dataCamopaign}
                updateCart={updateCart}
                setUploadedFile={setUploadedFile}
                uploadedFile={uploadedFile}
                loading={loading}
                setLoading={setLoading}
            />
        );
        setTitle = "Tambah Menu Makan";
    } else if (step === "4") {
        stepComponent = (
            <Stepfour
                cart={cart}
                setCart={setCart}
                setUploadedFile={setUploadedFile}
                uploadedFile={uploadedFile}
                loading={loading}
                setLoading={setLoading}
            />
        );
        setTitle = "Tambah Menu Makan";
    } else if (step === "5") {
        stepComponent = (
            <Stepfive
                cart={cart}
                setCart={setCart}
                setUploadedFile={setUploadedFile}
                uploadedFile={uploadedFile}
                loading={loading}
                setLoading={setLoading}
            />
        );
        setTitle = "";
    } else {
        stepComponent = <div>Invalid step value</div>;
        setTitle = "Default Title";
    }

    // Update local storage when formData changes
    const updateLocalStorage = (data) => {
        localStorage.setItem("formData", JSON.stringify(data));
    };

    return (
        <div className="container mx-auto mt-16 bg-white h-full text-primary">
            {/* <div className="flex justify-center">
        <h1 className="text-3xl font-bold">FOODIA </h1>
      </div> */}
            <div className="flex justify-center mb-2">
                <h1 className="text-xl font-bold">{setTitle}</h1>
            </div>
            {/* <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" /> */}
            <div className="grid justify-items-center w-full h-full">
                {/* Pass the updateLocalStorage function to each step component */}
                {React.cloneElement(stepComponent, { updateLocalStorage })}
            </div>
            {loading && <Loading />}
        </div>
    );
};

export default FormCampaing;
