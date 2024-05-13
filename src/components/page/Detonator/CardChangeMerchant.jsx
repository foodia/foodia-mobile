import styles from "@/styles/Home.module.css";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const CardChangeMerchant = ({ data, order_id, id_camp }) => {
  const router = useRouter();
  const [showFullText, setShowFullText] = useState(false);
  const toggleReadMore = () => {
    setShowFullText((prevShowFullText) => !prevShowFullText);
  };

  const handleLink = (IdMerchan) => {
    router.push(
      `/detonator/ganti-menu?id=${IdMerchan}&name=${data.merchant_name}&ord=${order_id}&cmp=${id_camp}&step=3`
    );
  };
  const products = data.products;

  // Filter products by status "approved"
  const approvedProducts = products.filter(product => product.status === "approved");

  // Count the number of approved products
  const numberOfApprovedProducts = approvedProducts.length;


  return (
    <div className="flex justify-center mt-1 w-full mb-2 ">
      <div
        onClick={() => handleLink(data.id)}
        href={"#"}
        className={`bg-white cursor-pointer hover:bg-gray-100 text-black rounded-lg inline-flex items-center  ${styles.item_card}`}
      >
        <div className="flex justify-between w-80">
          <div className="flex p-1">
            <img
              src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${data.self_photo}`}
              className={`grid grid-cols-3 gap-4 place-items-end text-gray-500 rounded-lg object-cover ${styles.img_card}`}
              alt=""
            />
            <div className={`text-left ml-1 ${styles.text_card}`}>
              <p className="mb-1 text-black font-sans font-semibold text-sm truncate">
                {data.merchant_name}
              </p>
              <div className="flex ">
                {/* <p className="font-sans text-xs text-gray-500 mr-2">{`${data.address}, ${data.city}, ${data.province}`}</p> */}
                <p
                  className={`font-sans text-xs text-gray-500 mr-2   ${showFullText ? "" : styles.cutTextCard
                    }`}
                >
                  {`${data.address}, ${data.city}, ${data.province}`}
                </p>
              </div>
              <div className="">
                {showFullText ? (
                  <button className="flex bg-white text-primary text-xs mt-2 w-full items-center justify-center rounded-lg mb-1" onClick={(e) => {
                    e.stopPropagation();
                    toggleReadMore();
                  }}>
                    <p>Lebih Sedikit</p>
                    <IconChevronUp size={20} />
                  </button>
                ) : (
                  <button className="flex bg-white text-primary text-xs mt-2 w-full items-center justify-center rounded-lg mb-1" onClick={(e) => {
                    e.stopPropagation();
                    toggleReadMore();
                  }}>
                    <p>Selengkapnya</p>
                    <IconChevronDown size={20} />
                  </button>
                )}
              </div>
              {/* <p className="font-sans text-xs text-gray-500 mr-2 mt-2">{`Jumlah Menu :${numberOfApprovedProducts}`}</p>
              <div class="flex items-center">
                <svg
                  class="w-4 h-4 text-yellow-300 me-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
                <svg
                  class="w-4 h-4 text-yellow-300 me-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
                <svg
                  class="w-4 h-4 text-yellow-300 me-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
                <svg
                  class="w-4 h-4 text-yellow-300 me-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
                <svg
                  class="w-4 h-4 text-gray-300 me-1 dark:text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
                <p class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  4.95
                </p>
                <p class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  out of
                </p>
                <p class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  5
                </p>
              </div> */}
            </div>
          </div>
          <div className="grid place-items-center"></div>
        </div>
      </div>
    </div>
  );
};

export default CardChangeMerchant;
