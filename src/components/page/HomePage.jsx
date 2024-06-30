import styles from "@/styles/Home.module.css";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import CardCampaign from "../CardCampaign";
import Error401 from "../error401";

const HomePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [DataCamp, setDataCamp] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("OPEN");

  useEffect(() => {
    if (localStorage.getItem("prevPath") === "payment_reciept") {
      localStorage.removeItem("prevPath");
    }
  });

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?campaign_status=OPEN&pagesize=10000000`,
        {
          headers: {
            Authorization: `Bearer`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        const approvedCampaigns = response.data.body.filter(
          (campaign) => campaign.status === "approved"
        );
        setDataCamp(approvedCampaigns);
      })
      .catch((error) => {
        setLoading(false);
        Error401(error, router);
      });
  }, []);

  const handleFilterChange = (status) => {
    setLoading(true);
    setSelectedStatus(status);
    if (status === "OPEN") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?campaign_status=${status}&pagesize=10000000`
        )
        .then((response) => {
          setDataCamp(response.data.body);
          setLoading(false);
        })
        .catch((error) => {
          Error401(error, router);
        });
    } else if (status === "INPROGRESS") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?campaign_status=${status}&pagesize=10000000`
        )
        .then((response) => {
          setDataCamp(response.data.body);
          setLoading(false);
        })
        .catch((error) => {
          Error401(error, router);
        });
    } else if (status === "FINISHED") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?campaign_status=${status}&pagesize=10000000`
        )
        .then((response) => {
          setDataCamp(response.data.body);
          setLoading(false);
        })
        .catch((error) => {
          Error401(error, router);
        });
    }
  };

  return (
    <>
      <div className="bg-white overflow-hidden">
        {/* <SearchBar /> */}
        <div className="flex items-center justify-center px-6 my-2">
          <div className="bg-gray-100 rounded-xl py-2 w-full">
            <div className="flex justify-around gap-5 px-1 py-3 text-[12px] font-lato">
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
                <p className=" text-gray-500 dark:text-gray-400">Relawan</p>
              </Link>
              <Link
                href={"/merchant"}
                className="grid gap-2 justify-items-center w-24"
              >
                <div className={`${styles.iconMenu}`}>
                  <Image
                    sizes="100%"
                    src={"/img/icon/store.png"}
                    alt="Girl in a jacket"
                    width={30}
                    height={30}
                  />
                </div>
                <p className=" text-gray-500 dark:text-gray-400">UMKM</p>
              </Link>
              <Link href={"/beneficiaries"} className="grid gap-2 justify-items-center w-24">
                <div className={`${styles.iconMenu}`}>
                  <Image
                    src={"/img/icon/icon_camp_terdekat.png"}
                    alt="Girl in a jacket"
                    width={30}
                    height={30}
                  />
                </div>
                <p className=" text-gray-500 dark:text-gray-400">Makan Gratis</p>
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
        <div className="flex flex-row px-6 py-4 justify-between items-end w-full">
          <div
            className={`cursor-pointer px-0 pb-3 w-36 ${selectedStatus === "OPEN"
              ? "text-primary text-center border border-t-0 border-x-0 border-b-primary"
              : "cursor-pointer text-center text-gray-500 border border-t-0 border-x-0 border-b-transparent"
              }`}
            onClick={() => handleFilterChange("OPEN")}
          >
            <span>Yuk Berdonasi</span>
          </div>
          <div
            className={`cursor-pointer text-center${selectedStatus === "INPROGRESS"
              ? " text-primary text-center border border-t-0 border-x-0 border-b-primary"
              : "cursor-pointer text-center text-gray-500 border border-t-0 border-x-0 border-b-transparent"
              }`}
            onClick={() => handleFilterChange("INPROGRESS")}
          >
            <span>Campaign Berjalan</span>
          </div>
          <div
            className={`cursor-pointer text-center ${selectedStatus === "FINISHED"
              ? "text-primary text-center border border-t-0 border-x-0 border-b-primary"
              : "cursor-pointer text-center text-gray-500 border border-t-0 border-x-0 border-b-transparent"
              }`}
            onClick={() => handleFilterChange("FINISHED")}
          >
            <span>Campaign Selesai</span>
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
          <div className={`overflow-auto h-screen px-1 pb-[400px]`}>
            {DataCamp.map((campData) => {
              return (
                <CardCampaign
                  from={"home"}
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
