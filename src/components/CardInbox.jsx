import axios from "axios";
import { useEffect, useState } from "react";
import Error401 from "./error401";
import { useRouter } from "next/router";

const CardInbox = ({ DataInbox }) => {
  const [url, setUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!DataInbox) return;

    const detonator_id = localStorage.getItem("id_detonator");
    const merchant_id = localStorage.getItem("id_merchant");

    const determineUrl = () => {
      switch (DataInbox.inbox_type) {
        case "donator":
          handleDonatorInbox();
          break;
        case "detonator":
          handleDetonatorInbox(detonator_id);
          break;
        case "merchant":
          handleMerchantInbox(merchant_id);
          break;
        default:
          break;
      }
    };

    const handleDonatorInbox = () => {
      switch (DataInbox.title) {
        case "Campaign Baru":
        case "Campaign Berjalan":
        case "Campaign Selesai":
          setUrl(`/campaign/${DataInbox.campaign?.id}`);
          break;
        case "Laporan Campaign":
          setUrl(`/report/${DataInbox.campaign?.id}`);
          break;
        case "Pembayaran Donasi Berhasil":
          setUrl(
            `/bukti_pembayaran?external_id=${DataInbox.transaction.external_id}`
          );
          break;
        default:
          break;
      }
    };

    const handleDetonatorInbox = (id) => {
      localStorage.setItem("id", id);
      localStorage.setItem("role", "detonator");
      localStorage.setItem("status", "approved");
      localStorage.setItem("note", "approved");

      switch (DataInbox.title) {
        case "Campaign Disetujui Admin":
        case "Campaign Ditolak Admin":
        case "Donasi Campaign Terpenuhi":
          setUrl(`/campaign/${DataInbox.campaign?.id}`);
          break;
        case "Pesanan Ditolak Merchant ":
        case "Pesanan Diterima Merchant":
          setUrl(`/campaign/${DataInbox.campaign?.id}`);
          break;
        case "Makanan Sudah Diterima":
          setUrl(`/report/${DataInbox.campaign?.id}`);
          break;
        case "Donasi Campaign Terpenuhi":
          setUrl(`/campaign/${DataInbox.campaign?.id}`);
          break;
        case "Lihat Review Campaign":
          setUrl(`/detonator/detail-review/${DataInbox.rating?.id}`);
          break;
        default:
          break;
      }
    };

    const handleMerchantInbox = (id) => {
      localStorage.setItem("id", id);
      localStorage.setItem("role", "merchant");
      localStorage.setItem("status", "approved");
      localStorage.setItem("note", "approved");

      switch (DataInbox.title) {
        case "Ada Pesanan Baru":
          setUrl(`/merchant/detailpesanan/${DataInbox.order.id}`);
          break;
        case "Saldo Pembayaran Sudah Masuk":
          localStorage.setItem('statusSaldo', 'selesai');
          setUrl(`/merchant/saldo`);
          break;
        case "Lihat Review Pesanan":
          setUrl(`/merchant/detail-review/${DataInbox.rating?.id}`);
          break;
        default:
          break;
      }
    };

    determineUrl();
  }, [DataInbox]);

  const setRead = (idInbox) => {
    const token = localStorage.getItem("token");
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}inbox/read`,
        { inbox_id: idInbox },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        if (response.status === 200) {
          router.push(url);
        } else {
          throw new Error("Failed to load page");
        }
      })
      .catch((error) => {
        const messages = {
          title: "Error",
          text: "Gagal Memuat Halaman",
        };
        Error401(error, router, messages);
      });
  };

  const handleClick = () => {
    if (!DataInbox) return;

    if (DataInbox.is_read === 0) {
      setRead(DataInbox.id);
    } else {
      router.push(url);
    }
  };

  return (
    <div className="flex items-center justify-center pb-2">
      <div
        onClick={handleClick}
        className={`${DataInbox?.is_read === 0 ? "border-primary border-2" : ""
          } flex flex-col w-full max-w-[320px] leading-1.5 p-2 bg-white rounded-lg shadow-[0px_0px_10px_#0000001A] cursor-pointer`}
      >
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-[14px] font-bold text-black">
            {DataInbox?.title || "Judul tidak tersedia"}
          </span>
        </div>
        <p className="text-[12px] font-normal text-gray-900">
          {DataInbox?.campaign?.event_name || "Nama acara tidak tersedia"}
        </p>
        <span className="text-[8px] font-italic text-gray-500 dark:text-gray-400">
          {DataInbox?.description || "Deskripsi tidak tersedia"}
        </span>
      </div>
    </div>
  );
};

export default CardInbox;
