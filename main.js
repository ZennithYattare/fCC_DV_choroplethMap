/** @format */

import "./style.css";
import { choroplethMap } from "./choroplethMap";

document.querySelector("#app").innerHTML = `
<div class="bg-[#242424] flex h-screen w-screen place-items-center">
<div class="min-w-[990px] w-[990px] h-[700px] border-4 border-t-slate-200 border-l-slate-200 border-r-[#808080] border-b-[#808080] bg-[#c0c0c0] shadow-[5px_5px_5px_black] mx-auto p-4">
  <heading>
    <h1 id="title" class="text-3xl mx-auto w-max">United States Educational Attainment</h1>
    <h3 id="description" class="mx-auto w-max">
      Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)
    </h3>
  </heading>
  <div id="choropleth-map" class="m-0 p-0"></div>
</div>
</div>
`;

choroplethMap(document.querySelector("#choropleth-map"));
