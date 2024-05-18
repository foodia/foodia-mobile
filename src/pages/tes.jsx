// Tes.jsx
import CompressImage from "@/components/CompressImage";
import { useEffect, useState } from "react";


const Tes = () => {
    const [foto, setFoto] = useState(null);
    const [ukuran, setUkuran] = useState(null);
    const [ukuranAsli, setUkuranAsli] = useState(null);

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
