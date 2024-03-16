import Header from "@/components/Header";
import Loading from "@/components/Loading";
import SlideCard from "@/components/SlideCard";
import { useAppState } from "@/components/page/UserContext";
import styles from "@/styles/Home.module.css";
import { IconBuildingStore } from "@tabler/icons-react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "tabler-icons-react";

const MetodePembayaran = () => {
  const router = useRouter();
  const [metodePembayaran, setMetodePembayaran] = useState("");
  const { state, setDonation } = useAppState();
  const [pajak, setPajak] = useState(0);
  const [total, setTotal] = useState(0);
  const [nominalDonasi, setNominalDonasi] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state.donation.amount) {
      console.log("No data");

      // Use SweetAlert to show a warning
      Swal.fire({
        icon: "error",
        title: "Nominal belum di isi",
        text: `Silahkan di coba kembali`,
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        router.push("/home");
      }, 2000);
      return; // Stop execution if no amount
    }

    // Data exists, proceed with calculations
    const pajakAmount = state.donation.amount * 0.025; // 2.5% tax
    const totalBayar = state.donation.amount + pajakAmount;
    setNominalDonasi(state.donation.amount);
    setPajak(pajakAmount);
    setTotal(totalBayar);
    console.log("data", state.donation);

  }, [state.donation]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (!state.donation.amount) {
  //         console.log("No data");

  //         // Use SweetAlert to show a warning
  //         Swal.fire({
  //           icon: "error",
  //           title: "Nominal belum di isi",
  //           text: `Silahkan di coba kembali`,
  //           showConfirmButton: false,
  //           timer: 2000,
  //         });
  //         setTimeout(() => {
  //           router.push("/home");
  //         }, 2000);
  //       } else {
  //         setNominalDonasi(state.donation.amount);
  //         const pajakAmount = state.donation.amount * 0.025; // 2.5% tax
  //         const totalBayar = state.donation.amount + pajakAmount;
  //         setPajak(pajakAmount);
  //         setTotal(totalBayar);
  //         console.log("data", state.donation);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);

  //       // Use SweetAlert to show an error
  //       Swal.fire({
  //         icon: "error",
  //         title: "Oops...",
  //         text: "Error fetching data!",
  //       });
  //     }
  //   };

  //   fetchData();
  // }, [state.donation]);

  const handleRadioChange = (event) => {
    setMetodePembayaran(event.target.value);
  };

  const handleBayarSekarang = async () => {
    console.log("metodePembayaran", metodePembayaran);
    setLoading(true);
    const data = {
      amount: parseInt(total),
      payment_channel: metodePembayaran,
      success_url: `${process.env.NEXT_PUBLIC_URL_PAYMEN}`,
      detail: {
        campaign_id: state.donation.detail.campaign_id,
        description: state.donation.detail.description,
        donation_type: state.donation.detail.donation_type,
      },
    };
    // setDonation(data);
    console.log("data akhir", data);

    try {
      const token = sessionStorage.getItem('token');
      const headers = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}donation/payment`,
        data,
        { headers }
      );
      console.log(
        "data respone",
        response.data.body.actions.desktop_web_checkout_url
      );
      setLoading(false);
      const responeUrl = response.data.body.actions.desktop_web_checkout_url;
      router.push(`${responeUrl}`);

      // Swal.fire({
      //     icon: 'success',
      //     title: 'Campaign Created!',
      //     text: 'Campaign Berhasil dibuat Mohon Tunggu approval dari admin',
      //     showConfirmButton: false,
      //     timer: 2000,
      // });

      // setTimeout(() => {
      //     router.push(`${responeUrl}`);
      // }, 2000);
    } catch {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Donasi gagal',
        text: 'Gagal Membuat Donasi Mohon Coba Lagi',
        showConfirmButton: false,
        timer: 2000,
      });
    }
    // router.push('/bukti_pembayaran');
  };

  const formatRupiah = (amount) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

    return formatter.format(amount);
  };

  return (
    <main className="">
      <div className="container my-0 mx-auto max-w-480 overflow-x-hidden bg-white flex flex-col">
        <Header title="Konfirmasi Donasi" />
        <div className="container mx-auto pt-14  h-screen">
          {/* <div className="px-4">
            <label className="text-xs font-medium">
              Pilih Metode Pembayaran
            </label>
            <label
              for="default-radio-1"
              className="cursor-pointer my-2 flex items-center justify-between bottom-1 border rounded-xl px-3 py-4"
            >
              <div className="flex items-center gap-2">
                <img
                  src="icon/payment/LinkAja.png"
                  alt=""
                  className="w-10 h-10 rounded-lg"
                />
                <p
                  for="default-radio-1"
                  className="ms-2 text-sm text-black font-bold"
                >
                  LinkAja
                </p>
              </div>
              <input
                id="default-radio-1"
                type="radio"
                value="ID_LINKAJA"
                name="default-radio"
                onChange={handleRadioChange}
                className="w-4 h-4 border-primary focus:outline-none dark:focus:outline-none dark:bg-gray-700 dark:border-gray-600 rounded-full"
              />
            </label>
            
          </div> */}
          <div className="p-4 mobile-w h-56 mx-auto w-full max-w-screen-sm bg-white rounded-lg">
            <h1 className="text-xs font-medium">Rincian Donasi</h1>
            <div className="shadow-[rgba(0,0,13,0.5)_0px_0px_3px_0px] mt-3 p-3 rounded-lg">
              <div className="text-center font-bold">Campaign Name</div>
              <hr className="w-full mx-auto my-2 bg-gray-300 rounded" />
              <div className="flex justify-between">
                <h1 className="font-bold text-gray-400">Nominal Donasi</h1>
                <p className="font-semibold">
                  {formatRupiah(nominalDonasi)}
                </p>
              </div>
              <div className="flex justify-between">
                <h1 className="font-bold text-gray-400">Biaya Pembayaran {'(2,5%)'}</h1>
                <p className="font-semibold">{formatRupiah(pajak)}</p>
              </div>
              <hr className="w-full mx-auto my-2 bg-gray-300 rounded" />
              <div className="flex justify-between">
                <h1 className="font-medium text-black">Total</h1>
                <p className="font-semibold text-primary">
                  {formatRupiah(total)}
                </p>
              </div>
            </div>
          </div>
          <div className="text-center pt-20 mobile-w bottom-0 fixed px-6 py-5">
            <button
              className="bg-primary text-white w-full h-12 rounded-xl font-bold"
              onClick={handleBayarSekarang}
            >
              Lanjutkan Pembayaran
            </button>
          </div>
        </div>
      </div>
      {loading && <Loading />}
    </main>
  );
};

export default MetodePembayaran;
