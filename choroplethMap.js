/** @format */

import * as d3 from "d3";
import * as topojson from "topojson-client";

export async function choroplethMap() {
	// the urlArray is an array of two fetch requests
	const urlArray = [
		fetch(
			"https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
		),
		fetch(
			"https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
		),
	];

	// the function getData() is an async function that returns an array of two elements
	// the first element is the data from the first fetch request, for_user_education.json for the data
	// the second element is the data from the second fetch request, counties.json for the topography
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

	const topologyFeatures = topojson.feature(
		topologyData,
		topologyData.objects.counties
	).features;

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
		.style("opacity", 0)
		.style("background-color", "white")
		.style("border", "solid")
		.style("border-width", "2px")
		.style("border-radius", "3px")
		.style("padding", "3px");

	const legend = d3
		.select("#choropleth-map")
		.append("svg")
		.attr("id", "legend")
		.attr("transform", "translate(600, -550)")
		.attr("width", 280)
		.attr("height", 40);

	// an array of ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]
	const schemeGreens = [
		"#b7e2b1",
		"#97d494",
		"#73c378",
		"#4daf62",
		"#2f984f",
		"#157f3b",
		"#036429",
		"#00441b",
	];

	// Three functions that change the tooltip when user hover / move / leave a cell
	const mouseover = function (d) {
		tooltip.style("opacity", 0.7);
		d3.select(this).style("stroke", "black").style("opacity", 1);
	};

	const mousemove = function (event, d) {
		let id = d.id;
		let result = dataArray.filter((obj) => obj.fips === id);
		console.log(result);
		tooltip
			.html(
				result[0].area_name +
					", " +
					result[0].state +
					": " +
					result[0].bachelorsOrHigher +
					"%"
			)
			.style("left", event.pageX + 30 + "px")
			.style("top", event.pageY + "px");
		tooltip.attr("data-education", result[0].bachelorsOrHigher);
	};

	const mouseleave = function (d) {
		tooltip.style("opacity", 0);
		d3.select(this).style("stroke", "none").style("opacity", 0.8);
	};

	let myColor = d3.scaleSequential().range(schemeGreens);

	const minPercentage = d3.min(dataArray, (d) => d.bachelorsOrHigher);
	const maxPercentage = d3.max(dataArray, (d) => d.bachelorsOrHigher);

	const xScaleLegend = d3
		.scaleLinear()
		.domain([minPercentage, maxPercentage])
		.range([0, 240])
		.nice();

	const xAxisLegend = d3
		.axisBottom()
		.scale(xScaleLegend)
		.ticks(8)
		.tickFormat((x) => Math.round(x) + "%");

	legend
		.selectAll("rect")
		.data(schemeGreens)
		.enter()
		.append("rect")
		.attr("transform", "translate(11, 0)")
		.attr("height", 10)
		.attr("x", (d, i) => {
			return i * 30;
		})
		.attr("width", 30)
		.style("fill", (d) => {
			return d;
		})
		.style("stroke-width", 1)
		.style("stroke", "black");

	legend
		.append("g")
		.attr("transform", "translate(10, 10)")
		.call(xAxisLegend)
		.select(".domain")
		.remove();

	const path = d3.geoPath();

	svg.selectAll("path")
		.data(topologyFeatures)
		.enter()
		.append("path")
		.attr("d", path)
		.attr("class", "county")
		.attr("fill", (d) => {
			let id = d.id;
			let result = dataArray.filter((obj) => obj.fips === id);
			let percentage = result[0].bachelorsOrHigher;
			let colorIndex = Math.floor(percentage / 10);
			return myColor(colorIndex);
		})
		.attr("data-fips", (d) => d.id)
		.attr("data-education", (d) => {
			let id = d.id;
			let result = dataArray.filter((obj) => obj.fips === id);
			return result[0].bachelorsOrHigher;
		})
		.on("mouseover", mouseover)
		.on("mousemove", mousemove)
		.on("mouseleave", mouseleave);

	// TODO - add tooltip
}

// Async/Await Resources:
// + https://youtu.be/gwY5wMe7Xbw
// + https://javascript.info/async-await
// + https://stackoverflow.com/questions/48327559/save-async-await-response-on-a-variable
// + https://www.javascripttutorial.net/javascript-return-multiple-values/
