import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
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
  const [titleCard, setTitleCard] = useState("");
  const [nominalDonasi, setNominalDonasi] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // const pajakAmount = state.donation.amount * 0.025; // 2.5% tax
    // const totalBayar = state.donation.amount + pajakAmount;

    if (!state.donation.amount) {
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

    if (localStorage.getItem("prevPath") === "/mydonation") {
      setTitleCard("Tabungan Donasi");
    }

    setNominalDonasi(state.donation.amount);
    // setPajak(pajakAmount);
    setTotal(state.donation.amount);
  }, [state.donation]);

  const handleBayarSekarang = () => {
    setLoading(true);
    const data = {
      amount: state.donation.amount,
      total_amount: total,
      payment_channel: metodePembayaran,
      success_url: `${process.env.NEXT_PUBLIC_URL_PAYMEN}`,
      detail: {
        campaign_name: state.donation.detail.campaign_name,
        campaign_id: state.donation.detail.campaign_id,
        description: state.donation.detail.description,
        donation_type: state.donation.detail.donation_type,
      },
    };
    const token = localStorage.getItem("token");
    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}donation/payment`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // setLoading(true);
        const responeUrl = response.data.body.actions.desktop_web_checkout_url;
        localStorage.setItem("external_id", response.data.body.external_id);
        router.push(`${responeUrl}`);
      })
      .catch((error) => {
        setLoading(false);
        const messages = {
          title: "Donasi gagal",
          text: "Gagal Membuat Donasi Mohon Coba Lagi",
        };
        Error401(error, router, messages);
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
              <div className="text-center font-bold">
                {titleCard !== ""
                  ? titleCard
                  : state.donation?.detail?.campaign_name}
              </div>
              <hr className="w-full mx-auto my-2 bg-gray-300 rounded" />
              <div className="flex justify-between">
                <h1 className="font-bold text-gray-400">Nominal Donasi</h1>
                <p className="font-semibold">{formatRupiah(nominalDonasi)}</p>
              </div>
              {/* <div className="flex justify-between">
                <h1 className="font-bold text-gray-400">
                  Biaya Pembayaran {"(2,5%)"}
                </h1>
                <p className="font-semibold">{formatRupiah(pajak)}</p>
              </div> */}
              <hr className="w-full mx-auto my-2 bg-gray-300 rounded" />
              <div className="flex justify-between">
                <h1 className="font-medium text-black">Total</h1>
                <p className="font-semibold text-primary">
                  {formatRupiah(nominalDonasi)}
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
