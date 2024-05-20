// Tes.jsx
import CompressImage from "@/components/CompressImage";
import { IconClock } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import TimePicker from "react-time-picker";
import 'react-time-picker/dist/TimePicker.css';
import style from "../styles/TimePicker.module.css";

const Tes = () => {
    const [foto, setFoto] = useState(null);
    const [ukuran, setUkuran] = useState(null);
    const [ukuranAsli, setUkuranAsli] = useState(null);
    const [value, onChange] = useState('10:00');
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');

    const handleWaktuChange = () => {
        if (hour !== '' && minute !== '') {
            onChange(`${hour}:${minute}`);
        }
    };
    useEffect(() => {
        handleWaktuChange();
        console.log(foto);
        console.log('hh', hour, 'mm', minute);
    }, [hour, minute]);


    const handleHourChange = (e) => setHour(e.target.value);
    const handleMinuteChange = (e) => setMinute(e.target.value);

    const generateHourOptions = () => {
        const hours = [];
        for (let h = 1; h <= 22; h++) {
            const hour = h.toString().padStart(2, '0');
            hours.push(hour);
        }
        return hours;
    };

    const generateMinuteOptions = () => {
        const minutes = [];
        for (let m = 0; m < 60; m++) {
            const minute = m.toString().padStart(2, '0');
            minutes.push(minute);
        }
        return minutes;
    };

    const hourOptions = generateHourOptions();
    const minuteOptions = generateMinuteOptions();

    const uploadImage = (event) => {
        const file = event.target.files[0];
        if (file.size <= 3 * 1024 * 1024) {
            setFoto(file);
            setUkuran((file.size / (1024 * 1024)).toFixed(2));
        } else {
            setUkuranAsli((file.size / (1024 * 1024)).toFixed(2));
            CompressImage(file)
                .then((compressedFile) => {
                    setFoto(compressedFile);
                    setUkuran((compressedFile.size / (1024 * 1024)).toFixed(2));
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    useEffect(() => {
        console.log(foto);
        console.log('hh', hour, 'mm', minute);
        console.log('waktu', value);
    }, [foto, hour, minute]);

    return (
        <div className="">
            <input type="file" onChange={uploadImage} />

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




            <div className="flex items-center bg-gray-100 rounded-lg w-full p-4">
                <IconClock className="text-gray-400" />
                <div className="ml-2 w-full relative">
                    <TimePicker
                        onChange={onChange}
                        value={value}
                        className="w-full bg-transparent text-black focus:outline-none"
                        clockClassName="hidden" // Hides the default clock icon of the TimePicker
                        clearIcon={null} // Hides the clear button if there's one
                        disableClock={true} // Disables the clock popup
                        format="HH:mm"
                        minTime="01:01"
                        maxTime="22:59"
                    />
                </div>
            </div>

            <div className="">
                {foto && (
                    <>
                        <div>
                            <img src={URL.createObjectURL(foto)} alt="gambar" />
                        </div>
                        <div>
                            Ukuran gambar: {ukuran} MB
                        </div>
                        <div>
                            Ukuran asli: {ukuranAsli} MB
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Tes;
