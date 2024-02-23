import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import InputForm from "@/components/Imput";
import { IconSmartHome } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";

const penarikan = (penarikan) => {
    const [PenarikanSaldo, setPenarikanSaldo] = useState();

    const handlePenarikanSaldoChange = (event) => {
        setPenarikanSaldo(event.target.value);
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
                    // Panggil API menggunakan Axios di sini
                    axios.post('/api/tarik-saldo', {
                        // Kirim data yang diperlukan untuk proses penarikan saldo
                        // Misalnya, nomor Link Aja atau data lain yang diperlukan
                    })
                        .then((response) => {
                            // Tanggapan dari panggilan API berhasil
                            Swal.fire('Sukses!', 'Saldo telah ditarik.', 'success');
                        })
                        .catch((error) => {
                            // Tanggapan dari panggilan API gagal atau terjadi kesalahan
                            Swal.fire('Oops!', 'Terjadi kesalahan saat menarik saldo.', 'error');
                        });
                }
            }
        });
    }

    console.log(PenarikanSaldo);
    return (
        <div>
            <main className="">
                <Header title="Penarikan Saldo" />
                <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
                    <div className="container mx-auto mt-24 bg-white h-screen">
                        <div className="  mx-4 p-3 rounded-lg border-solid border-2 border-gray-300">
                            <div className="flex justify-between">
                                <p>Saldo Penghasilan</p>
                                <p className="text-xs font-bold text-primary">Rp 300.000</p>
                            </div>
                        </div>

                        <div className="mx-4 mt-6">
                            <InputForm
                                cssInput="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-10 p-2.5"
                                // label="PenarikanSaldo"
                                type="number"
                                name="PenarikanSaldo"
                                value={PenarikanSaldo}
                                onChange={handlePenarikanSaldoChange}
                                placeholder="Nominal Penarikan"
                            />
                            <p className="text-xs text-blue-500 font-semibold mt-2">Minimal Penarikan Rp 10.000</p>
                        </div>
                        <div className="px-4 mt-6">
                            <label for="default-radio-1" class="my-2 flex items-center justify-between border border-gray-500 rounded-lg h-14 px-4">
                                <div class="flex items-center">
                                    <input id="default-radio-1" type="radio" value="ID_LINKAJA" name="default-radio" class="w-4 h-4 text-primary bg-gray-100 border border-gray-300 focus:ring-primary " />
                                    <img src="/icon/payment/LinkAja.png" alt="" class="w-10 h-10 rounded-lg m-2" />
                                    <p class="ms-2 text-sm font-medium text-black">LinkAja</p>
                                </div>
                                <div class="flex items-center">
                                    <p class="text-sm font-medium text-black">08123456543</p>
                                </div>
                            </label>


                        </div>






                    </div >
                </div>
                <div className="mobile-w fixed flex justify-center h-28 bottom-0 my-0 mx-auto w-full max-w-screen-sm ">
                    <div className="kotak shadow-inner ">
                        <p className="text-center text-xs font-semibold mx-6 my-2">Dengan klik tombol di bawah, kamu telah setuju denan <span className="text-primary">Syarat & Ketentuan</span> penarikan Saldo Foodia</p>
                        <button className="bg-primary text-white w-full h-12 rounded-lg font-bold" onClick={handleTarikSaldo}>Tarik Saldo</button>


                    </div>
                </div>
            </main>
        </div>
    );
}

export default penarikan;