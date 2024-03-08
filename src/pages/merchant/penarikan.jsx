import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import InputForm from "@/components/Imput";
import { Icon123, IconBuildingBank, IconCreditCard, IconSmartHome, IconUser } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const penarikan = (penarikan) => {
    const router = useRouter();
    const [amount, setamount] = useState();
    const [balance, setBalance] = useState(0);
    const [bank, setBank] = useState()
    const [recipient_name, setRecipient_name] = useState();
    const [rekening, setRekening] = useState();


    useEffect(() => {
        const id = sessionStorage.getItem("id");
        const token = sessionStorage.getItem("token");

        const ressponse = axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/fetch/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((response) => {
                setBalance(response.data.body.wallet.balance);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            })

    }, [balance])

    const handlerecipient_nameChange = (event) => {
        setRecipient_name(event.target.value);
    };
    const handleBankChange = (event) => {
        setBank(event.target.value);
    };
    const handlerekeningChange = (event) => {
        setRekening(event.target.value);
    };

    const handleamountChange = (event) => {
        setamount(parseInt(event.target.value));
    };
    const handleTarikSaldo = () => {
        Swal.fire({
            title: 'Konfirmasi Penarikan Saldo',
            text: 'Anda yakin akan menarik saldo? Pastikan nomor Link Aja sudah sesuai.',
            showCancelButton: true,
            confirmButtonText: 'Lanjut',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {


                if (result.isConfirmed) {
                    const merchant_id = sessionStorage.getItem("id");
                    const token = sessionStorage.getItem("token");
                    if (!merchant_id || !recipient_name || !bank || !rekening || !amount) {
                        Swal.fire('Oops!', 'Mohon lengkapi semua field.', 'error');
                    } else {
                        const data = {
                            merchant_id: parseInt(merchant_id),
                            recipient_name: recipient_name,
                            bank: bank,
                            rekening: rekening,
                            amount: amount + 2000,
                        };
                        axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}disbursement/request`, data, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            }
                        })
                            .then((response) => {
                                // Tanggapan dari panggilan API berhasil
                                Swal.fire('Sukses!', 'Saldo telah ditarik.', 'success');
                                Swal.fire({
                                    icon: "success",
                                    title: "Saldo telah ditarik.",
                                    text: ` Pengajuan penarikan dana Berhasil`,
                                    showConfirmButton: false,
                                    timer: 2000,
                                });
                                setTimeout(() => {
                                    router.push("/merchant/saldo");
                                }, 2000);
                            })
                            .catch((error) => {
                                // Tanggapan dari panggilan API gagal atau terjadi kesalahan
                                Swal.fire('Oops!', 'Terjadi kesalahan saat menarik saldo.', 'error');
                            });
                    }
                    // Panggil API menggunakan Axios di sini

                }
            }
        });
    }

    console.log(amount);
    return (
        <div>
            <main className="">
                <Header title="Penarikan Saldo" />
                <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
                    <div className="container mx-auto mt-24 bg-white h-screen">
                        <div className="  mx-4 p-3 rounded-lg border-solid border-2 border-gray-300">
                            <div className="flex justify-between">
                                <p>Saldo Penghasilan</p>
                                <p className="text-xs font-bold text-primary">{balance ? balance.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : 'Rp 0,00'}</p>
                            </div>
                        </div>

                        <div className="mx-4 mt-6">
                            <InputForm
                                cssInput="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-10 p-2.5"
                                // label="amount"
                                type="number"
                                name="amount"
                                value={amount}
                                onChange={handleamountChange}
                                placeholder="Nominal Penarikan"
                            />
                            <div className="flex justify-between">

                                {balance - 2000 < amount ? <p className="text-xs text-red-500 font-semibold mt-2">Saldo anda tidak mencukupi Max {`${(balance - 2000).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}`}</p> : <p className="text-xs text-blue-500 font-semibold mt-2">Minimal Penarikan Rp 10.000</p>}
                                <p className="text-xs text-blue-500 font-semibold mt-2">Biaya Admin Rp 2.000,00</p>
                            </div>

                        </div>
                        <div className="px-4 mt-6">
                            <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-10 ">

                                <IconUser />
                                <input
                                    onChange={handlerecipient_nameChange}
                                    value={recipient_name}
                                    name="recipient_name"
                                    type="text"
                                    id="recipient_name"
                                    className="ml-2 w-full p-0 py-2 pl-1 bg-transparent focus:border-none"
                                    placeholder="Nama Penerima"
                                    required
                                />
                            </div>

                            <div className="mt-4 flex flex-row items-center p-4 pr-4 py-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-10 p-2.5">
                                <IconBuildingBank />
                                <select
                                    name="bank"
                                    value={bank}
                                    id="bank"
                                    onChange={handleBankChange}
                                    className="ml-1 w-full p-0 py-2 pl-1 bg-transparent focus:border-none"
                                >
                                    <option className="">Bank</option>
                                    <option value="bca" >BCA</option>
                                    <option value="mandiri">Mandiri</option>
                                </select>
                            </div>

                            <div className="mt-4 flex flex-row items-center p-4 pr-0 py-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-10 ">

                                <IconCreditCard />
                                <input
                                    onChange={handlerekeningChange}
                                    value={rekening}
                                    name="rekening"
                                    type="number"
                                    id="rekening"
                                    className="ml-2 w-full p-0 py-2 pl-1 bg-transparent focus:border-none"
                                    placeholder="Rekening"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mobile-w fixed flex justify-center h-28 bottom-0 my-0 mx-auto w-full max-w-screen-sm ">
                            <div className="kotak shadow-inner ">
                                <p className="text-center text-xs font-semibold mx-6 my-2">Dengan klik tombol di bawah, kamu telah setuju dengan <span className="text-primary">Syarat & Ketentuan</span> penarikan Saldo Foodia</p>
                                <button className="bg-primary text-white w-full h-12 rounded-lg font-bold" onClick={handleTarikSaldo}>Tarik Saldo</button>


                            </div>
                        </div>


                    </div >
                </div>

            </main>
        </div>
    );
}

export default penarikan;