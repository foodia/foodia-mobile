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
    const [percentReduction, setPercentReduction] = useState(null);

    const uploadImage = (event) => {
        const file = event.target.files[0];
        if (file.size <= 3 * 1024 * 1024) {
            setFoto(file);
            setUkuran((file.size / (1024 * 1024)).toFixed(2));
            setPercentReduction(0);
        } else {
            const originalSizeMB = file.size / (1024 * 1024);
            setUkuranAsli(originalSizeMB.toFixed(2));
            CompressImage(file)
                .then((compressedFile) => {
                    setFoto(compressedFile);
                    const compressedSizeMB = compressedFile.size / (1024 * 1024);
                    setUkuran(compressedSizeMB.toFixed(2));
                    const reduction = ((originalSizeMB - compressedSizeMB) / originalSizeMB) * 100;
                    setPercentReduction(reduction.toFixed(2));
                })
                .catch((error) => {
                    // console.log(error);
                });
        }
    };

    useEffect(() => {
        // console.log(foto);
    }, [foto]);

    return (
        <div className="">
            <input type="file" onChange={uploadImage} />

            <div className="flex">
                {foto && (
                    <>
                        <div>
                            <img src={URL.createObjectURL(foto)} alt="gambar" className="w-[200px] mr-2" />
                        </div>
                        <div className="">

                            <div className="mb-4">
                                Ukuran asli: {ukuranAsli} MB
                            </div>
                            <div className="mb-4">
                                Ukuran Compress Image: {ukuran} MB
                            </div>
                            {percentReduction !== null && (
                                <div className="mb-4">
                                    Pengurangan ukuran: {percentReduction}%
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Tes;
