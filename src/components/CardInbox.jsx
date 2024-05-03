// src\components\cardInbox.jsx
import Link from "next/link";
import { useEffect, useState } from "react";

const CardInbox = ({ DataInbox }) => {
    const [url, setUrl] = useState('');
    useEffect(() => {
        if (DataInbox.inbox_type === "donator" && DataInbox.transaction && !DataInbox.order) {
            setUrl(`/bukti_pembayaran?external_id=${DataInbox.transaction.external_id}`)
        }
        if (DataInbox.inbox_type === "detonator" && !DataInbox.transaction && !DataInbox.order) {
            setUrl(`/campaign/${DataInbox.campaign.id}`)
        }
        if (DataInbox.inbox_type === "merchant" && DataInbox.order && !DataInbox.transaction) {
            setUrl(`/merchant/detailpesanan/${DataInbox.order.id}`)
        }

    }, [DataInbox]);
    return (
        <div className="flex items-center justify-center pb-2">
            <Link href={url} className="flex flex-col w-full max-w-[320px] leading-1.5 p-2 border-primary border-2 bg-white rounded-lg shadow-[0px_0px_8px_0px_#00000024]">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-black">{DataInbox.title}</span>
                </div>
                <p className="text-sm font-normal text-gray-900">{DataInbox.campaign.event_name}</p>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{DataInbox.description}</span>
            </Link>
        </div>
    );
}

export default CardInbox;
