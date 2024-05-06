import { Inter } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import Merchant from "@/components/page/Merchant";
import Header from "@/components/Header";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IconBowlFilled, IconCheck, IconCirclePlus, IconSoup } from "@tabler/icons-react";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import axios from "axios";
import Error401 from "@/components/error401";
import Swal from "sweetalert2";
import CardReview from "@/components/CardReview";
import CardCampaign from "@/components/CardCampaign";

const inter = Inter({ subsets: ["latin"] });

export default function PageMerchant() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [dataApi, setDataApi] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("KirimUlasan");
    // const [cekData, setCekData] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                icon: "error",
                title: "Akses Dibatasi",
                text: ` Mohon untuk login kembali menggunakan akun Merchant.`,
                showConfirmButton: true,
                confirmButtonText: "Login",
                confirmButtonColor: "green",
                showCancelButton: true,
                cancelButtonText: "Tutup",
                cancelButtonColor: "red",
                // timer: 2000,
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/login");
                } else if (result.isDismissed) {
                    router.push("/home");
                }
            });
        } else {
            axios
                .get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/check-register-status`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then((response) => {
                    const cekData = response.data.body;
                    if (!cekData.merchant) {
                        Swal.fire({
                            icon: "warning",
                            title: "Akun Belum Terdaftar sebagai Merchant",
                            text: "Mohon untuk registrasi sebagai Merchant",
                            showConfirmButton: true,
                            confirmButtonColor: "green",
                            confirmButtonText: "Registrasi",
                            showCancelButton: true,
                            cancelButtonColor: "red",
                            cancelButtonText: "Tutup",
                            // timer: 2000,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                router.push("/merchant/syarat");
                            } else if (result.isDismissed) {
                                router.push("/home");
                            }
                        });
                    } else {
                        if (cekData.merchant.status == "waiting") {
                            localStorage.setItem("id", cekData.merchant.merchant_id);
                            localStorage.setItem("role", "merchant");
                            localStorage.setItem("status", cekData.merchant.status);
                            localStorage.setItem("note", cekData.merchant.note);

                            Swal.fire({
                                icon: "warning",
                                title: "Akun Merchant Anda Belum Terverifikasi",
                                text: ` Mohon tunggu konfirmasi dari admin kami`,
                                showConfirmButton: false,
                                showCancelButton: true,
                                cancelButtonColor: "red",
                                cancelButtonText: "Tutup",
                            }).then((result) => {
                                if (result.isDismissed) {
                                    router.push("/home");
                                }
                            });
                        } else if (cekData.merchant.status == "rejected") {
                            setLoading(false);
                            localStorage.setItem("id", cekData.merchant.merchant_id);
                            localStorage.setItem("role", "merchant");
                            localStorage.setItem("status", cekData.merchant.status);
                            localStorage.setItem("note", cekData.merchant.note);
                            Swal.fire({
                                icon: "warning",
                                title: "Merchant Ditolak",
                                text: `${cekData.merchant.note}`,
                                showConfirmButton: false,
                                timer: 2000,
                            });
                            setTimeout(() => {
                                router.push("/merchant/edit");
                            }, 2000);
                        } else {
                            localStorage.setItem("id", cekData.merchant.merchant_id);
                            localStorage.setItem("role", "merchant");
                            localStorage.setItem("status", cekData.merchant.status);
                            localStorage.setItem("note", cekData.merchant.note);
                            getReviwe(cekData.merchant.merchant_id, token);
                        }
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.status === 401) {
                        Error401(error, router);
                    }
                });
        }
    }, []);

    const getReviwe = (id, token) => {
        console.log('id', id);
        axios
            .get(
                process.env.NEXT_PUBLIC_API_BASE_URL + `rating/not-reviewed?type=merchant&id=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                setDataApi(response.data.body);
                console.log("respone data menu", response.data.body);
                // const filtered = response.data.body.filter(
                //     (data) => data.is_rating === false && data.approval_status === "approved"
                // )
                // setFilteredData(filtered);
                setFilteredData(response.data.body);
                console.log("filtered data", filtered);
                setLoading(false);

                if (response.data.body.length === 0) {
                    setHasMore(false);
                }
            })
            .catch((error) => {
                setLoading(false);
                Error401(error, router);
                console.error("Error fetching data:", error);

                if (error.response && error.response.status === 401) {
                    // Unauthorized error (e.g., token expired)
                    localStorage.clear();
                    router.push("/login");
                }
            });
    };


    const handleFilterChange = (status) => {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        let filtered = [];
        setLoading(true);

        if (status === "KirimUlasan") {
            // Show items with 'waiting' or 'rejected' status
            filtered = dataApi
            setFilteredData(filtered);
            console.log("filtered data approved", filtered);

        } else if (status === "UlasanSelesai") {

            axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}rating/filter?relation_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    setFilteredData(res.data.body);
                    console.log("review ulasan", res.data.body);
                }).catch((error) => {
                    Error401(error, router);
                })
        }

        setLoading(false);
        setSelectedStatus(status);

        console.log('data filter', filteredData);
    };
    console.log('filtered data', filteredData);

    return (
        <main className="">
            <Header title="Merchant" backto="/home" />
            <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
                {/* <Hero /> */}
                <div className="container mx-auto h-screen">
                    <div className="flex items-center justify-center px-6 pt-16">
                        <div className={`bg-gray-100 rounded-2xl w-full p-3`}>
                            <div className="flex justify-between items-center">

                                <Link
                                    href="/merchant"
                                    className="grid justify-items-center gap-1 w-24"
                                >
                                    <div className={`${styles.iconMenu}`}>
                                        <IconBowlFilled />
                                    </div>
                                    <p className="text-xs font-normal text-black">
                                        Daftar Menu
                                    </p>
                                </Link>
                                <Link
                                    href="/merchant/pesanan"
                                    className="grid justify-items-center gap-1 w-24 "
                                >
                                    <div className={`${styles.iconMenu}`}>
                                        <Image
                                            src={"/icon/pesanan.png"}
                                            alt="Girl in a jacket"
                                            width={30}
                                            height={30}
                                        />
                                    </div>
                                    <p className="text-xs font-normal text-black">Pesanan</p>
                                </Link>
                                <Link
                                    href="/merchant/saldo"
                                    className="grid justify-items-center gap-1 w-24 "
                                >
                                    <div className={`${styles.iconMenu}`}>
                                        <Image
                                            src={"/icon/saldo.png"}
                                            alt="Girl in a jacket"
                                            width={30}
                                            height={30}
                                        />
                                    </div>
                                    <p className="text-xs font-normal text-black">Saldo</p>
                                </Link>
                                <Link
                                    href="/merchant/review"
                                    className="grid justify-items-center gap-1 w-24 "
                                >
                                    <div className={`${styles.iconMenu}`}>
                                        <Image
                                            src={"/icon/ulasan.png"}
                                            alt="Girl in a jacket"
                                            width={30}
                                            height={30}
                                        />
                                    </div>
                                    <p className="text-xs font-normal text-black">Ulasan</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between px-7 pt-4 pb-2 text-[14px] font-semibold">
                        <div
                            className={`w-full cursor-pointer grid pb-2 justify-items-center ${selectedStatus === "KirimUlasan"
                                ? "text-green border-b-2 border-green"
                                : "text-gray-500"
                                }`}
                            onClick={() => handleFilterChange("KirimUlasan")}
                        >
                            <div className="flex justify-between ">
                                <span>Kasih Ulasan</span>
                                <div className="h-[16px] w-[16px] bg-red-500 rounded-full flex justify-center items-center text-[8px] font-bold text-white">
                                    <span>1</span>
                                </div>
                            </div>

                        </div>
                        <div
                            className={`w-full cursor-pointer grid pb-2  justify-items-center ${selectedStatus === "UlasanSelesai"
                                ? "text-green border-b-2 border-green"
                                : "text-gray-500"
                                }`}
                            onClick={() => handleFilterChange("UlasanSelesai")}
                        >
                            <span>Ulasan Selesai</span>

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
                            {filteredData.length == 0 ? (
                                <p className="text-gray-400">
                                    {selectedStatus === "approved"
                                        ? "Belum Ada Menu"
                                        : "Tidak Ada Pengajuan"}
                                </p>
                            ) : (
                                <>
                                    {/* {filteredData.map((data) => (
                                        // <div className="w-full">
                                        //     .
                                        // </div>
                                        <CardReview key={data.id} dataReview={data} kategori={selectedStatus} />
                                    ))} */}
                                    {selectedStatus === "KirimUlasan" ? (
                                        <>
                                            {filteredData.map((dataFilter) => (
                                                <CardCampaign
                                                    key={dataFilter.id}
                                                    to={`/merchant/review/${dataFilter.order_id}?id_camp=${dataFilter.campaign_id}`}
                                                    img={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataFilter?.event_image}`}
                                                    title={dataFilter.event_name}
                                                    description={"sfsfsf"}
                                                    date={"sfsfs"}
                                                    address={`${dataFilter.event_address}`}
                                                    rating={true}
                                                />
                                            ))}
                                        </>
                                    ) : selectedStatus === "UlasanSelesai" && filteredData.length > 0 ? (
                                        <>
                                            {filteredData.map((dataFilter) => (
                                                <CardCampaign
                                                    key={dataFilter.id}
                                                    to={``}
                                                    img={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataFilter.order?.campaign?.image_url}`}
                                                    title={dataFilter.order?.campaign?.event_name}
                                                    description={"sfsfsf"}
                                                    date={"sfsfs"}
                                                    address={`${dataFilter.order?.campaign?.address}`}
                                                    rating={true}
                                                />
                                            ))}
                                        </>
                                    ) : null}
                                </>
                            )}
                        </div>
                    )}
                </div>
                {/* <HomePage /> */}
            </div>
            <BottomNav />
        </main>
    );
}
