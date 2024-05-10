import BottomNav from "@/components/BottomNav";
import CardInbox from "@/components/CardInbox";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const inbox = (inbox) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dataApi, setDataApi] = useState([]);
  const [DataInbox, setDataInbox] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  // const [page, setPage] = useState(1);
  // const [hasMore, setHasMore] = useState(true);
  // const observer = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://mocki.io/v1/8bfe8bfc-b804-4e91-9538-56085900648e`,
          {
            headers: {
              Authorization: `Bearer`,
            },
          }
        );
        console.log("page inbox data", response.data.body);
        setSelectedStatus("donator");
        setDataApi(response.data.body);
        setDataInbox(response.data.body);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (status) => {
    let filtered = [];

    setLoading(true);
    if (status === "donator") {
      axios
        .get(`https://mocki.io/v1/8bfe8bfc-b804-4e91-9538-56085900648e`)
        .then((response) => {
          setDataApi(response.data.body);
          setDataInbox(response.data.body);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else if (status === "detonator") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?campaign_status=${status}`
        )
        .then((response) => {
          setDataApi(response.data.body);
          setDataInbox(response.data.body);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else if (status === "merchant") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?campaign_status=${status}`
        )
        .then((response) => {
          setDataApi(response.data.body);
          setDataInbox(response.data.body);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }

    setSelectedStatus(status);
    // setFilteredData(filtered);
  };
  return (
    <>
      <div className="container mx-auto h-screen max-w-480 bg-white flex flex-col">
        <div className="bg-white h-screen">
          {/* <SearchBar /> */}
          <div className="flex items-center justify-center px-6 py-4">
            <h1 className="text-xl font-bold">Inbox</h1>
          </div>

          <div className="flex flex-row px-6 py-4 justify-between items-end">
            {/* <div
                            className={`cursor-pointer px-0 pb-3 w-36 ${selectedStatus === "donator"
                                ? "text-primary text-center border border-t-0 border-x-0 border-b-primary"
                                : "text-gray-500"
                                }`}
                            onClick={() => handleFilterChange("donator")}
                        >
                            <span>Donator</span>
                        </div> */}

            <div
              className={`cursor-pointer text-center font-semibold text-lg ${
                selectedStatus === "donator"
                  ? " text-primary text-center border border-t-0 border-x-0 border-b-primary"
                  : "cursor-pointer text-center text-gray-500"
              }`}
              onClick={() => handleFilterChange("donator")}
            >
              <span>Donator</span>
            </div>
            <div
              className={`cursor-pointer text-center font-semibold text-lg ${
                selectedStatus === "detonator"
                  ? " text-primary text-center border border-t-0 border-x-0 border-b-primary"
                  : "cursor-pointer text-center text-gray-500"
              }`}
              onClick={() => handleFilterChange("detonator")}
            >
              <span>Detonator</span>
            </div>
            <div
              className={`cursor-pointer text-center font-semibold text-lg ${
                selectedStatus === "merchant"
                  ? " text-primary text-center border border-t-0 border-x-0 border-b-primary"
                  : "cursor-pointer text-center text-gray-500"
              }`}
              onClick={() => handleFilterChange("merchant")}
            >
              <span>Merchant</span>
            </div>
          </div>

          {loading ? (
            <div className={`${styles.card} `}>
              {[...Array(4)].map((_, index) => (
                <div key={index} className={`${styles.loadingCard}`}>
                  <div className={`${styles.shimmer}`}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`pb-28 `}>
              {DataInbox.map((inboxData) => {
                // console.log(`Key: ${dataFilter.id}`);
                return <CardInbox DataInbox={inboxData} key={inboxData.id} />;
              })}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default inbox;
