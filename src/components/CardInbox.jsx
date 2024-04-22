import Link from "next/link";

const CardInbox = ({ status, title, desc, url }) => {
    return (
        <Link href={url} className="flex items-center justify-center pb-2">
            <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-2 border-primary border-2 bg-white rounded-e-xl rounded-es-xl">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-black">{status}</span>
                </div>
                <p className="text-sm font-normal text-gray-900">{title}</p>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{desc}</span>
            </div>
        </Link>
    );
}

export default CardInbox;
