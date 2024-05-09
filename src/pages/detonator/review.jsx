import BottomNav from "@/components/BottomNav";
import CardCampaign from "@/components/CardCampaign";
import CardReview from "@/components/CardReview";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import MenuDetonator from "@/components/page/Detonator/MenuDetonator";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const review = (review) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [dataApi, setDataApi] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("KirimUlasan");
    const [menu, setMenu] = useState("review-list");
    const [jumlah, setJumlah] = useState();

    useEffect(() => {
        const authenticateUser = async () => {
            // const role = localStorage.getItem('role');
            const token = localStorage.getItem("token");
            // const status = localStorage.getItem('status');
            // const id = localStorage.getItem('id');
            // console.log("token", token);
            if (!token) {
                Swal.fire({
                    icon: "error",
                    title: "Akses Dibatasi",
                    text: ` Mohon untuk login kembali menggunakan akun Detonator.`,
                    showConfirmButton: true,
                    confirmButtonText: "Login",
                    confirmButtonColor: "green",
                    showCancelButton: true,
                    cancelButtonText: "Tutup",
                    cancelButtonColor: "red",
                    // timer: 2000,
                }).then((result) => {
                    if (result.isConfirmed) {
                        // console.log("clicked");
                        setLoading(true);
                        router.push("/login");
                    } else if (result.isDismissed) {
                        // console.log("denied");
                        router.push("/home");
                    }
                });
            } else {
                try {
                    const response = await axios.get(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/check-register-status`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    const cekData = response.data.body;
                    console.log("cekData", cekData);

                    if (!cekData.detonator) {
                        // console.log('/register/detonator');
                        Swal.fire({
                            icon: "warning",
                            title: "Akun Belum Terdaftar sebagai Detonator",
                            text: `Mohon untuk registrasi sebagai Detonator.`,
                            showConfirmButton: true,
                            confirmButtonColor: "green",
                            confirmButtonText: "Registrasi",
                            showCancelButton: true,
                            cancelButtonColor: "red",
                            cancelButtonText: "Tutup",
                            // timer: 2000,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // console.log("clicked");
                                router.push("/detonator/syarat");
                            } else if (result.isDismissed) {
                                // console.log("denied");
                                router.push("/home");
                            }
                        });
                        // setTimeout(() => {
                        //   router.push("/registrasi/detonator?step=1");
                        // }, 2000);
                    } else {
                        if (cekData.detonator.status == "waiting") {
                            localStorage.setItem("id", cekData.detonator.detonator_id);
                            localStorage.setItem("role", "detonator");
                            localStorage.setItem("status", cekData.detonator.status);
                            localStorage.setItem("note", cekData.detonator.note);
                            //       localStorage.setItem("id", responeData.id || " ");
                            // localStorage.setItem("status", responeData.status || " ");
                            // localStorage.setItem("note", responeData.note || " ");

                            Swal.fire({
                                icon: "warning",
                                title: "Detonator Belum Terverifikasi",
                                text: ` Mohon tunggu konfirmasi dari admin kami.`,
                                showConfirmButton: false,
                                timer: 2000,
                            });
                            setTimeout(() => {
                                router.push("/home");
                            }, 2000);
                        } else if (cekData.detonator.status == "rejected") {
                            setLoading(false);
                            localStorage.setItem("id", cekData.detonator.detonator_id);
                            localStorage.setItem("role", "detonator");
                            localStorage.setItem("status", cekData.detonator.status);
                            localStorage.setItem("note", cekData.detonator.note);
                            Swal.fire({
                                icon: "warning",
                                title: "Detonator Ditolak",
                                text: `${cekData.detonator.note}`,
                                showConfirmButton: false,
                                timer: 2000,
                            });
                            setTimeout(() => {
                                router.push("/detonator/edit");
                            }, 2000);
                        } else {
                            localStorage.setItem("id", cekData.detonator.detonator_id);
                            localStorage.setItem("role", "detonator");
                            localStorage.setItem("status", cekData.detonator.status);
                            localStorage.setItem("note", cekData.detonator.note);
                        }
                    }
                    console.log("data", cekData);
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        Error401(error, router);
                        // localStorage.clear();
                        // localStorage.removeItem("cart");
                        // localStorage.removeItem("formData");
                        // router.push("/login");
                    }
                }
            }
        };

        authenticateUser();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        // let filtered = [];
        axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}rating/not-reviewed?type=detonator&id=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                // setSelectedStatus()
                setDataApi(res.data.body);
                setJumlah(res.data.body.length);
                // setFilteredData(res.data.body);
                setLoading(false);
                console.log("review", res.data.body);
            }).catch((error) => {
                Error401(error, router);
            })
    }, [selectedStatus, loading]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        console.log("selected status", selectedStatus);
        if (selectedStatus == "KirimUlasan") {
            setLoading(false)
            setFilteredData(dataApi);
            setJumlah(dataApi.length);



        } else if (selectedStatus == "UlasanSelesai") {
            setLoading(true);
            axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}rating/filter?relation_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {

                    setFilteredData(res.data.body);
                    setLoading(false);
                    console.log("review ulasan", res.data.body);
                }).catch((error) => {
                    setLoading(false);
                    Error401(error, router);
                })
        }

        console.log("filter data", filteredData);
        setLoading(false);
    }, [dataApi, selectedStatus]);

    const handleFilterChange = (status) => {
        setLoading(true);
        setSelectedStatus(status);
        if (status === "KirimUlasan") {
            console.log(status);
            // setLoading(false);
        } else if (status === "UlasanSelesai") {
            console.log(status);
            // setLoading(false);
        }

        // setFilteredData(filtered);
    };
    // console.log('filtered', filteredData);
    // console.log('id_campaign', dataFilter.campaign_id);

    return (
        <>
            <div className="container mx-auto h-screen max-w-480 bg-white flex flex-col">
                <Header title="Volunteer" backto="/home" />
                <div className="bg-white h-screen pt-10">
                    <div className="flex items-center justify-center px-6 my-2">
                        <MenuDetonator />
                    </div>

                    <div className="flex flex-row px-6 py-4 justify-between items-end">
                        <div
                            className={`cursor-pointer text-center w-full pb-2 ${selectedStatus === "KirimUlasan"
                                ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                                : "text-gray-400 font-bold"
                                }`}
                            onClick={() => handleFilterChange("KirimUlasan")}
                        >
                            <div className="flex items-center justify-center">

                                <p>Kasih Ulasan</p>
                                <div className="h-[16px] w-[16px] bg-red-500 rounded-full flex justify-center items-center text-[8px] font-bold text-white">
                                    <span>{loading ? '...' : jumlah}</span>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`cursor-pointer text-center w-full pb-2 ${selectedStatus === "UlasanSelesai"
                                ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                                : "text-gray-400 font-bold"
                                }`}
                            onClick={() => handleFilterChange("UlasanSelesai")}
                        >
                            <p>Ulasan Selesai</p>
                        </div>
                    </div>
                    {loading ? (
                        <div className={`${styles.card}`}>
                            {[...Array(4)].map((_, index) => (
                                <div key={index} className={`${styles.loadingCard}`}>
                                    <div className={`${styles.shimmer}`}></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={`${styles.card}`}>

                            {selectedStatus === "KirimUlasan" ? (
                                <>
                                    {filteredData.map((dataFilter) => (
                                        <CardReview
                                            key={dataFilter.id}
                                            to={`/detonator/rating/${dataFilter?.order_id}?id_mrc=${dataFilter.merchant_id}&id_camp=${dataFilter.campaign_id}`}
                                            img={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataFilter?.event_image}`}
                                            title={dataFilter?.event_name}
                                            description={"sfsfsf"}
                                            date={"sfsfs"}
                                            address={`${dataFilter?.event_address}`}
                                            rating={true}
                                        />
                                    ))}
                                </>
                            ) : selectedStatus === "UlasanSelesai" && filteredData.length > 0 ? (
                                <>
                                    {filteredData.map((dataFilter) => (
                                        <CardReview
                                            key={dataFilter.id}
                                            to={``}
                                            img={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataFilter.order?.campaign?.image_url}`}
                                            title={dataFilter?.order?.campaign?.event_name}
                                            description={"sfsfsf"}
                                            date={dataFilter.order?.campaign.event_date}
                                            time={dataFilter.order?.campaign.event_time}
                                            address={`${dataFilter.order?.campaign?.address}`}
                                            rating={true}
                                            qty={dataFilter.order?.qty}
                                            harga={dataFilter.order?.merchant_product?.price}
                                            status={'Completed'}
                                            TotalHarga={dataFilter.order?.total_amount}
                                            nameProduct={dataFilter.order?.merchant_product?.name}
                                        />
                                    ))}
                                </>
                            ) : null}

                        </div>
                    )}
                    {loading && <Loading />}
                </div>
            </div>
            <BottomNav />
        </>
    );
}

export default review;
