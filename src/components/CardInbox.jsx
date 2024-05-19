// src\components\cardInbox.jsx
import Link from "next/link";
import { useEffect, useState } from "react";

const CardInbox = ({ DataInbox }) => {
    const [url, setUrl] = useState('');
    // console.log(DataInbox);
    // console.log(DataInbox.campaign.id);
    useEffect(() => {
        const detonator_id = localStorage.getItem("id_detonator");
        const merchant_id = localStorage.getItem("id_merchant");

        if (DataInbox.inbox_type === "donator") {
            if (DataInbox.title === "Campaign Baru" || DataInbox.title === "Berjalan" || DataInbox.title === "Selesai") {
                setUrl(`/campaign/${DataInbox.campaign.id}`)
            } else if (DataInbox.title === "Laporan Campaign") {
                setUrl(`/report/${DataInbox.campaign.id}`)
            } else if (DataInbox.title === "Pembayaran Donasi Berhasil") {
                setUrl(`/bukti_pembayaran?external_id=${DataInbox.transaction.external_id}`)
            }
        }
        if (DataInbox.inbox_type === "detonator") {
            localStorage.setItem("id", detonator_id);
            localStorage.setItem("role", "detonator");
            localStorage.setItem("status", "approved");
            localStorage.setItem("note", 'approved');

            if (DataInbox.title === "Campaign Disetujui Admin" || DataInbox.title === "Campaign Ditolak Admin" || DataInbox.title === "Donasi Campaign Terpenuhi") {
                setUrl(`/campaign/${DataInbox.campaign.id}`)
            } else if (DataInbox.title === "Pesanan Ditolak Merchant " || DataInbox.title === "Pesanan Diterima Merchant") {
                setUrl(`/food/${DataInbox.campaign.id}`)

            } else if (DataInbox.title === "Makanan Sudah Diterima") {
                setUrl(`/report/${DataInbox.campaign.id}`)
            } else if (DataInbox.title === "Lihat  Review Campaign") {
                setUrl(`/detonator/review`)
            }
        }
        if (DataInbox.inbox_type === "merchant") {
            localStorage.setItem("id", merchant_id);
            localStorage.setItem("role", "merchant");
            localStorage.setItem("status", "approved");
            localStorage.setItem("note", 'approved');
            if (DataInbox.title === "Ada Pesanan Baru") {
                setUrl(`/merchant/detailpesanan/${DataInbox.order.id}`)
            } else if (DataInbox.title === "Saldo Pembayaran Sudah Masuk") {
                setUrl(`/merchant/saldo`)
            } else if (DataInbox.title === "Lihat  Review Pesanan") {
                setUrl(`/merchant/review`)
            }
        }

        console.log(url);
    }, [DataInbox]);
    return (
        <div className="flex items-center justify-center pb-2">
            <Link href={url} className="flex flex-col w-full max-w-[320px] leading-1.5 p-2  hover:border-primary border-2 bg-white rounded-lg shadow-[0px_0px_10px_#0000001A]">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-[14px] font-bold text-black">{DataInbox.title}</span>
                </div>
                <p className="text-[12px] font-normal text-gray-900">{DataInbox.campaign.event_name}</p>
                <span className="text-[8px] font-italic text-gray-500 dark:text-gray-400">{DataInbox.description}</span>
            </Link>
        </div>
    );
}

export default CardInbox;
