
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import moment from "moment/moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MenuBarMechant from "./MenuBarMechant";
import CardKupon from "./CardKupon";

const Kupon = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dataApi, setDataApi] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("reserved");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const status = localStorage.getItem("status");
    const id = localStorage.getItem("id");
    localStorage.removeItem("imgPenerima");
    localStorage.removeItem("imgMakanan");

    if (
      !role ||
      !token ||
      role !== "merchant" ||
      status !== "approved" ||
      !id
    ) {
      // Redirect to login if either role or token is missing or role is not 'detonator' or status is not 'approved'
      localStorage.clear();
      router.push("/login");
    } else {
      // Role is 'detonator' and token is present
      setLoading(false); // Set loading to false once the check is complete
    }
  }, [router]);

  useEffect(() => {
    const merchant_id = localStorage.getItem("id");
    console.log("merchant_id", merchant_id);
    if (selectedStatus === "reserved") {
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}coupon/filter?merchant_id=${merchant_id}&status=reserved`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((response) => {
        setFilteredData(response.data.body);
        setDataApi(response.data.body);
        setLoading(false);
      })
        .catch((error) => {
          Error401(error, router);
        });

    } else if (selectedStatus === "active") {
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}coupon/filter?merchant_id=${merchant_id}&status=active`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((response) => {
        setFilteredData(response.data.body);
        setDataApi(response.data.body);
        setLoading(false);
      })
        .catch((error) => {
          Error401(error, router);
        });

    } else if (selectedStatus === "claimed") {
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}coupon/filter?merchant_id=${merchant_id}&status=claimed`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((response) => {
        setFilteredData(response.data.body);
        setDataApi(response.data.body);
        setLoading(false);
      })
        .catch((error) => {
          Error401(error, router);
        });

    } else {

    }

  }, [selectedStatus]);


  const handleFilterChange = (status = "reserved") => {
    setLoading(true);
    console.log(status);
    setSelectedStatus(status);
  };

  return (
    <>
      <div className="container mx-auto overflow-hidden h-screen">
        <MenuBarMechant />
        <div className="grid grid-cols-3 gap-2 px-7 pt-4 pb-2">
          <div
            className={`w-full cursor-pointer pb-2 text-sm font-medium text-center ${selectedStatus === "reserved"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
              }`}
            onClick={() => handleFilterChange("reserved")}
          >
            <span>Permintaan Klaim</span>
          </div>
          <div
            className={`w-full cursor-pointer pb-2 text-sm font-medium text-center ${selectedStatus === "active"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
              }`}
            onClick={() => handleFilterChange("active")}
          >
            <span>Laporkan Kupon</span>
          </div>
          <div
            className={`w-full cursor-pointer pb-2 text-sm font-medium text-center ${selectedStatus === "claimed"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
              }`}
            onClick={() => handleFilterChange("claimed")}
          >
            <span>Kupon <br />Selesai</span>
          </div>
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
          <div className={`overflow-auto h-screen px-1 pb-[400px]`}>

            {loading || filteredData.length == 0 ? (
              <p className="text-gray-400  flex justify-center items-center">
                {selectedStatus === "reserved"
                  ? "Tidak Ada Pesanan"
                  : selectedStatus === "diproses"
                    ? "Tidak Ada Pesanan Berlangsung"
                    : selectedStatus === "active" && "Tidak Ada Pesanan Selesai"}
              </p>
            ) : (
              filteredData.map((data) => (
                <CardKupon
                  key={data.id}
                  // to={data.order_status === "reserved" ? `/merchant/scan-kupon/${data.id}` : data.order_status === "approved" ? `/merchant/pesanan/${data.id}` : "/"}

                  idOrder={data.id}
                  img={
                    `${process.env.NEXT_PUBLIC_URL_STORAGE}${data.merchant_product?.images[0]}`

                  }
                  title={data.merchant_product?.name}
                  desc={data.merchant_product?.description}
                  date={moment(data.expired_at).format('DD MMMM YYYY HH:mm:ss [WIB]')}
                  name_beneficiary={data.beneficiary?.fullname}
                  qty={data.qty}
                  price={data.merchant_product?.price}
                  status={data.status}
                  // status={data.order_status}
                  total_amount={data?.total_amount}
                  setLoading={setLoading}
                />
              ))
            )}
          </div>
        )}
      </div>
      {loading && <Loading />}
    </>
  );
};

export default Kupon;
