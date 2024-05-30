import { useEffect, useState } from "react";
import { IconClock } from "@tabler/icons-react";

const Time = () => {
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const [Waktu, setWaktu] = useState("");

    useEffect(() => {
        const storedFormData = localStorage.getItem("formData");
        const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
        const savedHour = parsedFormData.Waktu ? parsedFormData.Waktu.split(':')[0] : '';
        const savedMinute = parsedFormData.Waktu ? parsedFormData.Waktu.split(':')[1] : '';
        setHour(savedHour);
        setMinute(savedMinute);
        setWaktu(parsedFormData.Waktu || "");
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const storedFormData = localStorage.getItem("formData");
            const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
            setWaktu(parsedFormData.Waktu || "");
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const handleHourChange = (e) => {
        const selectedHour = e.target.value.padStart(2, '0');
        setHour(selectedHour);
        localStorage.setItem("formData", JSON.stringify({ Waktu: `${selectedHour}:${minute}` }));
    };

    const handleMinuteChange = (e) => {
        const selectedMinute = e.target.value.padStart(2, '0');
        setMinute(selectedMinute);
        localStorage.setItem("formData", JSON.stringify({ Waktu: `${hour}:${selectedMinute}` }));
    };

    const hourOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    const minuteOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

    return (
        <div className="">
            <div className="flex flex-row items-center p-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none my-2">
                <IconClock />
                <select
                    onChange={handleHourChange}
                    value={hour}
                    name="Hour"
                    className="text-black text-[12px] py-4 px-2 bg-transparent appearance-none focus:border-none ml-2 text-center"
                    required
                >
                    <option value="" disabled>--</option>
                    {hourOptions.map(h => (
                        <option key={h} value={h}>{h}</option>
                    ))}
                </select>
                <span className="">:</span>
                <select
                    onChange={handleMinuteChange}
                    value={minute}
                    name="Minute"
                    className="text-black text-[12px] py-4 px-2 bg-transparent appearance-none focus:border-none  text-center"
                    required
                >
                    <option value="" disabled>--</option>
                    {minuteOptions.map(m => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
            </div>
            <p>Waktu: {Waktu}</p>
        </div>
    );
};

export default Time;
