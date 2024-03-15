import Header from "@/components/Header";
import InputForm from "@/components/Imput";
import {
  IconBuildingBank,
  IconCreditCard,
  IconUser,
} from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const penarikan = (penarikan) => {
  const router = useRouter();
  const [amount, setamount] = useState("");
  const [balance, setBalance] = useState("");
  const [bank, setBank] = useState("");
  const [recipient_name, setRecipient_name] = useState("");
  const [rekening, setRekening] = useState("");
  const [method, setMethod] = useState("");
  const parsedAmount = parseInt(amount.replace(/\./g, ""), 10);
  const eWalletFee = parsedAmount * (1.5 / 100);
  const bankFee = 4000;

  console.log("wallert", eWalletFee);

  useEffect(() => {
    const id = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");

    const ressponse = axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/fetch/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBalance(response.data.body.wallet.balance);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [balance]);

  const handlerecipient_nameChange = (event) => {
    setRecipient_name(event.target.value);
  };
  const handleBankChange = (event) => {
    setBank(event.target.value);
  };
  const handleMethodChange = (event) => {
    setMethod(event.target.value);
  };
  const handlerekeningChange = (event) => {
    setRekening(event.target.value);
  };
  const handleTarikSaldo = () => {
    Swal.fire({
      title: "Konfirmasi Penarikan Saldo",
      text: "Anda yakin akan menarik saldo? Pastikan nomor Link Aja sudah sesuai.",
      showCancelButton: true,
      confirmButtonText: "Lanjut",
      cancelButtonText: "Batal",
      confirmButtonColor: "#3fb648",
      cancelButtonColor: "#c0bfbf",
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.isConfirmed) {
          const merchant_id = sessionStorage.getItem("id");
          const token = sessionStorage.getItem("token");
          if (
            !merchant_id ||
            !recipient_name ||
            !bank ||
            !rekening ||
            !amount
          ) {
            Swal.fire("Oops!", "Mohon lengkapi semua field.", "error");
          } else {
            const bankMethod = {
              merchant_id: parseInt(merchant_id),
              recipient_name: recipient_name,
              bank: bank,
              rekening: rekening,
              amount: parsedAmount + bankFee,
              payment_method: method,
            };
            const eWalletMethod = {
              merchant_id: parseInt(merchant_id),
              bank: bank,
              rekening: rekening,
              amount: parsedAmount + eWalletFee,
              payment_method: method,
            };
            {
              method === "BANK"
                ? axios
                    .post(
                      `${process.env.NEXT_PUBLIC_API_BASE_URL}disbursement/request`,
                      bankMethod,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    )
                    .then((response) => {
                      // Tanggapan dari panggilan API berhasil
                      Swal.fire("Sukses!", "Saldo telah ditarik.", "success");
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
                      Swal.fire(
                        "Oops!",
                        "Terjadi kesalahan saat menarik saldo.",
                        "error"
                      );
                    })
                : axios
                    .post(
                      `${process.env.NEXT_PUBLIC_API_BASE_URL}disbursement/request`,
                      eWalletMethod,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    )
                    .then((response) => {
                      // Tanggapan dari panggilan API berhasil
                      Swal.fire("Sukses!", "Saldo telah ditarik.", "success");
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
                      Swal.fire(
                        "Oops!",
                        "Terjadi kesalahan saat menarik saldo.",
                        "error"
                      );
                    });
            }
          }
          // Panggil API menggunakan Axios di sini
        }
      }
    });
  };
  const formatPrice = (price) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

    return formatter.format(price);
  };
  const handlePriceChange = (event) => {
    let inputVal = event.target.value;
    inputVal = inputVal.replace(/\D/g, ""); // Remove all non-numeric characters
    inputVal = inputVal.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Add dots every 3 digits
    setamount(inputVal);
  };

  const bankOptions = [
    {
      id: 1,
      value: "Mandiri",
      label: "Mandiri",
    },
    {
      id: 2,
      value: "BCA",
      label: "BCA",
    },
    {
      id: 3,
      value: "BRI",
      label: "BRI",
    },
  ];

  const eWalletOptions = [
    {
      id: 1,
      value: "Link Aja",
      label: "Link Aja",
    },
  ];

  return (
    <div className="my-0 mx-auto h-screen max-w-480 bg-white flex flex-col">
      <Header title="Penarikan Saldo" />
      <div className="container mx-auto mt-24 bg-white h-full">
        <div className="mx-4 p-3 rounded-lg border-solid border-2 border-gray-300">
          <div className="flex items-center justify-between">
            <p>Saldo Penghasilan</p>
            <p className="text-xs font-bold text-primary">
              {formatPrice(balance)}
            </p>
          </div>
        </div>
        <div className="mx-4 mt-6">
          <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full h-10 flex gap-2 items-center pl-4">
            <p className="">Rp</p>
            <InputForm
              cssInput="bg-gray-50 border text-gray-900 text-sm w-full outline-none border-none h-full rounded-lg"
              // label="amount"
              type="text"
              name="amount"
              value={amount}
              onChange={handlePriceChange}
              placeholder="Nominal Penarikan"
            />
          </div>

          <div className="flex justify-between">
            {balance - 2000 < parsedAmount ? (
              <div className="flex flex-col">
                <p className="text-xs text-red-500 font-semibold mt-2">
                  Saldo anda tidak mencukupi,
                </p>
                <p className="text-xs text-red-500 font-semibold">
                  Maximal Penarikan : {formatPrice(balance - 2000)}
                </p>
              </div>
            ) : (
              <p className="text-xs text-blue-800 font-semibold mt-2">
                Minimal Penarikan Rp 10.000
              </p>
            )}
            {/* <p className="text-xs text-blue-500 font-semibold mt-2">
              Biaya Admin Rp 2.000
            </p> */}
          </div>
        </div>
        <div className="px-4 mt-4">
          <div className="mt-1 flex flex-row items-center pl-3 pr-4 py-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full h-10">
            {/* <IconBuildingBank /> */}
            <select
              name="bank"
              value={method}
              id="bank"
              onChange={handleMethodChange}
              className={
                method === ""
                  ? "text-gray-400 w-full p-0 py-2 bg-transparent focus:border-none outline-none"
                  : "bg-white w-full p-0 py-2 bg-transparent focus:border-none outline-none"
              }
            >
              <option className="text-gray-400" value="">
                Metode Pembayaran
              </option>
              <option value="BANK">Bank</option>
              <option value="E_WALLET">E-Wallet</option>
            </select>
          </div>

          {method ? (
            <>
              <div className="mt-2 flex flex-row items-center pl-3 pr-4 py-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full h-10">
                {/* <IconBuildingBank /> */}
                <select
                  name="bank"
                  value={bank}
                  id="bank"
                  onChange={handleBankChange}
                  className={
                    bank === ""
                      ? "text-gray-400 w-full p-0 py-2 bg-transparent focus:border-none outline-none"
                      : "bg-white w-full p-0 py-2 bg-transparent focus:border-none outline-none"
                  }
                >
                  <option className="text-gray-400" value="">
                    {method === "BANK" ? "Pilih Bank" : "Pilih E-Wallet"}
                  </option>
                  {method === "BANK"
                    ? bankOptions.map((data) => (
                        <option key={data.id} value={data.value}>
                          {data.label}
                        </option>
                      ))
                    : eWalletOptions.map((data) => (
                        <option key={data.id} value={data.value}>
                          {data.label}
                        </option>
                      ))}
                </select>
              </div>

              <p className="text-xs text-blue-800 font-semibold mt-2">
                {method === "BANK"
                  ? "Biaya Transaksi Rp 4.000"
                  : "Biaya Transaksi 1,5% dari jumlah penarikan"}
              </p>

              {method === "BANK" && (
                <div className="mt-2 flex flex-row items-center p-4 pr-0 py-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full h-10 ">
                  <input
                    onChange={handlerecipient_nameChange}
                    value={recipient_name}
                    name="recipient_name"
                    type="text"
                    id="recipient_name"
                    className="w-full p-0 py-2 bg-transparent focus:border-none outline-none"
                    placeholder="Nama Penerima"
                    required
                  />
                </div>
              )}

              <div className="mt-2 flex flex-row items-center p-4 pr-0 py-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full h-10 ">
                {/* <IconCreditCard /> */}
                <input
                  onChange={handlerekeningChange}
                  value={rekening}
                  name="rekening"
                  type="number"
                  id="rekening"
                  className="w-full p-0 py-2 bg-transparent focus:border-none outline-none"
                  placeholder={
                    method === "BANK" ? "Nomor Rekening" : "Nomor E-Wallet"
                  }
                  required
                />
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        <div className="mobile-w fixed flex justify-center h-28 bottom-0 my-0 mx-auto w-full max-w-screen-sm ">
          <div className="kotak shadow-inner px-4">
            <p className="text-center text-xs font-semibold mx-6 my-2">
              Dengan klik tombol di bawah, kamu telah setuju dengan{" "}
              <span className="text-primary">Syarat & Ketentuan</span> penarikan
              Saldo Foodia
            </p>
            <button
              disabled={
                balance - 2000 < parsedAmount ||
                parsedAmount < 10000 ||
                amount == "" ||
                balance == "" ||
                bank == "" ||
                recipient_name == "" ||
                rekening == ""
              }
              className={
                balance - 2000 < parsedAmount ||
                parsedAmount < 10000 ||
                amount == "" ||
                balance == "" ||
                bank == "" ||
                recipient_name == "" ||
                rekening == ""
                  ? "bg-gray-400 text-white w-full h-12 rounded-lg font-bold"
                  : "bg-primary text-white w-full h-12 rounded-lg font-bold"
              }
              onClick={handleTarikSaldo}
            >
              Tarik Saldo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default penarikan;
