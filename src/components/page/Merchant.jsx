import styles from "@/styles/Home.module.css";
import { IconCirclePlus } from "@tabler/icons-react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import CardFood from "../CardFood";
import Error401 from "../error401";
import MenuBarMechant from "./Merchant/MenuBarMechant";

const Merchant = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dataApi, setDataApi] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("approved");
  // const [cekData, setCekData] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const getMenus = (id, token) => {
    axios
      .get(
        process.env.NEXT_PUBLIC_API_BASE_URL +
        `merchant-product/filter?merchant_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setDataApi(response.data.body);
        const filtered = response.data.body.filter(
          (data) => data.status === "approved"
        );
        setFilteredData(filtered);

        setLoading(false);

        if (response.data.body.length === 0) {
          setHasMore(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching data:", error);

        if (error.response && error.response.status === 401) {
          // Unauthorized error (e.g., token expired)
          localStorage.clear();
          router.push("/login");
        }
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id_merchant = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Akses Dibatasi",
        text: ` Mohon untuk login kembali menggunakan akun Merchant.`,
        showConfirmButton: true,
        confirmButtonText: "Login",
        confirmButtonColor: "green",
        showCancelButton: true,
        cancelButtonText: "Tutup",
        cancelButtonColor: "red",
        // timer: 2000,
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        } else if (result.isDismissed) {
          router.push("/home");
        }
      });
    } else {
      if (id_merchant) {
        localStorage.setItem("id", id_merchant);
        localStorage.setItem("role", "merchant");
        localStorage.setItem("status", 'approved');
        localStorage.setItem("note", 'approved');
        getMenus(id_merchant, token);
      } else {
        axios
          .get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/check-register-status`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            const cekData = response.data.body;
            if (!cekData.merchant) {
              Swal.fire({
                icon: "warning",
                title: "Akun Belum Terdaftar sebagai Merchant",
                text: "Mohon untuk registrasi sebagai Merchant",
                showConfirmButton: true,
                confirmButtonColor: "green",
                confirmButtonText: "Registrasi",
                showCancelButton: true,
                cancelButtonColor: "red",
                cancelButtonText: "Tutup",
                // timer: 2000,
              }).then((result) => {
                if (result.isConfirmed) {
                  router.push("/merchant/syarat");
                } else if (result.isDismissed) {
                  router.push("/home");
                }
              });
            } else {
              if (cekData.merchant.status == "waiting") {
                localStorage.setItem("id", cekData.merchant.merchant_id);
                localStorage.setItem("role", "merchant");
                localStorage.setItem("status", cekData.merchant.status);
                localStorage.setItem("note", cekData.merchant.note);

                Swal.fire({
                  icon: "warning",
                  title: "Akun Merchant Anda Belum Terverifikasi",
                  text: ` Mohon tunggu konfirmasi dari admin kami`,
                  showConfirmButton: false,
                  showCancelButton: true,
                  cancelButtonColor: "red",
                  cancelButtonText: "Tutup",
                }).then((result) => {
                  if (result.isDismissed) {
                    router.push("/home");
                  }
                });
              } else if (cekData.merchant.status == "rejected") {
                setLoading(false);
                localStorage.setItem("id", cekData.merchant.merchant_id);
                localStorage.setItem("role", "merchant");
                localStorage.setItem("status", cekData.merchant.status);
                localStorage.setItem("note", cekData.merchant.note);
                Swal.fire({
                  icon: "warning",
                  title: "Merchant Ditolak",
                  text: `${cekData.merchant.note}`,
                  showConfirmButton: false,
                  timer: 2000,
                });
                setTimeout(() => {
                  router.push("/merchant/edit");
                }, 2000);
              } else {
                localStorage.setItem("id", cekData.merchant.merchant_id);
                localStorage.setItem("role", "merchant");
                localStorage.setItem("status", cekData.merchant.status);
                localStorage.setItem("note", cekData.merchant.note);
                getMenus(cekData.merchant.merchant_id, token);
              }
            }
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              Error401(error, router);
            }
          });
      }

    }
  }, []);

  // useEffect(() => {

  // }, []);

  const handleFilterChange = (status) => {
    let filtered = [];

    if (status === "listMenu") {
      // Show items with 'waiting' or 'rejected' status
      filtered = dataApi.filter(
        (data) => data.status === "waiting" || data.status === "rejected"
      );
    } else {
      // Show items with the selected status
      filtered = dataApi.filter((data) => data.status === status);
    }

    setSelectedStatus(status);
    setFilteredData(filtered);
  };

  return (
    <>
      <div className="container mx-auto h-screen overflow-hidden">
        <MenuBarMechant />
        <div className="flex justify-between px-7 pt-4 pb-2">
          <div
            className={`w-full cursor-pointer grid pb-2 text-sm font-medium justify-items-center ${selectedStatus === "approved"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
              }`}
            onClick={() => handleFilterChange("approved")}
          >
            <span>Menu</span>
          </div>
          <div
            className={`w-full cursor-pointer grid pb-2 text-sm font-medium justify-items-center ${selectedStatus === "listMenu"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
              }`}
            onClick={() => handleFilterChange("listMenu")}
          >
            <span>Pengajuan</span>
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
            {filteredData.length == 0 ? (
              <p className="text-gray-400 flex justify-center items-center">
                {selectedStatus === "approved"
                  ? "Belum Ada Menu"
                  : "Tidak Ada Pengajuan"}
              </p>
            ) : (
              <>
                {filteredData.map((data) => (
                  <CardFood
                    key={data.id}
                    to={`/product/${data.id}`}
                    img={
                      data.images.length > 0
                        ? `${process.env.NEXT_PUBLIC_URL_STORAGE}${data.images[0].image_url}`
                        : "/img/default-image.png"
                    }
                    title={data.name}
                    description={data.description}
                    date={data.created_at}
                    status={data.status}
                    qty={data.qty}
                    price={data.price}
                    images={data.images}
                    idProduct={data.id}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Merchant;
