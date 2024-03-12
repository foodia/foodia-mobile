import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { IconCamera, IconUser } from '@tabler/icons-react';
import Loading from '@/components/Loading';

const Edit = () => {
    const router = useRouter();
    const [dataUser, setDataUser] = useState({});
    const [ktp_number, setKtp_number] = useState('');
    const [fotoSelfi, setFotoSelfi] = useState();
    const [ktpPhoto, setKtpPhoto] = useState();
    const [loading, setLoading] = useState(false);
    const [noted, setNoted] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const id = sessionStorage.getItem('id');
        if (!token || !id) {
            router.push('/login');
        }

        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}detonator/fetch/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('response', response.data.body);
                setDataUser(response.data.body);
                setKtp_number(response.data.body?.ktp_number || '');
                // setFotoSelfi(`${process.env.NEXT_PUBLIC_URL_STORAGE}${response.data.body?.self_photo || ''}`);
                // setKtpPhoto(`${process.env.NEXT_PUBLIC_URL_STORAGE}${response.data.body?.ktp_photo || ''}`);
                setNoted(response.data.body?.note || '');
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    router.push('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleKtpNumberChange = (event) => {
        setKtp_number(event.target.value);
    };

    const handleFotoSelfiChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
            const maxSize = 5 * 1024 * 1024; // 2.5MB

            if (!allowedTypes.includes(file.type)) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Hanya file PNG, JPG, dan JPEG yang diizinkan!",
                });
                event.target.value = "";
            } else if (file.size > maxSize) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Ukuran gambar melebihi 5MB!",
                });
                event.target.value = "";
            } else {
                setFotoSelfi(file);
            }
        }
    };


    const handleKtpPhotoChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
            const maxSize = 5 * 1024 * 1024; // 2.5MB

            if (!allowedTypes.includes(file.type)) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Hanya file PNG, JPG, dan JPEG yang diizinkan!",
                });
                event.target.value = "";
            } else if (file.size > maxSize) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Ukuran gambar melebihi 5MB!",
                });
                event.target.value = "";
            } else {
                setKtpPhoto(file);
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = sessionStorage.getItem('token');

        const formData = new FormData();
        formData.append('ktp_number', ktp_number);
        formData.append('self_photo', fotoSelfi);
        formData.append('ktp_photo', ktpPhoto);
        // console.log('formData', formData);
        console.log('ktpPhoto', ktpPhoto);
        console.log('fotoSelfi', fotoSelfi);

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}detonator/update/${dataUser?.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            Swal.fire({
                icon: "success",
                title: "Update Detonator Success!",
                text: `Update Detonator Success! mohon tunggu approval `,
                showConfirmButton: false,
                timer: 2000,
            });
            setTimeout(() => {
                router.push("/home");
            }, 2000);
        } catch (error) {
            console.log('error', error);
            Swal.fire({
                icon: "success",
                title: "Update Detonator Success!",
                text: `Update Detonator Success! mohon tunggu approval `,
                showConfirmButton: false,
                timer: 2000,
            });
            // setTimeout(() => {
            //     router.push("/home");
            // }, 2000);
        }
    };

    return (
        <main className="my-0 mx-auto min-h-full mobile-w">
            <div className="mx-auto bg-white h-screen text-primary">
                <div className="flex justify-center p-4">
                    <h1 className="text-4xl text-primary font-bold">Edit Detonator</h1>
                </div>
                <div className="flex items-center p-4 m-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50  dark:text-red-400" role="alert">
                    <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <span className="sr-only">Info</span>
                    <div>
                        <span className="font-medium">Rejected!</span> {noted}.
                    </div>
                </div>
                <div className="flex flex-col items-center w-full">
                    <div className="p-2 w-full flex flex-col gap-3">
                        <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
                            <IconUser />
                            <input
                                value={ktp_number}
                                onChange={handleKtpNumberChange}
                                type="text"
                                id="ktp_number"
                                className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
                                placeholder="Nama Lengkap"
                                required
                            />
                        </div>
                        {/* <label htmlFor="fotoSelfi">Foto Ktp</label> */}
                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="fotoSelfi"
                                className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100 px-4"
                            >
                                {fotoSelfi ? (
                                    <img
                                        src={URL.createObjectURL(fotoSelfi)}
                                        alt="Foto Selfi"
                                        className="w-full h-full rounded-lg object-cover"
                                    />
                                ) : (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataUser?.self_photo || ''}`}
                                        alt="Foto Selfi"
                                        className="w-full h-full rounded-lg object-cover"
                                    />
                                )}

                                <input
                                    id="fotoSelfi"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFotoSelfiChange}
                                />
                            </label>
                        </div>

                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="ktpPhoto"
                                className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100 px-4"
                            >
                                {ktpPhoto ? (
                                    <img
                                        src={URL.createObjectURL(ktpPhoto)}
                                        alt="KTP Photo"
                                        className="w-full h-full rounded-lg object-cover"
                                    />
                                ) : (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataUser?.ktp_photo || ''}`}
                                        alt="Foto Selfi"
                                        className="w-full h-full rounded-lg object-cover"
                                    />
                                )}

                                <input
                                    id="ktpPhoto"
                                    type="file"
                                    className="hidden"
                                    onChange={handleKtpPhotoChange}
                                />
                            </label>
                        </div>

                        <div className="grid gap-4 content-center">
                            <button
                                onClick={handleSubmit}
                                type="submit"
                                className="text-white text-center font-bold rounded-xl bg-primary py-3"
                            >
                                Kirim
                            </button>
                        </div>
                    </div>
                    <div className="mobile-w flex gap-1 justify-center pt-14">
                        <label className="font-light text-sm text-black">Sudah memiliki akun?</label>
                        <Link className="text-blue-950 font-bold hover:underline text-sm" href="/login">
                            Masuk
                        </Link>
                    </div>
                </div>
                {loading && <Loading />}
            </div>
        </main>
    );
};

export default Edit;
