import Link from "next/link";
import { useRouter } from "next/router";

const CardKupon = (props) => {
    const router = useRouter();
    const { img = '', title = '', productName = '', total_amount = 0, date = '', status = '', qty = 0, idOrder = 0 } = props;
    let to = '#';

    if (router.pathname === "/merchant/kupon") {
        switch (status) {
            case 'review':
                to = `/merchant/scan-kupon/${idOrder}`;
                break;
            case 'active':
                to = `/merchant/kupon/pelaporan/${idOrder}`;
                break;
            case 'claimed':
                to = `/merchant/kupon/claimed/${idOrder}`;
                break;
            default:
                break;
        }
    }

    return (
        <div className="flex justify-center mt-1 w-full mb-2 items-center">

            <Link href={to} className="w-full items-center justify-center flex">
                <div className="w-[328px]  bg-white border border-gray-300 rounded-lg flex p-2">
                    <img className="w-[100px] h-[100px] rounded-md object-cover" src="https://via.placeholder.com/100" alt="Nasi Kuning" />
                    <div className="ml-2 flex flex-col justify-between w-full">
                        <div className="flex justify-between items-center">
                            <h2 className="text-[14px] font-bold text-primary">Nasi Kuning</h2>
                            <button className="bg-blue-500 text-white text-[8px] font-bold px-2 rounded-full">{status}</button>
                        </div>
                        <p className="text-[8px] text-gray-600 overflow-hidden line-clamp-3">Paket nasi kuning lezat dengan lauk ayam suwir, telur dadar dan kering tempe manis pedas. Sudah termasuk sambal</p>
                        <div className="flex justify-between items-center">
                            <p className="text-[#6CB28E] text-[18px] font-bold">Rp 15.000</p>
                            <div className="text-[8px] text-right flex flex-col items-end">
                                <p className="italic text-gray-600">Permintaan oleh</p>
                                <p className="font-semibold italic text-gray-600">ASEP MULYANA</p>
                                <p className="italic text-gray-600">Masa berlaku hingga</p>
                                <p className="font-semibold italic text-gray-600">20 Juni 2024 15:31:00 WIB</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default CardKupon;


