import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as d3 from 'd3';

const MapVisualization = ({ data, selectedObject, clickedTimestamp }) => {
    const mapContainer = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        if (!mapContainer.current || mapInstance.current) return;

        mapInstance.current = L.map(mapContainer.current).setView([-25.2744, 133.7751], 4);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance.current);

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const map = mapInstance.current;
        if (!map || !data || !selectedObject) return;

        const selectedData = data.find(obj => obj.identifier === selectedObject);
        if (!selectedData || !selectedData.trajectory || selectedData.trajectory.length === 0) return;

        const firstCoord = selectedData.trajectory[0];
        if (!firstCoord) return;

        map.flyTo([firstCoord.latitude, firstCoord.longitude], 18);

        const svgLayer = L.svg({ clickable: true }).addTo(map);
        const svg = d3.select(svgLayer._container);

        const projectPoint = (x, y) => {
            const point = map.latLngToLayerPoint(new L.LatLng(y, x));
            return [point.x, point.y];
        };

        svg.selectAll("*").remove();

        const line = d3.line()
            .x(d => projectPoint(d.longitude, d.latitude)[0])
            .y(d => projectPoint(d.longitude, d.latitude)[1]);

        svg.append("path")
            .datum(selectedData.trajectory)
            .attr("fill", "none")
            .attr("stroke", "#FF0080")
            .attr("stroke-width", 1)
            .attr("stroke-opacity", 0.2)
            .attr("d", line);

        svg.selectAll("circle")
            .data(selectedData.trajectory)
            .enter()
            .append("circle")
            .attr("cx", d => projectPoint(d.longitude, d.latitude)[0])
            .attr("cy", d => projectPoint(d.longitude, d.latitude)[1])
            .attr("r", 3)
            .attr("fill", "#FF0080")
            .append("title")
            .text(d => `Timestamp: ${d.timestamp}`);

        // Remove previous highlighted points
        map.eachLayer(layer => {
            if (layer.options && layer.options.className === 'highlighted-point') {
                map.removeLayer(layer);
            }
        });

        // Highlight clicked point and zoom into it
        if (clickedTimestamp) {
            const clickedPoint = selectedData.trajectory.find(point => point.timestamp === clickedTimestamp);
            if (clickedPoint) {
                map.flyTo([clickedPoint.latitude, clickedPoint.longitude], 20); // Zoom into the clicked point

                L.circleMarker([clickedPoint.latitude, clickedPoint.longitude], {
                    color: 'black',
                    radius: 5,
                    className: 'highlighted-point'
                }).addTo(map);
            }
        }

        map.on('moveend', update);
        function update() {
            svg.selectAll('path').attr('d', line);
            svg.selectAll('circle')
                .attr("cx", d => projectPoint(d.longitude, d.latitude)[0])
                .attr("cy", d => projectPoint(d.longitude, d.latitude)[1]);
        }

        update();

        return () => {
            svgLayer.remove();
        };
    }, [data, selectedObject, clickedTimestamp]);

    return <div ref={mapContainer} style={{ height: '600px', width: '800px' }} />;
};

export default MapVisualization;
