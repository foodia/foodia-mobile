import BottomNav from "@/components/BottomNav";
import CardInbox from "@/components/CardInbox";
import Error401 from "@/components/error401";
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
  const [donaturActive, setDonaturActive] = useState(false);
  const [detonatorActive, setDetonatorActive] = useState(false);
  const [merchantActive, setMerchantActive] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("id");
    const detonator_id = localStorage.getItem("id_detonator");
    const merchant_id = localStorage.getItem("id_merchant");
    // console.log(id, detonator_id, merchant_id);

    if (id) {
      setDonaturActive(true);
      if (detonator_id !== 'undefined') {
        setDetonatorActive(true);
      }
      if (merchant_id !== 'undefined') {
        setMerchantActive(true);
      }
    }
  }, [selectedStatus]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // if (!token) {
    //   router.push("/login");
    // } else {
    //   fetchData();
    // }
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}inbox/list?inbox_type=donator`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSelectedStatus("donator");
        setDataApi(response.data.body);
        setDataInbox(response.data.body);
        setLoading(false);
      } catch (error) {
        Error401(error, router);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (status) => {
    const token = localStorage.getItem("token");

    setLoading(true);
    let url = '';

    if (status === "donator") {
      url = `${process.env.NEXT_PUBLIC_API_BASE_URL}inbox/list?inbox_type=donator`;
    } else if (status === "detonator") {
      url = `${process.env.NEXT_PUBLIC_API_BASE_URL}inbox/list?inbox_type=detonator`;
    } else if (status === "merchant") {
      url = `${process.env.NEXT_PUBLIC_API_BASE_URL}inbox/list?inbox_type=merchant`;
    }

    if (url) {
      axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          setDataApi(response.data.body);
          setDataInbox(response.data.body);
          setLoading(false);
        })
        .catch((error) => {
          // console.error("Error fetching data:", error);
          Error401(error, router);
          setLoading(false);
        });
    }

    setSelectedStatus(status);
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

            {donaturActive ? (
              <div className="px-2 w-full">
                <div
                  className={` cursor-pointer text-center font-semibold text-lg ${selectedStatus === "donator"
                    ? " text-primary text-center border border-t-0 border-x-0 border-b-primary"
                    : "cursor-pointer text-center text-gray-500"
                    }`}
                  onClick={() => handleFilterChange("donator")}
                >
                  <span>Donator</span>
                </div>
              </div>
            ) : null}

            {detonatorActive ? (
              <div className="px-2 w-full">
                <div
                  className={`cursor-pointer text-center font-semibold text-lg ${selectedStatus === "detonator"
                    ? " text-primary text-center border border-t-0 border-x-0 border-b-primary"
                    : "cursor-pointer text-center text-gray-500"
                    }`}
                  onClick={() => handleFilterChange("detonator")}
                >
                  <span>Detonator</span>
                </div>
              </div>
            ) : null}

            {merchantActive ? (
              <div className="px-2 w-full">
                <div
                  className={`cursor-pointer text-center font-semibold text-lg ${selectedStatus === "merchant"
                    ? " text-primary text-center border border-t-0 border-x-0 border-b-primary"
                    : "cursor-pointer text-center text-gray-500"
                    }`}
                  onClick={() => handleFilterChange("merchant")}
                >
                  <span>Merchant</span>
                </div>
              </div>
            ) : null}


          </div>

          {loading ? (
            <div className={`${styles.card}`}>
              {[...Array(4)].map((_, index) => (
                <div key={index} className={`${styles.loadingCard}`}>
                  <div className={`${styles.shimmer}`}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`pb-28`}>
              {DataInbox.length > 0 ? (
                DataInbox.map((inboxData) => (
                  <CardInbox DataInbox={inboxData} key={inboxData.id} />

                ))
              ) : (
                <div className="flex justify-center items-center h-[326px] text-center font-semibold text-[#D9D9D9] text-[16px]">No Data</div>
              )}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default inbox;
