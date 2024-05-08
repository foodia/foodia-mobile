import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

const CardPesanan = (props) => {
  const router = useRouter();
  const { to, img, title, productName, total_amount, date, status, qty } =
    props;

  const formatPrice = (price) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

    return formatter.format(price);
  };

  const Card = () => {
    return (
      <div className="flex justify-between items-center w-80">
        {!title ? (
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-md bg-slate-200 h-16 w-16"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start w-full p-1">
            <img
              src={img}
              className={`grid grid-cols-3 gap-4 place-items-end text-gray-500 rounded-lg object-cover ${styles.img_card}`}
              alt=""
            />
            <div className="text-left ml-2 w-full flex flex-col justify-between min-h-[105px]">
              <p className="text-primary font-bold text-md capitalize">
                {title}
              </p>

              <div className="flex flex-col gap-1 italic">
                <div className="flex flex-row gap-1">
                  <p className="font-normal text-[11px] text-black">
                    Tanggal Campaign:{" "}
                  </p>{" "}
                  <p className="font-medium text-[11px] text-black">{date}</p>
                </div>
              </div>
              <div className="flex items-end justify-between mt-2">
                <div className="flex flex-col">
                  <p className="font-normal text-xs italic">{`${qty} x ${productName}`}</p>
                  <span className="text-[#6CB28E] font-bold text-xl">
                    {formatPrice(total_amount)}
                  </span>
                </div>
                <div
                  className={`flex justify-center items-center rounded-2xl mb-1 w-auto h-5 px-2 py-0 ${
                    status === "approved" ? "bg-[#1D5882]" : "bg-[#F6BE2D]"
                  }`}
                >
                  <p className="text-gray-100 font-medium text-[10px]">
                    {status === "approved" ? "Approved" : "Confirmation"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex justify-center mt-1 w-full mb-2 items-center">
      {router.pathname === "/merchant/pesanan" ? (
        <Link
          href={to}
          className={`bg-white flex hover:bg-gray-100 text-black rounded-2xl items-center border-[1.5px] border-primary shadow-lg w-80 p-1`}
        >
          <Card />
        </Link>
      ) : (
        <div
          className={`bg-white flex  text-black rounded-2xl items-center border-[1.5px] border-primary shadow-lg w-80 p-1`}
        >
          <Card />
        </div>
      )}
    </div>
  );
};

export default CardPesanan;
