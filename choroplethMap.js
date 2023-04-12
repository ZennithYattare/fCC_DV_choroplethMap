/** @format */

import * as d3 from "d3";
import * as topojson from "topojson-client";

export async function choroplethMap() {
	const urlArray = [
		fetch(
			"https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
		),
		fetch(
			"https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
		),
	];

	async function getData() {
		let data;
		try {
			const response = await Promise.allSettled(urlArray);

			const successArray = [];
			response.map((obj) => {
				if (obj.status === "fulfilled") {
					successArray.push(obj.value);
				}
			});

			if (successArray.length !== urlArray.length) {
				throw new Error("Some promises were rejected");
			}

			data = await Promise.allSettled(
				successArray.map((response) => response.json())
			);
		} catch (e) {
			console.log(e);
		}
		return [data[0].value, data[1].value];
	}

	const [dataArray, topologyData] = await getData();
	console.log(dataArray);

	const topologyFeatures = topojson.feature(
		topologyData,
		topologyData.objects.counties
	).features;

	console.log(topologyFeatures);

	const width = 950;
	const height = 600;

	const svg = d3
		.select("#choropleth-map")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("class", "svg");

	const tooltip = d3
		.select("#choropleth-map")
		.append("div")
		.attr("id", "tooltip")
		.style("opacity", 0);

	const legend = d3
		.select("#choropleth-map")
		.append("svg")
		.attr("id", "legend")
		.attr("width", 260)
		.attr("height", 30);

	const path = d3.geoPath();

	svg.selectAll("path")
		.data(topologyFeatures)
		.enter()
		.append("path")
		.attr("d", path)
		.attr("class", "county");
}

// Async/Await Resources:
// + https://youtu.be/gwY5wMe7Xbw
// + https://javascript.info/async-await
// + https://stackoverflow.com/questions/48327559/save-async-await-response-on-a-variable
// + https://www.javascripttutorial.net/javascript-return-multiple-values/
