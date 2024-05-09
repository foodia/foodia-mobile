import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import DetailCamp from "@/components/page/DetailPage";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.css";

const Campaign = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [campaignData, setCampaignData] = useState(null);
  const [prevPath, setPrevPath] = useState("/home");

  useEffect(() => {
    const prevPath = localStorage.getItem("prevPath");
    if (prevPath) {
      setPrevPath(prevPath);
    }

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
        Error401(error, router);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div className="h-full max-w-480 bg-white flex flex-col">
      <Header title="Informasi" backto={prevPath} />
      {loading ? (
        <div className={`${styles.card}`}>
          {[...Array(4)].map((_, index) => (
            <div key={index} className={`${styles.loadingCard}`}>
              <div className={`${styles.shimmer}`}></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <DetailCamp data={campaignData} />
        </>
      )}
      {loading && <Loading />}
    </div>
  );
};

export default Campaign;
