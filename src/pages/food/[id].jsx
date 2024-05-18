import CardRepordFood from "@/components/CardRepordFood";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
const FoodCampaign = () => {
  const router = useRouter();
  const { id } = router.query;
  const [foodOrder, setFoodOrder] = useState([]);
  const [DataAPI, setDataApi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detonator_id, setDetonatorId] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        if (!id) {
          throw new Error("Missing required session data");
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/fetch/${id}`
        );

        setFoodOrder(response.data.body.orders);
        setDataApi(response.data.body);
        setDetonatorId(response.data.body.detonator_id);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Error401(error);
      }
    };

    fetchData();
  }, [id, detonator_id]);

  const jumlahPesananDiproses = foodOrder.reduce((total, item) => {
    if (item.approval_status === "approved") {
      total = total + 1;
    }
    return total;
  }, 0);

  return (
    <>
      <main className="overflow-hidden">
        <div className="my-0 mx-auto max-w-480 h-screen overflow-hidden bg-white flex flex-col">
          <Header title="Status Merchant" backto={`/campaign/${id}`} />
          <div className="container mx-auto mt-14 bg-white h-screen">
            {/* <div className="mx-auto text-center p-2 text-primary">
              <h1 className="font-bold">Status Pesanan</h1>
              <h1>{DataAPI.event_name}</h1>
            </div>
            <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" /> */}
            <p className="px-4">
              Pesanan Terkonfirmasi : {jumlahPesananDiproses} /{" "}
              {foodOrder.length}
            </p>
            <div className="items-center justify-center overflow-auto h-screen pb-[100px]">
              {foodOrder.map((item) => (
                <CardRepordFood
                  key={item.id}
                  detonator_id={detonator_id}
                  campaign_id={item.campaign_id}
                  id_order={item.id}
                  img={
                    item.merchant_product.images.length > 0
                      ? `${process.env.NEXT_PUBLIC_URL_STORAGE}${item.merchant_product.images[0].image_url}`
                      : "/img/default-image.png"
                  }
                  title={item.merchant_product.name}
                  price={item.total_amount}
                  nameMerchant={item.merchant.merchant_name}
                  qty={item.qty}
                  approval_status={item.approval_status}
                  order_status={item.order_status}
                  is_report={item.is_report}
                />
              ))}
            </div>
          </div>
        </div>
        {loading && <Loading />}
      </main>
    </>
  );
};

export default FoodCampaign;
