// GeoMap.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const LocationMarker = ({ sendDataToPage, tracking }) => {
    const [position, setPosition] = useState(null);
    const [locationInfo, setLocationInfo] = useState(null);

    const map = useMapEvents({
        click() {
            // Trigger geolocation when the user clicks on the map
            if (tracking) {
                map.locate();
            }
        },
        locationfound(e) {
            // Handle the location found event
            if (tracking) {
                setPosition(e.latlng);
                map.flyTo(e.latlng, map.getZoom());
                fetchLocationInfo(e.latlng);
            }
            // else: handle non-tracking logic (if needed)
        },
    });

    useEffect(() => {
        if (!tracking && position) {
            // Handle non-tracking logic (if needed)
            fetchLocationInfo(position);
        }
    }, [position, tracking]);

    const fetchLocationInfo = async (latlng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch location information. Status: ${response.status}`);
            }

            const data = await response.json();
            setLocationInfo({
                province: data.address.state || 'Provinsi tidak diketahui',
                city: data.address.city || 'Kota tidak diketahui',
                kelurahan: data.address.neighbourhood || 'Kelurahan tidak diketahui',
                kecamatan: data.address.suburb || 'Suburb tidak diketahui',
                fullAdres: data.display_name || 'Lokasi tidak diketahui',
            });
        } catch (error) {
            console.error('Error fetching location information:', error.message);
        }
    };

    useEffect(() => {
        if (sendDataToPage && locationInfo) {
            sendDataToPage(locationInfo);
        }
    }, [locationInfo, sendDataToPage]);

    const handleMarkerDragEnd = (e) => {
        // Update the position when the marker is dragged
        setPosition(e.target.getLatLng());
    };

    const customMarkerIcon = new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        shadowSize: [41, 41],
    });

    return position === null ? null : (
        <Marker
            position={position}
            icon={customMarkerIcon}
            draggable={tracking}
            eventHandlers={tracking ? { dragend: handleMarkerDragEnd } : null}
        >
            <Popup>
                {locationInfo ? (
                    <div>
                        <p>Provinsi: {locationInfo.province}</p>
                        <p>Kota: {locationInfo.city}</p>
                        <p>Kelurahan: {locationInfo.kelurahan}</p>
                        <p>Kecamatan: {locationInfo.kecamatan}</p>
                    </div>
                ) : (
                    <p>Mengambil informasi lokasi...</p>
                )}
            </Popup>
        </Marker>
    );
};

const GeoMap = ({ sendDataToPage, tracking }) => {
    return (
        <MapContainer
            center={{ lat: -6.2088, lng: 106.8456 }} // Jakarta, Indonesia
            zoom={13}
            style={{ height: '200px', width: '100%' }}
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='Click the map to get the location'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker sendDataToPage={sendDataToPage} tracking={tracking} />
        </MapContainer>
    );
};

export default GeoMap;
