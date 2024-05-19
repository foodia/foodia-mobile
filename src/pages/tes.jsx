// Tes.jsx
import CompressImage from "@/components/CompressImage";
import { IconClock } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import TimePicker from "react-time-picker";
import style from "../styles/TimePicker.module.css";

const Tes = () => {
    const [foto, setFoto] = useState(null);
    const [ukuran, setUkuran] = useState(null);
    const [ukuranAsli, setUkuranAsli] = useState(null);
    const [value, onChange] = useState('10:00');

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
    }, [foto]);

    return (
        <div className="">
            <input type="file" onChange={uploadImage} />
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
