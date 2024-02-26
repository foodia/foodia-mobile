import styles from "@/styles/Home.module.css";
import Image from "next/image";
import { IconBuildingStore, IconCirclePlus } from "@tabler/icons-react";
import CardCampaign from "../CardCampaign";
import SlideCard from "../SlideCard";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import SearchBar from "../SearchBar";

const HomePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dataApi, setDataApi] = useState([]);
  const [DataCamp, setDataCamp] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?campaign_status=OPEN`,
          {
            headers: {
              Authorization: `Bearer`,
            },
          }
        );

        const approvedCampaigns = response.data.body.filter(
          (campaign) => campaign.status === "approved"
        );
        console.log("page home data", approvedCampaigns);
        setSelectedStatus("OPEN");
        setDataApi(approvedCampaigns);
        setDataCamp(approvedCampaigns);
        setLoading(false);

        if (approvedCampaigns.length === 0) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (status) => {
    let filtered = [];

    setLoading(true);
    if (status === "OPEN") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?campaign_status=${status}`
        )
        .then((response) => {
          setDataApi(response.data.body);
          setDataCamp(response.data.body);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else if (status === "INPROGRESS") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?campaign_status=${status}`
        )
        .then((response) => {
          setDataApi(response.data.body);
          setDataCamp(response.data.body);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else if (status === "FINISHED") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?campaign_status=${status}`
        )
        .then((response) => {
          setDataApi(response.data.body);
          setDataCamp(response.data.body);
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
      <div className="bg-white h-screen">
        <SearchBar />
        <div className="flex items-center justify-center px-6 my-2">
          <div className="bg-gray-100 rounded-xl py-2">
            <div className="flex justify-between gap-5 px-1 py-3">
              <Link
                href={"/detonator"}
                className="grid gap-2 justify-items-center w-24"
              >
                <div className={`${styles.iconMenu}`}>
                  <Image
                    src={"/icon/campaint.png"}
                    alt="Girl in a jacket"
                    width={30}
                    height={30}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Relawan
                </p>
              </Link>
              <Link
                href={"/merchant"}
                className="grid gap-2 justify-items-center w-24"
              >
                <div className={`${styles.iconMenu}`}>
                  <IconBuildingStore />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">UMKM</p>
              </Link>
              <Link
                href={"/merchant"}
                className="grid gap-2 justify-items-center w-24"
              >
                <div className={`${styles.iconMenu}`}>
                  <Image
                    src={"/img/icon/icon_camp_terdekat.png"}
                    alt="Girl in a jacket"
                    width={30}
                    height={30}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Terdekat
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* <div className={`px-6 flex my-2  ${styles.slide_card}`}>
          <SlideCard
            to={"/campaign/1"}
            img="/img/card/rectangle_70.png"
            title="Makanan Untuk Semua"
            address="Bersama-sama Kita Bisa Mengakhiri Kelaparan."
            date="30/10/2022"
            status="Pending"
          />
          <SlideCard
            to={"/campaign/1"}
            img="/img/card/rectangle_70.png"
            title="TEBAR 1000 PAKET NASI JUMAT BERKAH"
            address="Kav Barokah, Gg. Ceria I, Bahagia, Kec. Babelan, Kabupaten Bekasi, Jawa Barat 17121"
            date="30/10/2022"
            status="Approved"
          />
          <SlideCard
            to={"/campaign/1"}
            img="/img/card/rectangle_70.png"
            title="TEBAR 1000 PAKET NASI JUMAT BERKAH"
            address="Kav Barokah, Gg. Ceria I, Bahagia, Kec. Babelan, Kabupaten Bekasi, Jawa Barat 17121 ppppppppppppppppppppppppppppppppppppppp"
            date="30/10/2022"
            status="Rejected"
          />

          <SlideCard
            to={"/campaign/1"}
            img="/img/card/rectangle_70.png"
            title="TEBAR 1000 PAKET NASI JUMAT BERKAH"
            address="Kav Barokah, Gg. Ceria I, Bahagia, Kec. Babelan, Kabupaten Bekasi, Jawa Barat 17121"
            date="30/10/2022"
            status="Approved"
          />
        </div> */}
        <div className="flex flex-row px-6 py-4 justify-between items-end">
          <div
            className={`cursor-pointer px-0 pb-3 w-36 ${
              selectedStatus === "OPEN"
                ? "text-primary text-center w-36 border pb-3 border-t-0 border-x-0 border-b-primary"
                : "cursor-pointer text-center text-gray-500"
            }`}
            onClick={() => handleFilterChange("OPEN")}
          >
            <span>Yuk Berdonasi</span>
            {/* <div
                className={`w-12 h-0.5 ${
                  selectedStatus === "OPEN"
                    ? "bg-blue-500 bg-blue-500 w-32 "
                    : "bg-black"
                }`}
              ></div> */}
          </div>
          <div
            className={`cursor-pointer text-center${
              selectedStatus === "INPROGRESS"
                ? " text-primary text-center w-36 border border-t-0 border-x-0 border-b-primary"
                : "cursor-pointer text-center text-gray-500"
            }`}
            onClick={() => handleFilterChange("INPROGRESS")}
          >
            <span>Campaign Berjalan</span>
            {/* <div
                className={`w-32 h-0.5 ${
                  selectedStatus === "INPROGRESS"
                    ? "bg-blue-500 bg-blue-500 w-32 "
                    : "bg-black"
                }`}
              ></div> */}
          </div>
          <div
            className={`cursor-pointer text-center ${
              selectedStatus === "FINISHED"
                ? "text-primary text-center w-36 border border-t-0 border-x-0 border-b-primary"
                : "cursor-pointer text-center text-gray-500"
            }`}
            onClick={() => handleFilterChange("FINISHED")}
          >
            <span>Campaign Selesai</span>
            {/* <div
                className={`w-32 h-0.5 ${
                  selectedStatus === "FINISHED"
                    ? "bg-blue-500 bg-blue-500 w-32 "
                    : "bg-black"
                }`}
              ></div> */}
          </div>

          {/* <div className="mr-2 grid justify-items-center"><span className="text-blue-500">Yuk Berdonasi</span>
                            <div className="bg-blue-500 w-32 h-0.5 mt-2"></div>
                        </div>
                        <div className="mr-2 grid justify-items-center"><span className="e25_212">Campaign Berjalan </span>
                            <div className="bg-black w-32 h-0.5 mt-2"></div>
                        </div>
                        <div className="mr-2 grid justify-items-center"><span className="e25_212">Campaign Selesai </span>
                            <div className="bg-black w-32 h-0.5 mt-2"></div>
                        </div> */}
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
          <div className={`pb-28 ${styles.card}`}>
            {DataCamp.map((campData) => {
              // console.log(`Key: ${dataFilter.id}`);
              return (
                <CardCampaign
                  to={`/campaign/${campData.id}`}
                  img={`${process.env.NEXT_PUBLIC_URL_STORAGE}${campData.image_url}`}
                  title={campData.event_name}
                  address={campData.address}
                  date={campData.event_date}
                  status={campData.status}
                  donation_target={campData.donation_target}
                  donation_collected={campData.donation_collected}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
