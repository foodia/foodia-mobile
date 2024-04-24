import Link from "next/link";

const CardInbox = ({ status, title, desc, url }) => {
    return (
        <div className="flex items-center justify-center pb-2">
            <Link href={url} className="flex flex-col w-full max-w-[320px] leading-1.5 p-2 border-primary border-2 bg-white rounded-lg shadow-[0px_0px_8px_0px_#00000024]">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-black">{status}</span>
                </div>
                <p className="text-sm font-normal text-gray-900">{title}</p>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{desc}</span>
            </Link>
        </div>
    );
}

export default CardInbox;
