const map = new maplibregl.Map({
    container: 'map',
    style:
        'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
    center: [77.2088, 28.6139],
    zoom: 8
});

const marker = new maplibregl.Marker({color: "Red"})
    .setLngLat([77.2088, 28.6139])
    .addTo(map);