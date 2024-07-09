import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/Loading";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Error401 from "@/components/error401";
import { IconMapPin } from "@tabler/icons-react";
import Swal from "sweetalert2";

const LokasiMerchant = dynamic(() => import("./LokasiMerchant"), { ssr: false });

const Toast = Swal.mixin({
    toast: true,
    position: "center",
    iconColor: "white",
    customClass: {
        popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
});

function StepOne({ DataOrder, setDataOrder, loading, setLoading }) {
    const router = useRouter();
    const { step } = router.query;
    const [ListMerchant, setListMerchant] = useState([]);
    const [token] = useState(localStorage.getItem("token"));
    const [myLocation, setMyLocation] = useState(null);

    useEffect(() => {
        getMerchant();
    }, [token]);

    useEffect(() => {
        if (myLocation) {
            sortMerchantsByDistance();
        }
    }, [myLocation]);

    const getMerchant = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/filter?per_page=100000`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setListMerchant(response.data.body);
            } else {
                Error401(response, router);
            }
        } catch (error) {
            console.error("Error fetching merchants:", error);
        }
    };

    const getMylocation = (location) => {
        const coordinates = {
            latitude: location[0],
            longitude: location[1],
        };
        setMyLocation(coordinates);
    };

    const handleSubmit = async (merchantId) => {

        setLoading(true);
        if (!myLocation) {
            Toast.fire({
                icon: "error",
                title: "Lokasi Belum Tersedia",
            });
            setLoading(false);
            return;
        }

        const updatedDataOrder = {
            ...DataOrder,
            myLocation,
            merchantId: merchantId,
        };

        try {
            await setDataOrder(updatedDataOrder);
            setLoading(false);
            router.push("/beneficiaries/order-merchant?step=2");
        } catch (error) {
            console.error("Error updating DataOrder:", error);
            setLoading(false);
        }
    };

    const haversineDistance = (coords1, coords2) => {
        const toRad = (x) => (x * Math.PI) / 180;
        const R = 6371000; // Earth radius in meters

        const dLat = toRad(coords2.latitude - coords1.latitude);
        const dLon = toRad(coords2.longitude - coords1.longitude);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(coords1.latitude)) * Math.cos(toRad(coords2.latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in meters
    };

    const sortMerchantsByDistance = () => {
        const sortedMerchants = [...ListMerchant].sort((a, b) => {
            const distanceA = haversineDistance(myLocation, { latitude: a.latitude, longitude: a.longitude });
            const distanceB = haversineDistance(myLocation, { latitude: b.latitude, longitude: b.longitude });

            return distanceA - distanceB; // Mengurutkan dari yang terdekat ke yang terjauh
        });
        setListMerchant(sortedMerchants);
    };

    return (
        <div className="p-2 mt-2 w-full px-5 space-y-3">
            <div className="grid gap-4 content-center">
                {!ListMerchant.length ? (
                    <Loading />
                ) : (
                    <div>
                        <h1>Map with Markers</h1>
                        <LokasiMerchant getMylocation={getMylocation} zoom={11} merchants={ListMerchant} DataOrder={DataOrder} setDataOrder={setDataOrder} loading={loading} setLoading={setLoading} />
                    </div>
                )}
                <div className="text-black font-medium">
                    <h1 className="text-[18px] font-semibold">Merchant Terdekat</h1>
                    <p className="text-[14px]">{'Jarak < 1 km'}</p>
                </div>

                {ListMerchant.length ? (
                    ListMerchant
                        .filter((merchant) => merchant.products.length > 0)
                        .map((merchant) => {
                            const distance = myLocation ? haversineDistance(myLocation, { latitude: merchant.latitude, longitude: merchant.longitude }) : null;
                            return (
                                <div key={merchant.id} onClick={() => handleSubmit(merchant.id)} className="flex items-center px-[10px] w-full h-28 mx-auto bg-white rounded-xl cursor-pointer shadow-md overflow-hidden border border-green-500">
                                    <div className="flex justify-between">
                                        <div className="flex-shrink-0 h-[90px]">
                                            <div className="h-full w-28 object-cover bg-blue-500 rounded-lg"></div>
                                        </div>
                                        <div className="px-4 h-[90px] w-[208px]">
                                            <div className="uppercase tracking-wide text-[14px] text-primary font-bold overflow-hidden line-clamp-2">
                                                {merchant.merchant_name}
                                            </div>
                                            <p className="mt-0 text-[8px] text-gray-500">
                                                Jarak: {distance !== null ? (distance < 1000 ? `${distance.toFixed(2)} m` : `${(distance / 1000).toFixed(2)} km`) : 'Calculating...'}
                                            </p>
                                            <p className="mt-2 text-[8px] text-gray-500 overflow-hidden line-clamp-4">
                                                {merchant.products[0].description}
                                            </p>
                                        </div>


                                    </div>
                                </div>
                            );
                        })
                ) : (
                    <Loading />
                )}
            </div>
        </div>
    );
}

function StepTwo({ DataOrder, setDataOrder, loading, setLoading }) {
    const router = useRouter();

    useEffect(() => {
        if (DataOrder.merchantId) {
            getMerchants();
        } else {
            router.push('/beneficiaries/order-merchant?step=1');
        }
    }, [DataOrder.merchantId]); // Menambahkan DataOrder.merchantId sebagai dependency useEffect

    const getMerchants = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/fetch/${DataOrder.merchantId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                console.log('data merchant', response.data.body);
                setDataOrder({ ...DataOrder, merchant: response.data.body });
            } else {
                Error401(response, router);
            }
        } catch (error) {
            console.error('Error fetching merchants:', error);
        } finally {
            setLoading(false); // Menandakan proses loading selesai
        }
    };

    const CreatOrde = async (id_product) => {
        try {
            setLoading(true);
            const order = {
                id_product: id_product,
            };

            await setDataOrder({ ...DataOrder, order: order });

            Swal.fire({
                title: 'Konfirmasi Pilihan Menu',
                html: `
                    <div class="text-center">
                        <img src="/img/illustration/order.png" alt="Confirmation" class="w-40 h-40 mx-auto mb-5" />
                        <p class="text-center text-gray-700">Apakah pilihan menu untuk penukaran kupon makan gratis sudah benar?</p>
                    </div>
                `,
                width: 300,
                heightAuto: false,
                padding: '20px',
                showConfirmButton: true,
                confirmButtonText: '<span class="text-white font-semibold">Sudah</span>', // Menggunakan Tailwind CSS classes untuk styling
                showCancelButton: true,
                cancelButtonText: '<span class="text-white font-semibold">Belum</span>', // Menggunakan Tailwind CSS classes untuk styling
                confirmButtonColor: '#a4d188', // Warna latar belakang tombol konfirmasi
                cancelButtonColor: '#f0625d', // Warna latar belakang tombol batal
                customClass: {
                    title: 'text-primary text-lg',
                    content: 'text-gray-700',
                    // confirmButton: 'bg-primary hover:bg-green-600 border-green-500', // Tailwind CSS classes untuk tombol konfirmasi
                    // cancelButton: 'bg-red-500 hover:bg-red-600 border-red-500', // Tailwind CSS classes untuk tombol batal
                },
                showClass: {
                    popup: 'animate__animated animate__fadeInUp animate__faster',
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutDown animate__faster',
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    const urlPrev = localStorage.setItem('prevUrl', '/beneficiaries');
                    router.push(`/beneficiaries/qr-kupon/${id_product}`);
                }
            });

            setLoading(false);
        } catch (error) {
            console.error("Error updating DataOrder:", error);
            setLoading(false);
        }
    };



    // Fungsi untuk menghitung jarak antara dua titik berdasarkan koordinat geografis
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (x) => (x * Math.PI) / 180;
        const R = 6371000; // Earth radius in meters

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in meters

        return distance;
    };
    // Fungsi untuk menampilkan jarak dalam format yang diinginkan
    const displayDistance = () => {
        if (DataOrder.myLocation && DataOrder.myLocation.latitude &&
            DataOrder.myLocation.longitude && DataOrder.merchant &&
            DataOrder.merchant.latitude && DataOrder.merchant.longitude) {
            const distance = calculateDistance(DataOrder.myLocation.latitude, DataOrder.myLocation.longitude, DataOrder.merchant.latitude, DataOrder.merchant.longitude);
            if (distance < 1000) {
                return `${distance.toFixed(0)} m`; // Tampilkan dalam meter
            } else {
                return `${(distance / 1000).toFixed(2)} km`; // Konversi ke kilometer dengan 2 desimal
            }
        } else {
            return 'Loading...'; // Saat data lokasi atau merchant sedang dimuat
        }
    };

    return (
        <>
            <div className="flex justify-between items-center w-full px-[16px]">
                <h1 className="text-[14px] font-semibold text-black">
                    {`${DataOrder.merchant ? DataOrder.merchant.merchant_name : 'Loading...'} (${displayDistance()})`}
                </h1>
                <IconMapPin color="red" />
            </div>
            <div className="p-2 mt-2 w-full px-5 space-y-3">
                <div className="grid gap-4 content-center">
                    {loading ? (
                        <Loading />
                    ) : (
                        <div className="space-y-4">
                            {DataOrder.merchant && DataOrder.merchant.products.length > 0 ? (
                                DataOrder.merchant.products.map((product) => (
                                    <div key={product.id} onClick={() => CreatOrde(product.id)} className="flex items-center px-[10px] w-full h-28 mx-auto cursor-pointer bg-white rounded-xl shadow-md overflow-hidden border border-green-500">
                                        <div className="flex justify-between w-full">
                                            <div className="flex-shrink-0 h-[90px]">
                                                <div className="h-full w-28 object-cover bg-blue-500 rounded-lg"></div>
                                            </div>
                                            <div className="px-4 h-[90px] w-[208px]">
                                                <div>
                                                    <div className="uppercase tracking-wide text-[14px] text-primary font-bold overflow-hidden line-clamp-2">
                                                        {product.name}
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-[8px] italic text-gray-500 overflow-hidden line-clamp-5">
                                                    {product.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500">No merchant products available</div> // Pesan jika tidak ada produk
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default StepTwo;


export { StepOne, StepTwo };
