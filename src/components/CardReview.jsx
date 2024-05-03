import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CardReview = (dataReview, kategori) => {
    const router = useRouter();
    console.log('data review', dataReview);
    console.log('one data', dataReview.dataReview.campaign_id);
    const [dataCamp, setDataCamp] = useState();
    const [dataMenu, setDataMenu] = useState();
    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_API_BASE_URL + `campaign/fetch/${dataReview.dataReview?.campaign_id || dataReview.dataReview?.campaign?.id}`, {})
            .then((response) => {
                setDataCamp(response.data.body);
                if (kategori === 'approved') {
                    const order = response.data.body.orders
                    const filter = order.filter((data) => data.id === dataReview.dataReview?.order_id)
                    setDataMenu(filter[0]);
                    console.log('filter order', filter);
                }
                console.log('data camp', response.data.body);
                // const filter = response.data.body.filter((data) => data. === dataReview.data.campaign_id)
            })
            .catch((error) => {

            })
    }, [dataReview])
    const formatPrice = (price) => {
        const formatter = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        });

        return formatter.format(price);
    };

    const hendleClick = () => {
        if (dataReview.dataReview?.is_rating) {
            console.log('rating', dataReview.dataReview?.is_rating);
            // router.push(`/merchant/review/${dataReview?.dataReview?.order_id}?id_camp=${dataReview?.dataReview?.campaign_id}&id_mrch=${dataReview?.dataReview?.merchant_id}`);
        } else if (!dataReview.dataReview?.is_review) {
            router.push(`/merchant/review/${dataReview?.dataReview?.order_id}&id_camp=${dataReview?.dataReview?.campaign_id}`);
        }

        // router.push(`/merchant/review/${dataReview?.dataReview?.order_id}`);

    }
    // console.log('one date', dataReview);
    // console.log('id camp', dataReview.data.campaign_id);
    // console.log('data', dataReview.data);
    console.log('dataMenu', dataMenu);
    // href={`/merchant/review/${dataReview?.dataReview?.order_id}`}
    return (
        <button onClick={hendleClick} className="w-full bg-white text-black rounded-lg inline-flex items-center px-4 py-2.5 ">
            <div className="flex justify-between w-full rounded-lg border border-2 border-green hover:bg-gray-100">
                <div className="flex p-2">
                    <img src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataMenu?.merchant_product?.images[0].image_url}`} alt={`${process.env.NEXT_PUBLIC_API_BASE_URL}${dataMenu?.merchant_product?.images[0].image_url}`} className="object-cover w-[90px] h-[90px] rounded-lg bg-blue-100 grid place-items-center mr-2" />

                    <div className="text-left place-items-start">
                        <div className=" text-[14px] font-bold text-primary">{dataReview?.dataReview?.event_name}</div>
                        <div className="mb-2 font-italic text-[8px] text-black">Tanggal Campaign : <span className=" font-semibold">{dataCamp?.event_date} {dataCamp?.event_time}</span></div>
                        <div className=" font-italic text-[10px] text-black">{dataMenu?.qty} x {dataMenu?.merchant_product?.name}</div>
                        <div className="flex justify-between items-center">

                            <div className="font-bold text-[18px] text-green">{formatPrice(dataReview?.dataReview?.total_amount)}</div>

                            {dataReview.dataReview?.is_rating ? <div className=" font-bold text-[8px] h-[16px] rounded-lg text-white bg-primary p-[4px] flex justify-center items-center">Completed</div> : null}

                        </div>

                    </div>
                </div>
            </div>
        </button>
    );
}

export default CardReview;