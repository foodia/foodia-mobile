import styles from "@/styles/Home.module.css";
import {
  IconBuildingStore,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Store from "../../../../public/icon/Store.png";

const CardListMerchan = ({ data }) => {
  const router = useRouter();
  const [showFullText, setShowFullText] = useState(false);
  const toggleReadMore = () => {
    setShowFullText((prevShowFullText) => !prevShowFullText);
  };
  const address = `${data.address}, ${data.city}, ${data.province}`;

  const handleLink = (IdMerchan) => {
    // console.log('IdMerchan', IdMerchan);
    router.push(
      `creatcampaign?step=4&id=${IdMerchan}&name=${data.merchant_name}`
    );
    console.log("data card", data.products);
  };
  const products = data.products;

  // Filter products by status "approved"
  const approvedProducts = products.filter(
    (product) => product.status === "approved"
  );

  // Count the number of approved products
  const numberOfApprovedProducts = approvedProducts.length;

  console.log("Number of approved products:", numberOfApprovedProducts);

  // console.log('data', data.products.length);
  return (
    <div className="flex justify-center mt-1 w-full mb-2 ">
      <div
        onClick={() => handleLink(data.id)}
        href={"#"}
        className={`bg-white cursor-pointer py-2 border border-primary hover:bg-gray-100 text-black rounded-lg inline-flex ${styles.item_card}`}
      >
        <div className="w-full px-2">
          <div className="flex flex-row justify-between p-1 items-start">
            {/* <img
              src={Store}
              className={`grid grid-cols-3 gap-4 place-items-end text-gray-500 rounded-lg object-cover ${styles.img_card}`}
              alt=""
            /> */}
            <IconBuildingStore
              size="70px"
              className="flex items-center justify-center bg-green-200 rounded-lg p-2"
            />
            <div className={`text-left ml-1 ${styles.text_card}`}>
              <p className="mb-1 text-primary font-sans font-semibold text-sm truncate">
                {data.merchant_name}
              </p>
              <div className="flex ">
                {/* <p className="font-sans text-xs text-gray-500 mr-2">{`${data.address}, ${data.city}, ${data.province}`}</p> */}
                <p
                  className={`font-sans text-xs text-gray-500   ${
                    showFullText ? "" : styles.cutTextCard
                  }`}
                >
                  {address}
                </p>
              </div>
              {showFullText ? (
                <button
                  className="justify-end items-center text-xs py-1 text-primary w-full flex flex-row"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleReadMore();
                  }}
                >
                  <p>Lebih Sedikit</p>
                  <IconChevronUp size={20} />
                </button>
              ) : address.length > 80 ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleReadMore();
                  }}
                  className="justify-end items-center text-xs py-1 text-primary w-full flex flex-row"
                >
                  Selengkapnya{" "}
                  <IconChevronDown className="mt-0.5" size="15px" />
                </button>
              ) : (
                ""
              )}
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

export default CardListMerchan;
