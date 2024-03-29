import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useAppState } from "@/components/page/UserContext";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const MetodePembayaran = () => {
  const router = useRouter();
  const [metodePembayaran, setMetodePembayaran] = useState("");
  const { state, setDonation } = useAppState();
  const [pajak, setPajak] = useState(0);
  const [total, setTotal] = useState(0);
  const [nominalDonasi, setNominalDonasi] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pajakAmount = state.donation.amount * 0.025; // 2.5% tax
    const totalBayar = state.donation.amount + pajakAmount;

    if (!state.donation.amount || totalBayar === 0) {
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
    setNominalDonasi(state.donation.amount);
    setPajak(pajakAmount);
    setTotal(totalBayar);
    console.log(totalBayar);
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

  const handleBayarSekarang = () => {
    setLoading(true);
    const data = {
      amount: state.donation.amount,
      admin_fee: pajak,
      total_amount: total,
      payment_channel: metodePembayaran,
      success_url: `${process.env.NEXT_PUBLIC_URL_PAYMEN}`,
      detail: {
        campaign_id: state.donation.detail.campaign_id,
        description: state.donation.detail.description,
        donation_type: state.donation.detail.donation_type,
      },
    };
    const token = sessionStorage.getItem("token");
    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}donation/payment`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // setLoading(true);
        const responeUrl = response.data.body.actions.desktop_web_checkout_url;
        router.push(`${responeUrl}`);
      })
      .catch(() => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Donasi gagal",
          text: "Gagal Membuat Donasi Mohon Coba Lagi",
          showConfirmButton: false,
          timer: 2000,
        });
      });
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
          <div className="p-4 mobile-w h-56 mx-auto w-full max-w-screen-sm bg-white rounded-lg">
            <h1 className="text-xs font-medium">Rincian Donasi</h1>
            <div className="shadow-[rgba(0,0,13,0.5)_0px_0px_3px_0px] mt-3 p-3 rounded-lg">
              <div className="text-center font-bold">Campaign Name</div>
              <hr className="w-full mx-auto my-2 bg-gray-300 rounded" />
              <div className="flex justify-between">
                <h1 className="font-bold text-gray-400">Nominal Donasi</h1>
                <p className="font-semibold">{formatRupiah(nominalDonasi)}</p>
              </div>
              <div className="flex justify-between">
                <h1 className="font-bold text-gray-400">
                  Biaya Pembayaran {"(2,5%)"}
                </h1>
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
