import styles from "@/styles/Campaign.module.css";
import { IconCaretDown, IconCaretUp } from "@tabler/icons-react";
import moment from "moment/moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const CardReport = ({ data }) => {
  const router = useRouter();
  const { id } = router.query;
  const [showFullText, setShowFullText] = useState(false);
  const toggleReadMore = () => {
    setShowFullText((prevShowFullText) => !prevShowFullText);
  };
  return (
    <div className="block m-2 bg-white rounded-lg hover:shadow-md border">
      <div className="flex p-2 ">
        <div className="w-1/3 mr-2">
          <img
            src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${data.images[0]?.image_url}`}
            className={`rounded-lg object-cover ${styles.img_card}`}
            alt=""
          />
        </div>
        <div className="w-full flex flex-col justify-between">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <h5 className="text-sm font-bold tracking-tight text-gray-900">{` ${data.title}`}</h5>
              <h5 className="text-xs font-normal tracking-tight text-gray-900">
                Merchant Name
              </h5>
            </div>
            <div className="h-4 p-2 bg-primary text-white rounded-xl items-center flex justify-center">
              <p className="text-xs mb-0.5">Completed</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            {moment(data.created_at).format("MM/DD/YYYY hh:mm")}
          </p>
          <p className="font-normal text-gray-700 text-xs">
            {data.description}
          </p>
          {/* <p
            className={`font-normal text-gray-700 text-xs  ${
              showFullText ? "" : styles.report_truncate
            }`}
          >
            {data.description}
          </p> */}
          {/* <div className="bg-white hover:bg-gray-100 w-full grid place-content-center rounded-sm text-primary text-xs mt-2">
            <button className="flex" onClick={toggleReadMore}>
              Selengkapnya{" "}
              {showFullText ? (
                <IconCaretUp size={20} />
              ) : (
                <IconCaretDown size={20} />
              )}
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CardReport;
