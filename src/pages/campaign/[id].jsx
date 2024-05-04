import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import DetailCamp from "@/components/page/DetailPage";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Campaign = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [campaignData, setCampaignData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
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
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 401) {
          Error401(error, router);
        }
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
      {loading && <Loading />}
    </div>
  );
};

export default Campaign;
