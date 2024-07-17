// src/components/page/getDistance.jsx
export default function getDistance(lat1, lng1, lat2, lng2) {
    const toRadians = (degree) => (degree * Math.PI) / 180;

    const earthRadius = 6371e3; // Earth's radius in meters
    const lat1Radians = toRadians(lat1);
    const lat2Radians = toRadians(lat2);
    const deltaLat = toRadians(lat2 - lat1);
    const deltaLng = toRadians(lng2 - lng1);

    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1Radians) * Math.cos(lat2Radians) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadius * c; // Distance in meters
    return distance;
}