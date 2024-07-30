import Link from "next/link";
import { useRouter } from "next/router";

const CardKupon = (props) => {
    const router = useRouter();
    const { img = '/img/default-image.png', title = '', desc = '', total_amount = 0, date = '', status = '', name_beneficiary = '', qty = 0, idOrder = 0 } = props;
    let to = '#';

    if (router.pathname === "/merchant/kupon") {
        switch (status) {
            case 'reserved':
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
                    <img className="w-[100px] h-[100px] rounded-md object-cover" src={img} alt="Nasi Kuning" />
                    <div className="ml-2 flex flex-col justify-between w-full">
                        <div className="flex justify-between items-center">
                            <h2 className="text-[14px] font-bold text-primary">{title}</h2>
                            <button className={`${status === 'claimed' ? 'bg-primary' : 'bg-blue-500'} capitalize text-white text-[8px] font-bold px-2 rounded-full`}>{status}</button>
                        </div>
                        <p className="text-[8px] text-gray-600 overflow-hidden line-clamp-3">{desc}</p>
                        <div className="flex justify-between items-center">
                            <p className="text-[#6CB28E] text-[18px] font-bold">
                                {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0
                                }).format(total_amount)}
                            </p>
                            <div className="text-[8px] text-right flex flex-col items-end">
                                <p className="italic text-gray-600">Permintaan oleh</p>
                                <p className="font-semibold italic text-gray-600">{name_beneficiary}</p>
                                <p className="italic text-gray-600">Masa berlaku hingga</p>
                                <p className="font-semibold italic text-gray-600">{date}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default CardKupon;


