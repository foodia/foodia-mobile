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
  const [isReadDonatur, setIsReadDonatur] = useState(0);
  const [isReadDetonator, setIsReadDetonator] = useState(0);
  const [isReadMerchant, setIsReadMerchant] = useState(0);

  useEffect(() => {
    const id = localStorage.getItem("id");
    const detonator_id = localStorage.getItem("id_detonator");
    const merchant_id = localStorage.getItem("id_merchant");

    if (id) {
      setDonaturActive(true);
      if (detonator_id !== "-") {
        setDetonatorActive(true);
      }
      if (merchant_id !== "-") {
        setMerchantActive(true);
      }
    }
  }, []);

  const fetchInboxData = async (inboxType, setReadState) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}inbox/list?inbox_type=${inboxType}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const unreadCount = res.data.body.detail.filter(item => item.is_read === 0).length;
      setReadState(unreadCount);
      // setReadState(res.data.body.detail);
    } catch (error) {
      Error401(error, router);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInboxData("donator", setIsReadDonatur);
    fetchInboxData("detonator", setIsReadDetonator);
    fetchInboxData("merchant", setIsReadMerchant);
  }, [selectedStatus]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}inbox/list?inbox_type=donator`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.body.detail;

        data.sort((a, b) => b.value - a.value);

        setSelectedStatus("donator");
        setDataApi(data);
        setDataInbox(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Error401(error, router);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (status) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    setLoading(true);
    let url = "";

    switch (status) {
      case "donator":
        url = `${process.env.NEXT_PUBLIC_API_BASE_URL}inbox/list?inbox_type=donator`;
        break;
      case "detonator":
        url = `${process.env.NEXT_PUBLIC_API_BASE_URL}inbox/list?inbox_type=detonator`;
        break;
      case "merchant":
        url = `${process.env.NEXT_PUBLIC_API_BASE_URL}inbox/list?inbox_type=merchant`;
        break;
      default:
        console.error("Invalid status");
        setLoading(false);
        return;
    }

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data.body.detail;
        setDataApi(data);
        setDataInbox(data);
        setLoading(false);
      })
      .catch((error) => {
        setDataApi([]);
        setDataInbox([]);
        Error401(error, router);
        setLoading(false);
      })

    setSelectedStatus(status);
  };

  return (
    <>
      <div className="container mx-auto h-screen overflow-hidden max-w-480 bg-white flex flex-col">
        <div className="bg-white h-screen">
          {/* <SearchBar /> */}
          <div className="flex items-center justify-center px-6 py-4">
            <h1 className="text-xl font-bold">Inbox</h1>
          </div>

          <div className="flex flex-row px-6 py-4 justify-between items-end">
            {donaturActive ? (
              <div className="px-2 w-full">
                <div
                  className={`cursor-pointer text-center border border-t-0 border-x-0 font-semibold text-lg ${selectedStatus === "donator"
                    ? "text-primary border-b-primary"
                    : "text-gray-500 border-b-transparent"
                    }`}
                  onClick={() => handleFilterChange("donator")}
                >
                  <div className="flex relative justify-center items-center">
                    <span>Donator</span>
                    {isReadDonatur === 0 ? null : <div className="w-[20px] h-[20px] rounded-full text-[12px] text-white bg-red-500 absolute top-0 right-0 flex justify-center items-center">
                      {isReadDonatur}
                    </div>}

                  </div>
                </div>
              </div>

            ) : null}

            {detonatorActive ? (
              <div className="px-2 w-full">

                <div
                  className={`cursor-pointer text-center border border-t-0 border-x-0 font-semibold text-lg ${selectedStatus === "detonator"
                    ? " text-primary text-center border-b-primary"
                    : "cursor-pointer text-center text-gray-500  border-b-transparent"
                    }`}
                  onClick={() => handleFilterChange("detonator")}
                >
                  <div className="flex relative justify-center items-center">
                    <span>Volunteer</span>
                    {isReadDetonator === 0 ? null : <div className="w-[20px] h-[20px] rounded-full text-[12px] text-white bg-red-500 absolute top-0 right-0 flex justify-center items-center">
                      {isReadDetonator}
                    </div>}

                  </div>
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
                  <div className="flex relative justify-center items-center">
                    <span>Merchant</span>
                    {isReadMerchant === 0 ? null : <div className="w-[20px] h-[20px] rounded-full text-[12px] text-white bg-red-500 absolute top-0 right-0 flex justify-center items-center">
                      {isReadMerchant}
                    </div>}

                  </div>
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
            <div className={`overflow-auto h-screen px-1 pb-[300px]`}>
              {DataInbox.length > 0 ? (
                DataInbox.map((inboxData) => (
                  <CardInbox DataInbox={inboxData} key={inboxData.id} />
                ))
              ) : (
                <div className="flex justify-center items-center h-[326px] text-center font-semibold text-[#D9D9D9] text-[16px]">
                  No Data
                </div>
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
