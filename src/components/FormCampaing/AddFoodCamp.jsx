// components/FormCampaing/AddFoodCamp.jsx
import React, { useState } from 'react';
import { IconCirclePlus } from '@tabler/icons-react';


const AddFoodCamp = ({ id, name, price, images, description, capacity, addToCart, merchant_id }) => {
    const firstImageUrl = images.length > 0 ? images[0].image_url : '';
    const [quantity, setQuantity] = useState(1);

    const handleIncrease = () => {
        setQuantity(quantity + 1);
        console.log(images);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = () => {
        addToCart({
            id,
            merchant_id,
            name,
            price,
            images,
            description,
            capacity,
            quantity,
            total: quantity * price,
        });
        setQuantity(1);
    };

    return (
        <div className="w-full bg-white hover:bg-gray-200 text-black border border-black-1 rounded-lg inline-flex items-center px-4 py-2.5 mt-4">
            <div className="flex justify-between w-full">
                <div className="flex">

                    <img className="w-10 h-10 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600" src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${firstImageUrl}`} alt="" />

                    <div className="text-left place-items-start">
                        <div className="mb-1">{name}</div>
                        <div className="font-sans text-xs text-gray-500">{description}</div>
                        <div className="flex">
                            <p className="font-sans text-xs text-gray-500 mr-2">{`Capacity: ${capacity}`}</p>
                            {/* <div className={`font-sans text-xs text-white rounded-lg flex justify-center items-center bg-blue-600 w-24`}>
                                <p className="">{merchant_id}</p>
                            </div> */}
                        </div>
                        {/* <p className="text-gray-600 mt-2">{`Total: Rp${(quantity * price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p> */}
                        <p className="text-xs text-gray-600 mt-2">{`Harga: Rp${(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>

                    </div>
                </div>
                <div className="grid place-items-center">
                    <div className="flex items-center mt-2">
                        <button
                            className="bg-blue-500 text-white px-2 py-1 rounded-l hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                            onClick={handleDecrease}
                        >
                            -
                        </button>
                        <span className="px-4">{quantity}</span>
                        <button
                            className="bg-blue-500 text-white px-2 py-1 rounded-r hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                            onClick={handleIncrease}
                        >
                            +
                        </button>
                    </div>

                    <button
                        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                        onClick={handleAddToCart}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddFoodCamp;
