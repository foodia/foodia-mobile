import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useAppState } from "@/components/page/UserContext";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import Swal from "sweetalert2";

const Verifikasi = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [codes, setCodes] = useState("");
    const { state } = useAppState();
    const [showCountdown, setShowCountdown] = useState(false);
    const [countdownTime, setCountdownTime] = useState(Date.now() + 120000); // Set 120000 untuk 2 menit
    const registrasi = state.registrasi;

    useEffect(() => {
        console.log(registrasi);
        if (!registrasi || !registrasi.email) {
            Swal.fire({
                icon: "error",
                title: "Gagal Membuat Akun",
                text: "Email Tidak ditemukan silahkan login kembali",
                width: "375px",
                showConfirmButton: true,
                confirmButtonText: "login",
                confirmButtonColor: "#3b82f6",
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/login");
                }
            });
        }
    }, [registrasi]);

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            setCountdownTime((prevTime) => prevTime - 1000); // Kurangi 1 detik dari countdownTime setiap 1 detik
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, []);

    useEffect(() => {
        setShowCountdown(countdownTime > 0); // Tentukan apakah countdown masih berlangsung berdasarkan countdownTime
    }, [countdownTime]);

    const renderer = ({ minutes, seconds }) => {
        if (minutes === 0 && seconds === 0) {
            return (
                <div
                    onClick={handleResend}
                    className="text-xs  "
                >
                    Tidak menerima kode? Kirim ulang setelah
                    <br />
                    <span className="text-blue-500 hover:underline cursor-pointer">
                        {'<Kirim Kode>'}
                    </span>
                </div>
            );
        } else {
            return (
                <>
                    <p className="text-xs ">Tidak menerima kode? Kirim ulang setelah {minutes}:{seconds}</p>

                </>
            );
        }
    };

    const handleChange = (event) => {
        const value = event.target.value;
        if (value.length < 7) {
            setCodes(value);
        }
        if (value.length === 6) {
            const otp = {
                email: registrasi.email,
                code: value,
            };
            handleSubmit(otp);
        }
    };

    const handleResend = () => {
        setLoading(true);
        axios
            .post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/resend-otp`,
                { email: registrasi.email },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer YOUR_ACCESS_TOKEN",
                    },
                }
            )
            .then(() => {
                setCountdownTime(Date.now() + 120000); // Set ulang countdownTime ke 2 menit
                setLoading(false);
                Swal.fire({
                    icon: "success",
                    title: "OTP Sent",
                    text: "Please check your email",
                    showConfirmButton: false,
                    timer: 2000,
                });
            })
            .catch((error) => {
                setLoading(false);
                Swal.fire({
                    icon: "error",
                    title: "Gagal Membuat Akun",
                    text: "Email Tidak ditemukan silahkan login kembali",
                    width: "375px",
                    showConfirmButton: true,
                    confirmButtonText: "login",
                    confirmButtonColor: "#3b82f6",
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.push("/login");
                    }
                });
            });
    };

    const handleSubmit = async (otp) => {
        setLoading(true);
        if (registrasi.kategori == 'forgot_password') {
            console.log(registrasi.kategori);
            if (otp) {
                console.log(otp);
                router.push("/new-password");
            }
            setLoading(false);
        } else {
            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/verify-otp`,
                    otp,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer YOUR_ACCESS_TOKEN",
                        },
                    }
                );
                const imageUrl = "/img/illustration/checklist.png";
                setLoading(false);
                Swal.fire({
                    position: "bottom",
                    customClass: {
                        popup: "custom-swal",
                        icon: "custom-icon-swal",
                        title: "custom-title-swal",
                        confirmButton: "custom-confirm-button-swal",
                    },
                    icon: "success",
                    title: `<p className="w-auto pl-1 font-bold text-md">Akun Berhasil Di Buat</p><p className="text-sm w-auto pl-1 font-light">Terima kasih telah mendaftar untuk menjadi penolong sesama</p>`,
                    html: `
            <div className="absolute px-28 ml-4 top-0 mt-4">
              <hr className="border border-black w-16 h-1 bg-slate-700 rounded-lg "/>
            </div>
          `,
                    width: "375px",
                    showConfirmButton: true,
                    confirmButtonText: "Masuk",
                    confirmButtonColor: "#3FB648",
                }).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.setItem("fullname", registrasi.fullname);
                        localStorage.setItem("phone", registrasi.phone);
                        localStorage.setItem("email", registrasi.email);
                        localStorage.setItem("role", registrasi.role);
                        localStorage.setItem("token", registrasi.token);
                        router.push("/home");
                    }
                });
            } catch (error) {
                if (error.response.data.error[0].field === "email") {
                    Swal.fire({
                        icon: "error",
                        title: "Gagal Membuat Akun",
                        text: "Email Tidak ditemukan silahkan login kembali",
                        width: "375px",
                        showConfirmButton: true,
                        confirmButtonText: "login",
                        confirmButtonColor: "#3b82f6",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            router.push("/login");
                        }
                    });
                    setLoading(false);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Gagal Membuat Akun",
                        text: "Kode OTP Tidak Sesuai Atau Expired",
                        width: "375px",
                        showConfirmButton: true,
                        confirmButtonText: "Tutup",
                        confirmButtonColor: "#ef4444",
                    });
                    setLoading(false);
                }
            }
        }


    };

    return (
        <div className="container mx-auto bg-white h-screen">
            <div className="grid justify-items-center w-full">
                <Header title="Verifikasi" />
                <form className="justify-center pt-9 p-2 mt-5 w-full h-full">

                    <h5 className="mt-4 flex  text-sm font-normal">
                        Masukan 6 kode pada email anda
                    </h5>

                    <div className="mt-1 flex flex-row items-center px-0 bg-gray-100 text-gray-400 text-sm rounded-lg w-full focus:border-none">
                        <input
                            onChange={handleChange}
                            value={codes}
                            name="codes"
                            type="number"
                            id="codes"
                            className="w-full p-0 py-4 bg-transparent focus:border-none ml-2"
                            placeholder="Kode"
                            required
                        />
                    </div>

                    <div className="flex  pt-2">
                        <div

                            className="font-normal"
                        >
                            <Countdown date={countdownTime} renderer={renderer} />
                        </div>
                        <br />

                        {!showCountdown && !loading && (
                            <div
                                onClick={handleResend}
                                className="text-sm text-cyan-500 hover:underline cursor-pointer"
                            >
                                Kirim Ulang Kode OTP
                            </div>
                        )}
                    </div>


                </form>
            </div>
            {loading && <Loading />}
        </div>
    );
};

export default Verifikasi;
