import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Beneficiaries = () => {
    const router = useRouter();
    const [selectedStatus, setSelectedStatus] = useState("Aktif");
    const [loading, setLoading] = useState(false);
    const [jumlahKupon, setJumlahKupon] = useState(10);

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
                            localStorage.setItem("id", cekData.beneficiaries.beneficiaries_id);
                            localStorage.setItem("role", "beneficiaries");
                            localStorage.setItem("status", cekData.beneficiaries.status);
                            localStorage.setItem("note", cekData.beneficiaries.note);
                            getDetail(cekData.beneficiaries.beneficiaries_id, token);
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
                console.log(response.data.body);
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

    const handleFilterChange = (status) => {
        let filtered = [];
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        setLoading(true);
        setSelectedStatus(status);
        if (status === "Booking") {
            setLoading(false);
        } else if (status === "Hangus") {
            setLoading(false);
        } else if (status === "Aktif") {
            setLoading(false);
        } else if (status === "Selesai") {
            setLoading(false);
        }
    };
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

                    <Link href="/beneficiaries/qr-kupon/1" className="w-full items-center justify-center flex">
                        <div className="w-[328px]  bg-white border border-gray-300 rounded-lg flex p-2">
                            <img className="w-[100px] h-[100px] rounded-md object-cover" src="https://via.placeholder.com/100" alt="Nasi Kuning" />
                            <div className="ml-2 flex flex-col justify-between w-full">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-[14px] font-bold text-green-600">Nasi Kuning</h2>
                                    <button className="bg-blue-500 text-white text-[8px] font-bold px-2 rounded-full">Request</button>
                                </div>
                                <p className="text-[8px] text-gray-600 overflow-hidden line-clamp-3">Paket nasi kuning lezat dengan lauk ayam suwir, telur dadar dan kering tempe manis pedas. Sudah termasuk sambal</p>
                                <div className="text-[8px] text-right flex flex-col items-end">
                                    <p className="italic text-gray-600">Permintaan oleh</p>
                                    <p className="font-semibold italic text-gray-600">ASEP MULYANA</p>
                                    <p className="italic text-gray-600">Masa berlaku hingga</p>
                                    <p className="font-semibold italic text-gray-600">20 Juni 2024 15:31:00 WIB</p>
                                </div>
                            </div>
                        </div>
                    </Link>


                    {loading && <Loading />}
                </div>
            </div>
            <BottomNav />
        </>
    );
}

export default Beneficiaries;