import Header from "@/components/Header";
import DetailCamp from "@/components/page/DetailPage";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Campaign = () => {
  const router = useRouter();
  const { id } = router.query;
  const [campaignData, setCampaignData] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/fetch/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCampaignData(response.data.body);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div className="h-full max-w-480 bg-white flex flex-col">
      <Header title="Informasi" />
      {campaignData && <DetailCamp data={campaignData} />}
      {/* <BottomNav /> */}
    </div>
  );
};

export default Campaign;
