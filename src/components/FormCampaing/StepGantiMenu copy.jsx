// src/components/FormCampaing/Step.jsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "react-clock/dist/Clock.css";
import "react-time-picker/dist/TimePicker.css";
import RoutStep from "../RoutStep";

import {
    IconCirclePlus,
    IconCurrentLocation,
    IconGardenCart,
    IconMinus,
    IconPlus
} from "@tabler/icons-react";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import Swal from "sweetalert2";
import Market from "../../../public/img/illustration/market.png";
import Error401 from "../error401";
import CardListMerchan from "../page/Detonator/CardListMerchan";
import AddFoodCamp from "./AddFoodCamp";
import CardChangeMerchant from "../page/Detonator/CardChangeMerchant";
import ChangeFood from "./ChangeFood";
import { IconTrash } from "@tabler/icons-react";

const DynamicMap = dynamic(() => import("../page/GeoMap"), { ssr: false });

const Toast = Swal.mixin({
    toast: true,
    position: 'center',
    iconColor: 'white',
    customClass: {
        popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
})


function StepOne({ cart, setCart, updateCart, setUploadedFile, uploadedFile, loading, setLoading, dataCamopaign, order_id, totalRejected }) {
    const router = useRouter();

    const totalCartPrice = cart.reduce((total, item) => total + item.total, 0);
    const totalCartQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );
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

        const itemIndex = updatedCart.findIndex(
            (item) => item.merchant_id === parseInt(IdMerchan) && item.id === itemId
        );

        // console.log("IdMerchan:", IdMerchan);
        // console.log("itemId:", itemId);
        // console.log("Data updatedCart:", updatedCart);
        // console.log("itemIndex:", itemIndex);

        if (itemIndex !== -1) {
            const updatedItem = { ...updatedCart[itemIndex] };

            if (updatedItem.quantity > 1) {
                updatedItem.quantity -= 1;
                updatedItem.total = updatedItem.quantity * updatedItem.price;

                updatedCart[itemIndex] = updatedItem;

                const totalCartPrice = updatedCart.reduce(
                    (total, item) => total + item.total,
                    0
                );
                const totalCartQuantity = updatedCart.reduce(
                    (total, item) => total + item.quantity,
                    0
                );

                console.log("updatedCart after decrease:", updatedCart);

                updateCart(updatedCart, totalCartPrice, totalCartQuantity);
            } else {
                handleRemove(IdMerchan, itemId);
            }
        } else {
            console.warn("Item not found in cart:", { IdMerchan, itemId });
        }
    };

    const handleIncrease = (IdMerchan, itemId, capacity) => {
        const updatedCart = [...cart];
        const itemIndex = updatedCart.findIndex(
            (item) => item.merchant_id === parseInt(IdMerchan) && item.id === itemId
        );

        if (updatedCart[itemIndex].quantity >= capacity) {
            return;
        }
        if (itemIndex !== -1) {
            updatedCart[itemIndex].quantity += 1;
            updatedCart[itemIndex].total =
                updatedCart[itemIndex].quantity * updatedCart[itemIndex].price;

            const totalCartPrice = updatedCart.reduce(
                (total, item) => total + item.total,
                0
            );
            const totalCartQuantity = updatedCart.reduce(
                (total, item) => total + item.quantity,
                0
            );

            updateCart(updatedCart, totalCartPrice, totalCartQuantity);
        }
    };

    const handleRemove = (IdMerchan, itemId) => {
        const updatedCart = cart.filter(
            (item) =>
                !(item.merchant_id === parseInt(IdMerchan) && item.id === itemId)
        );
        const totalCartPrice = updatedCart.reduce(
            (total, item) => total + item.total,
            0
        );
        const totalCartQuantity = updatedCart.reduce(
            (total, item) => total + item.quantity,
            0
        );
        updateCart(updatedCart, totalCartPrice, totalCartQuantity);
    };

    const handleSubmit = () => {
        // console.log('total Rejected', totalRejected);
        console.log("data", cart);
        setLoading(true);
        const detonator_id = localStorage.getItem("id");
        const token = localStorage.getItem("token");
        const totalCartPrice = cart.reduce(
            (total, item) => total + item.total,
            0
        );
        const totalCartQuantity = cart.reduce(
            (total, item) => total + item.quantity,
            0
        );

        if (totalCartPrice < totalRejected || totalCartPrice === totalRejected) {
            const eventData = {
                order_id: parseInt(order_id),
                product: {
                    merchant_id: parseInt(cart[0].merchant_id),
                    merchant_product_id: parseInt(cart[0].id),
                    qty: 2
                },
            };
            console.log("eventData", eventData);
            const response = axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/change-menu`, eventData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then((response) => {
                    console.log("API Response:", response.data);
                    setLoading(false);
                    Swal.fire({
                        icon: "success",
                        title: "Menu Order Berhasil!",
                        text: "Menu Order Berhasil Di Ubah",
                        showConfirmButton: false,
                        timer: 2000,
                    });

                    setTimeout(() => {
                        localStorage.removeItem("cart");
                        setCart([]);
                        router.push(`/food/${dataCamopaign.id}`);
                    }, 2000);

                }).catch((error) => {
                    setLoading(false);
                    if (401 === error.response?.status) {
                        localStorage.removeItem("cart");
                        setCart([]);
                        Error401(error, router)

                    }
                })
        } else {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "Total Harga Melebihi Dosasi Target",
                showConfirmButton: true,
                confirmButtonText: "Tutup",
                confirmButtonColor: "red",
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem("cart");
                    setCart([]);
                    // router.push(`/detonator/ganti-menu?ord=${order_id}&cmp=${dataCamopaign.id}&step=3`);
                }
            });
        }
        return;



        // Retrieve formData from local storage
        // const totalCartPrice = cart.reduce(
        //     (total, item) => total + item.total,
        //     0
        // );

        // const products = cart.map((item) => ({
        //     merchant_id: parseInt(item.merchant_id),
        //     merchant_product_id: parseInt(item.id),
        //     qty: parseInt(item.quantity),
        // }));


        // return;


    };

    const handleLink = () => {
        router.push(`/detonator/ganti-menu?ord=${order_id}&cmp=${dataCamopaign.id}&step=2`);
        console.log("data card", cart);
    };
    const handleRemoveAll = () => {
        localStorage.removeItem("cart");
        setCart([]);
    }

    console.log('groupedCart add', groupedCart);

    // localStorage.removeItem('formData');
    // localStorage.removeItem('cart');

    return (
        <>
            <ol className="flex justify-center w-full p-2">
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
            <div className="container mx-auto">
                {/* <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" /> */}
                <div className="items-center justify-center mt-5 w-full">
                    <div className="w-full bg-white  text-black rounded-lg inline-flex items-center px-4 py-2.5 ">
                        <div
                            className={`flex ${Object.keys(groupedCart).length > 0
                                ? "justify-between"
                                : "justify-center"
                                } w-full`}
                        >
                            <div className="flex">
                                {Object.keys(groupedCart).length > 0 ? (
                                    <div className="text-left place-items-start">
                                        <div className="font-medium text-xs text-gray-500">
                                            Total {totalCartQuantity} Pesanan
                                        </div>
                                        <div className="text-primary font-bold text-lg">{`Rp ${totalCartPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}</div>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                            <div className="flex justify-center items-center content-center">
                                <button
                                    onClick={handleLink}
                                    type="submit"
                                    className="text-primary hover:text-white flex flex-row items-center gap-1 border-2 border-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-xl text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                                >
                                    <IconCirclePlus />
                                    Menu
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* <div className="items-center justify-center w-full"> */}
                <div className="items-center justify-center w-full">
                    {/* <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" /> */}
                    {Object.keys(groupedCart).length > 0
                        ? Object.keys(groupedCart).map((IdMerchan, storeIndex) => (
                            <div key={storeIndex} className="mb-4 p-2">
                                {/* <h2 className="text-xl font-semibold my-2">ID :{IdMerchan}</h2> */}
                                {groupedCart[IdMerchan].map((item, itemIndex) => (
                                    <div
                                        key={itemIndex}
                                        className="bg-white text-black rounded-lg inline-flex items-center px-2 py-2 mb-2 w-full border border-primary"
                                    >
                                        <div className="flex justify-between h-30 w-full ">
                                            <img
                                                className="w-28 h-28 rounded-xl bg-blue-100 mr-2 text-blue-600"
                                                src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${item.images.length > 0
                                                    ? item.images[0].image_url
                                                    : ""
                                                    }`}
                                                alt=""
                                            />
                                            <div className="flex flex-col justify-between w-full">
                                                <div className="text-left place-items-start">
                                                    <div className="text-primary font-bold capitalize">
                                                        {item.name}
                                                        {/* {item.imageUrl} */}
                                                    </div>
                                                    <div className="mb-1 font-sans text-[11px]">
                                                        {/* terjual | Disukai oleh: 20 | */}
                                                        Max Quota: {item.capacity}
                                                    </div>
                                                    <div className="mb-1 font-sans text-[11px]">
                                                        {item.description}
                                                    </div>
                                                    {/* <p className="text-gray-600 mt-2">{`Total: Rp${(item.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p> */}
                                                    {/* <p className="text-gray-700">{`Total: $${item.total.toFixed(2)}`}</p> */}
                                                </div>
                                                <div className="mt-2 flex flex-row gap-4 justify-between">
                                                    <p className="font-bold text-primary">{`Rp ${(
                                                        item.price * item.quantity
                                                    ).toLocaleString(undefined, {
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 0,
                                                    })}`}</p>
                                                    <div className="grid place-items-center">
                                                        <button onClick={handleRemoveAll} className="p-2 text-white hover:text-red-800 bg-red-500 rounded-lg"><IconTrash size={20} /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                        : ""}
                </div>
                {/* </div> */}

                {Object.keys(groupedCart).length > 0 ? (
                    <div className="grid gap-4 h-screencontent-center px-4">
                        <button
                            onClick={handleSubmit}
                            className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-xl text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                        >
                            Lanjut
                        </button>
                    </div>
                ) : (
                    ""
                )}
            </div>
        </>
    );
}

function StepTwo({ cart, setCart, setUploadedFile, uploadedFile, loading, dataCamopaign, order_id }) {
    const [groupedFoods, setGroupedFoods] = useState({});
    const router = useRouter();
    const [dataApi, setDataApi] = useState([]);
    const id_camp = dataCamopaign?.id;

    const detonator_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    // useEffect(() => {
    //     console.log('id order', id_order);
    //     console.log('data campaign stp2', dataCamopaign);
    //     // Check local storage for existing form data
    //     const storedFormData = localStorage.getItem("formData");
    //     if (storedFormData) {
    //         const parsedFormData = JSON.parse(storedFormData);
    //         if (parsedFormData) {
    //             // Merge the existing data with the new data
    //             setLocation(parsedFormData.location || "");
    //         }
    //     }
    // }, []);




    useEffect(() => {
        const response = axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/filter?per_page=100000`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        )
            .then((response) => {
                const approvedMerchants = response.data.body.filter(
                    (merchant) => {
                        return merchant.status === "approved" && merchant.products.some(product => product.status === "approved");
                    }
                );
                console.log("page creat camp data", approvedMerchants);
                setDataApi(approvedMerchants);
                setFilteredData(approvedMerchants);
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    Error401(error, router);
                }
            })
    }, [detonator_id, token]);

    const handleLink = () => {
        router.push("/detonator/ganti-menu?step=3");
    };

    // Calculate total price and total quantity
    const totalHarga = cart.reduce((acc, item) => acc + item.total, 0).toFixed(2);
    const jumlahMakanan = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="container mx-auto px-4 bg-white">
            {/* <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" /> */}

            {/* <div className="items-center justify-center mt-2 w-full h-full ">
        {loading && <p>Loading...</p>}

        {dataApi.map((item) => (
          <>
            <CardListMerchan key={item.id} data={item} />
          </>
        ))}
      </div> */}
            <p className="text-black font-light text-xs mb-5 flex flex-row items-center justify-center gap-1">
                <IconCurrentLocation color="red" />
                {/* {location} */}
            </p>
            <div className="flex justify-center">
                <Image src={Market} />
            </div>
            <p className="py-2 pb-7 text-gray-700 font-medium text-xl">
                Merchant Terdekat
            </p>

            <div className="items-center justify-center w-full">
                <div className="items-center justify-center w-full">
                    {loading && <p>Loading...</p>}

                    {dataApi.map((item) => (
                        <>
                            <CardChangeMerchant key={item.id} data={item} order_id={order_id} id_camp={id_camp} />
                        </>
                    ))}
                </div>
            </div>
        </div>
    );
}
function StepThree({ cart, setCart, setUploadedFile, uploadedFile, dataCamopaign, order_id, totalRejected, RejectedQty }) {
    const [groupedFoods, setGroupedFoods] = useState({});
    const router = useRouter();
    const IdMerchan = router.query.id;
    const nameMerchant = router.query.name;
    console.log("router", router);
    const [HargaTotal, setHargaTotal] = useState(0);
    const detonator_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const maxNominal = totalRejected.toFixed(0);
    const totalHarga = cart.reduce((acc, item) => acc + item.total, 0).toFixed(0);
    const jumlahMakanan = cart.reduce((acc, item) => acc + item.quantity, 0);

    // const id_order = localStorage.getItem("id_order");
    useEffect(() => {
        console.log('data campaign stp3', dataCamopaign);
        console.log("id order", order_id);
        setHargaTotal(cart.reduce((acc, item) => acc + item.total, 0));
    }, [cart]);

    useEffect(() => {

        // Load cart data from local storage on component mount
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);

        // Fetch data from API
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant-product/filter?merchant_id=${IdMerchan}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                // Filter foods with status 'approved'
                const approvedFoods = response.data.body.filter(
                    (food) => food.status === "approved"
                );

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
                if (error.response && error.response.status === 401) {
                    Error401(error, router);
                }
                console.log(error);
            });
    }, [setCart]);

    const addToCart = (food) => {
        const existingItemIndex = cart.findIndex((item) => item.id === food.id);

        if (existingItemIndex !== -1) {
            const updatedCart = cart.map((item, index) =>
                index === existingItemIndex
                    ? {
                        ...item,
                        quantity: item.quantity + food.quantity,
                        total: (item.quantity + food.quantity) * item.price,
                        capacity: food.qty,

                    }
                    : item
            );
            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
        } else {
            const updatedCart = [...cart, food];
            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
        }
    };

    const handleLink = () => {
        // const totalHarga = cart.reduce((acc, item) => acc + item.total, 0);

        if (jumlahMakanan < RejectedQty || jumlahMakanan === RejectedQty) {
            // router.push("/detonator/ganti-menu?step=1");
            router.push(`/detonator/ganti-menu?ord=${order_id}&cmp=${dataCamopaign.id}&step=1`);
        } else {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "Total Harga Melebihi Dosasi Target",
                showConfirmButton: true,
                confirmButtonText: "Tutup",
                confirmButtonColor: "red",
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem("cart");
                    setCart([]);
                    // router.push(`/detonator/ganti-menu?ord=${order_id}&cmp=${dataCamopaign.id}&step=3`);
                }
            });
        }
    };

    const formatToRupiah = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(amount);
    };

    // console.log('groupedFoods', groupedFoods);
    // Calculate total price and total quantity


    return (
        <div className="w-full">
            <div className="items-center justify-center mt-1 w-full">
                <div className="w-full bg-white  text-black rounded-lg inline-flex items-center px-4 py-2.5 ">
                    <div className="flex justify-between w-full">
                        <div className="flex">
                            <div className="text-left place-items-start">
                                <div className="mb-1 text-primary">
                                    Total Harga: {`Rp ${parseInt(HargaTotal).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}

                                </div>
                                <div className="-mt-1 font-sans text-xs text-gray-500">
                                    Jumlah Makanan: {jumlahMakanan}
                                </div>
                                <div className="-mt-1 font-sans text-xs text-black">
                                    {/* Max Nomilan: {`Rp ${parseInt(totalRejected).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} */}
                                    Max Jumlah Menu: {RejectedQty}
                                </div>
                            </div>
                        </div>
                        <div className="grid place-items-center">
                            <button
                                onClick={handleLink}
                                className="flex rounded-lg w-20 h-10 grid grid-cols-3 gap-4 content-center text-white bg-primary p-2 hover:shadow-lg"
                            >
                                <IconGardenCart />
                                Cart{" "}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto mt-4 bg-white h-screen">
                <div className="items-center justify-center mt-2 w-full">
                    <div className="items-center justify-center mt-2 w-full px-2">
                        {Object.keys(groupedFoods).map((IdMerchan) => (
                            <>
                                <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
                                <div key={IdMerchan} className="mb-4">
                                    <h2 className="text-xl font-bold">Store :{nameMerchant}</h2>
                                    {groupedFoods[IdMerchan].map((food) => (
                                        <ChangeFood
                                            key={groupedFoods.id}
                                            {...food}
                                            jumlahMakanan={jumlahMakanan}
                                            RejectedQty={RejectedQty}
                                            totalAmount={totalHarga}
                                            totalAmountRejected={totalRejected}
                                            addToCart={addToCart}
                                        />
                                    ))}
                                </div>
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export { StepOne, StepTwo, StepThree };

