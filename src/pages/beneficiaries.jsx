import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Beneficiaries = () => {
    const router = useRouter();
    const [selectedStatus, setSelectedStatus] = useState("Booking");
    const [DataOrder, setDataOrder] = useState([]);
    const [loading, setLoading] = useState(false);
    const [jumlahKupon, setJumlahKupon] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const id_ = localStorage.getItem("token");
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

                    console.log(cekData.beneficiaries);
                    // return;
                    if (!cekData.beneficiaries) {
                        Swal.fire({
                            icon: "warning",
                            title: "Akun Belum Terdaftar sebagai beneficiaries",
                            text: "Mohon untuk registrasi sebagai Beneficiary",
                            showConfirmButton: true,
                            confirmButtonColor: "green",
                            confirmButtonText: "Registrasi",
                            showCancelButton: true,
                            cancelButtonColor: "red",
                            cancelButtonText: "Tutup",
                            // timer: 2000,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                router.push("/beneficiaries/syarat");
                            } else if (result.isDismissed) {
                                router.push("/home");
                            }
                        });
                    } else {
                        if (cekData.beneficiaries.status == "waiting") {
                            localStorage.setItem("id", cekData.beneficiaries.beneficiaries_id);
                            localStorage.setItem("role", "beneficiaries");
                            localStorage.setItem("status", cekData.beneficiaries.status);
                            localStorage.setItem("note", cekData.beneficiaries.note);

                            Swal.fire({
                                icon: "warning",
                                title: "Akun beneficiaries Anda Belum Terverifikasi",
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
                        } else if (cekData.beneficiaries.status == "rejected") {
                            setLoading(false);
                            localStorage.setItem("id", cekData.beneficiaries.beneficiaries_id);
                            localStorage.setItem("role", "beneficiaries");
                            localStorage.setItem("status", cekData.beneficiaries.status);
                            localStorage.setItem("note", cekData.beneficiaries.note);
                            Swal.fire({
                                icon: "warning",
                                title: "beneficiaries Ditolak",
                                text: `${cekData.beneficiaries.note}`,
                                showConfirmButton: false,
                                timer: 2000,
                            });
                            setTimeout(() => {
                                router.push("/beneficiaries/edit");
                            }, 2000);
                        } else {
                            console.log('berhasil');
                            localStorage.setItem("id", cekData.beneficiaries.beneficiaries_id);
                            localStorage.setItem("role", "beneficiaries");
                            localStorage.setItem("status", cekData.beneficiaries.status);
                            localStorage.setItem("note", cekData.beneficiaries.note);
                            getDetail(cekData.beneficiaries.beneficiaries_id, token);
                            ChectCupon(cekData.beneficiaries.beneficiaries_id, token);
                        }
                    }
                })
                .catch((error) => {
                    Error401(error, router);
                });
        }
    }, []);


    const getDetail = (id, token) => {
        axios
            .get(
                process.env.NEXT_PUBLIC_API_BASE_URL +
                `beneficiaries/fetch/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                console.log('data Beneficiaries', response.data.body);
                return;
                setDataApi(response.data.body);
                // const filtered = response.data.body.filter(
                //   (data) => data.status === "approved"
                // );
                setFilteredData(filtered);

                setLoading(false);

                if (response.data.body.length === 0) {
                    setHasMore(false);
                }
            })
            .catch((error) => {
                setLoading(false);
                Error401(error, router);
            });
    };

    const ChectCupon = (id, token) => {
        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}coupon/check-available`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setJumlahKupon(response.data.body.qouta_available);

            })
            .catch((error) => {
                Error401(error, router);
            });

    };


    const handleFilterChange = (status) => {
        setLoading(true);
        setSelectedStatus(status);

    };

    useEffect(() => {
        let filtered = [];
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        if (selectedStatus === "Booking") {
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}coupon/filter?beneficiary_id=${id}&status=reserved`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                setDataOrder(response.data.body);
                setLoading(false);
            }).catch((error) => {
                Error401(error, router);
            })
        } else if (selectedStatus === "Hangus") {
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}coupon/filter?beneficiary_id=${id}&status=expired`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                setDataOrder(response.data.body);
                setLoading(false);
            }).catch((error) => {
                Error401(error, router);
            })
        } else if (selectedStatus === "Aktif") {
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}coupon/filter?beneficiary_id=${id}&status=active`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                setDataOrder(response.data.body);
                setLoading(false);
            }).catch((error) => {
                Error401(error, router);
            })
        } else if (selectedStatus === "Selesai") {
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}coupon/filter?beneficiary_id=${id}&status=claimed`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                setDataOrder(response.data.body);
                setLoading(false);
            }).catch((error) => {
                Error401(error, router);
            })
        }
        console.log(' DataOrder', DataOrder);
    }, [selectedStatus]);

    const HandleRout = (status, coupon, mrc, prd) => {
        if (status === "reserved") {
            router.push(`/beneficiaries/qr-kupon/${coupon}?mrc=${mrc}&prd=${prd}`);
        } else if (status === "active") {
            router.push(`/beneficiaries/qr-kupon/${coupon}?mrc=${mrc}&prd=${prd}`);
        }
        else if (status === "expired") {
            Swal.fire({
                position: "bottom",
                customClass: {
                    popup: "custom-swal",
                    icon: "custom-icon-swal",
                    title: "custom-title-swal",
                    confirmButton: "custom-confirm-button-swal",
                },
                icon: "error",
                title: `<p class="w-auto pl-1 font-bold text-md">Kupon Telah Hangus</p><p class="text-sm w-auto pl-1 font-light">Mohon maaf kamu waktu transaksi kupon anda telah hangus, silahkan ajukan kupon baru</p>`,
                html: `
            <div class="absolute px-28 ml-4 top-0 mt-4">
              <hr class="border border-black w-16 h-1 bg-slate-700 rounded-lg "/>
            </div>
          `,
                width: "375px",
                showConfirmButton: true,
                confirmButtonText: "Tutup",
                confirmButtonColor: "#3FB648",
            });
        }
        else if (status === "claimed") {
            // router.push(`/beneficiaries/qr-kupon/${coupon}?mrc=${mrc}&prd=${prd}`);
        }

    }
    return (
        <>
            <div className="container mx-auto h-screen max-w-480 bg-white flex flex-col">
                <Header title="Beneficiaries" backto="/home" />
                <div className="bg-white h-screen pt-10">
                    <div className={`bg-gradient-to-b ${jumlahKupon === 0 ? "from-[#C1C1C1] to-[#707070]" : "from-[#FF2F2F]  to-[#FFBD5B]"} rounded-lg p-6 my-2 text-white max-w-md mx-auto w-[328px] `}>
                        <div className="flex justify-between">
                            <div className="">
                                <h1 className="text-[24px] font-bold">KUPON BERSAMA</h1>
                                <p className="text-[16px] font-bold">Makan Gratis</p>
                                <p className="text-[10px] italic mt-[24px]">Dapat ditukarkan di merchant Foodia</p>
                            </div>
                            <div className="flex items-end">
                                <div className="pt-[30px] text-center">
                                    <p className="text-[14px]">Tersedia</p>
                                    <p className="text-[36px] font-bold">{jumlahKupon}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 my-2">
                        <button onClick={() => router.push("/beneficiaries/order-merchant?step=1")}
                            disabled={
                                loading ||
                                jumlahKupon === 0
                            }
                            className={`w-full h-14 ${loading || jumlahKupon === 0 ? "text-[#A1A5C1] bg-[#F5F4F8]" : "text-white bg-primary hover:bg-blue-500"} rounded-2xl px-2 font-semibold text-[18px]`}>
                            Klaim Kupon
                        </button>
                    </div>

                    <div className="flex flex-row px-6 py-2 my-2 justify-between">
                        <div
                            className={`cursor-pointer text-center w-full pb-2 text-[16px] ${selectedStatus === "Booking"
                                ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                                : "text-gray-400 font-bold border border-t-0 border-x-0 border-b-[2px] border-b-transparent"
                                }`}
                            onClick={() => handleFilterChange("Booking")}
                        >
                            <p>Booking</p>
                        </div>
                        <div
                            className={`cursor-pointer text-center w-full pb-2 ml-2 text-[16px] ${selectedStatus === "Hangus"
                                ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                                : "text-gray-400 font-bold border border-t-0 border-x-0 border-b-[2px] border-b-transparent"
                                }`}
                            onClick={() => handleFilterChange("Hangus")}
                        >
                            <p>Hangus</p>
                        </div>
                        <div
                            className={`cursor-pointer text-center w-full pb-2 text-[16px] ${selectedStatus === "Aktif"
                                ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                                : "text-gray-400 font-bold border border-t-0 border-x-0 border-b-[2px] border-b-transparent"
                                }`}
                            onClick={() => handleFilterChange("Aktif")}
                        >
                            <p>Aktif</p>
                        </div>
                        <div
                            className={`cursor-pointer text-center w-full pb-2 text-[16px] ${selectedStatus === "Selesai"
                                ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                                : "text-gray-400 font-bold border border-t-0 border-x-0 border-b-[2px] border-b-transparent"
                                }`}
                            onClick={() => handleFilterChange("Selesai")}
                        >
                            <p>Selesai</p>
                        </div>
                    </div>

                    {DataOrder.length > 0 ? (
                        DataOrder.map((data, index) => (
                            <div
                                key={index}
                                onClick={() =>
                                    HandleRout(
                                        data.status,
                                        data.qr_code,
                                        data.merchant_id,
                                        data.merchant_product_id
                                    )
                                }
                                className="w-full items-center justify-center flex cursor-pointer"
                            >
                                <div className="w-[328px] bg-white border border-gray-300 rounded-lg flex p-2">
                                    <img
                                        className="w-[100px] h-[100px] rounded-md object-cover"
                                        src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${data.merchant_product?.images[0]}`}
                                        alt="Nasi Kuning"
                                    />
                                    <div className="ml-2 flex flex-col justify-between w-full">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-[14px] font-bold text-green-600">{data.merchant_product?.name}</h2>
                                            <button
                                                className={`${data.status === 'reserved' ? 'bg-blue-500'
                                                    : data.status === 'expired' ? 'bg-red-500'
                                                        : 'bg-primary'
                                                    } text-white text-[8px] font-bold px-2 rounded-full`}
                                            >
                                                {data.status}
                                            </button>
                                        </div>
                                        <p className="text-[8px] text-gray-600 overflow-hidden line-clamp-3">
                                            {data.merchant_product?.description}
                                        </p>
                                        <div className="text-[8px] text-right flex flex-col items-end">
                                            <p className="italic text-gray-600">Permintaan oleh</p>
                                            <p className="font-semibold italic text-gray-600">{localStorage.getItem('fullname')}</p>
                                            <p className="italic text-gray-600">Masa berlaku hingga</p>
                                            <p className="font-semibold italic text-gray-600">
                                                {moment(data.expired_at).format('DD MMMM YYYY HH:mm:ss [WIB]')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full items-center justify-center flex">
                            <p className="text-center text-gray-400">Belum ada data</p>
                        </div>
                    )}





                    {loading && <Loading />}
                </div>
            </div>
            <BottomNav />
        </>
    );
}

export default Beneficiaries;