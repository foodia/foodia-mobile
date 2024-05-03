import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useAppState } from "@/components/page/UserContext";
import { IconInfoCircle, IconMail } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { state, setRegistrasi } = useAppState();
    const [email, setEmail] = useState(() => state.registrasi?.email || "");
    const router = useRouter();


    const handleSubmit = () => {
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError('Format email tidak valid');
            return;
        }
        setLoading(true);

        const ressponse = axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/forgot-password/check-email`, {
            email: email
        })
            .then(response => {
                setLoading(false);
                if (response.data.code === 200) {
                    const formData = {
                        email,
                        kategori: 'forgot_password'
                    }
                    setRegistrasi(formData);
                    router.push("/verifikasi");

                } else {
                    setError('Email tidak terdaftar')
                }
            })
            .catch(error => {
                setLoading(false);
                setError('Email tidak terdaftar')

                //testing
            })
        // Logika pengiriman email lupa kata sandi di sini
        // setError('Email tidak terdaftar')
    }

    return (
        <main className="my-0 mx-auto min-h-full mobile-w relative">
            <div className="my-0 mx-auto h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
                <div className="container mx-auto mt-12 overflow-hidden">
                    <Header backto="/" title="Lupa Kata Sandi" />

                    <div className="p-4 flex flex-col gap-2">
                        <label htmlFor="confirmPassword" className="text-sm">Masukan email anda</label>
                        <div className={`flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full borde ${error ? ' border-2 border-red-500' : 'focus:border-none'}`}>
                            <IconMail />
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                type="text"
                                id="email"
                                className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
                                placeholder="Email"
                                required
                            />
                        </div>
                        <p
                            className={
                                error ? "instructions italic text-[10px] flex items-center"
                                    : "hidden"
                            }
                        >
                            <IconInfoCircle size={15} className="mr-1 text-red-600" />
                            <span className="text-red-600">
                                {error}
                            </span>
                        </p>
                        {/* {error && <p className="text-red-500 text-sm font-semibold">{error}</p>} */}

                        <div className="grid gap-6 content-center absolute bottom-0 left-0 w-full p-4">
                            <button
                                onClick={handleSubmit}
                                type="submit"
                                className=" text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-bold rounded-xl text-md w-full sm:w-auto py-4 text-center "
                            >
                                Kirim
                            </button>
                        </div>
                    </div>

                    {loading && <Loading />}
                </div>
            </div>
        </main>
    );
}

export default ForgotPassword;
