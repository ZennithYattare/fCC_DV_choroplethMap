/** @format */

import "./style.css";
import { choroplethMap } from "./choroplethMap";

// TODO - adjust height and width of the map
document.querySelector("#app").innerHTML = `
<div class="bg-[#242424] flex h-screen w-screen place-items-center">
<div class="min-w-[1500px] w-[1500px] h-[650px] border-4 border-t-slate-200 border-l-slate-200 border-r-[#808080] border-b-[#808080] bg-[#c0c0c0] shadow-[5px_5px_5px_black] mx-auto p-4">
  <heading>
    <h1 id="title" class="text-3xl mx-auto w-max">Monthly Global Temperature</h1>
    <h3 id="description" class="mx-auto w-max">1753-2015: base temperature 8.66℃</h3>
  </heading>
  <div id="choropleth-map" class="m-0 p-0"></div>
</div>
</div>
`;

choroplethMap(document.querySelector("#choropleth-map"));
