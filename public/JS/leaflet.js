// console.log('hey i am aman!');
const leaflet=document.getElementById('map');
if(leaflet)
{
    const locations = JSON.parse(leaflet.dataset.locations);
    var map = L.map('map',{ scrollWheelZoom: false})

    L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png').addTo(map);

    const points = [];
    locations.forEach((loc) => {
        
    points.push([loc.coordinates[1], loc.coordinates[0]]);

    L.marker([loc.coordinates[1], loc.coordinates[0]])
        .addTo(map)
        .bindPopup(
            L.popup({
                maxWidth:250,
                minWidth:100,
                autoClose:false,
                closeOnClick:false,
                className:'pop-up'
            })
        ).setPopupContent(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .openPopup();
    });
    
    const bounds = L.latLngBounds(points).pad(0.5);
    map.fitBounds(bounds);
}
