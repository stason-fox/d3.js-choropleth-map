const countyURL =
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const educationURL =
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
let countyData, educationData;

const canvas = d3.select("#canvas");
const tooltip = d3.select("#tooltip");

const generateMap = () => {
    canvas
        .selectAll("path")
        .data(countyData)
        .enter()
        .append("path")
        .attr("d", d3.geoPath())
        .attr("class", "county")
        .attr("fill", (countyDataItem) => {
            let id = countyDataItem.id;
            let county = educationData.find((item) => {
                return item.fips === id;
            });
            let percentage = county.bachelorsOrHigher;
            if (percentage <= 15) {
                return "FireBrick";
            } else if (percentage <= 30) {
                return "Orange";
            } else if (percentage <= 45) {
                return "LightGreen";
            } else {
                return "DarkGreen";
            }
        })
        .attr("data-fips", (countyDataItem) => {
            return countyDataItem.id;
        })
        .attr("data-education", (countyDataItem) => {
            let id = countyDataItem.id;
            let county = educationData.find((item) => {
                return item.fips === id;
            });
            let percentage = county.bachelorsOrHigher;
            return percentage;
        })
        .on("mouseover", (countyDataItem) => {
            tooltip.transition().style("visibility", "visible");

            let id = countyDataItem.id;
            let county = educationData.find((item) => {
                return item.fips === id;
            });
            tooltip.text(
                `${county.area_name}, ${county.state} | county FIPS code: ${county.fips} | bachelor's percentage: ${county.bachelorsOrHigher}%`
            );
            tooltip.attr("data-education", county.bachelorsOrHigher);
        })
        .on("mouseout", (countyDataItem) => {
            tooltip.transition().style("visibility", "hidden");
        });
};

d3.json(countyURL).then((data, error) => {
    if (error) {
        console.log(log);
    } else {
        countyData = topojson.feature(data, data.objects.counties).features;
        console.log(countyData);

        d3.json(educationURL).then((data, error) => {
            if (error) {
                console.log(error);
            } else {
                educationData = data;
                console.log(educationData);
                generateMap();
            }
        });
    }
});
