let w = 600;
let h = 250;

let dataset = [
    {key: 0, value: 5},
    {key: 1, value: 15},
    {key: 2, value: 25},
    {key: 3, value: 8},
    {key: 4, value: 5},
    {key: 5, value: 5},
    {key: 6, value: 5},
    {key: 7, value: 5},
    {key: 8, value: 25},
]

let xScale = d3.scaleBand()
    .domain(d3.range(dataset.length))
    .range([0,w])
    .paddingInner(0.05)

let yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d.value)])
    .range([0,h])

let key = function (d) {
    return d.key;
}

let svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)

svg.selectAll("rect")
    .data(dataset, key)
    .enter()
    .append("rect")
    .attr("x", (d,i) => xScale(i))
    .attr("y", d => h - yScale(d.value))
    .attr("width", xScale.bandwidth())
    .attr("height", d => yScale(d.value))
    .attr("fill", d => `rgb(0,0,${d.value * 10})`)

svg.selectAll("text")
    .data(dataset, key)
    .enter()
    .append("text")
    .text(d => d.value)
    .attr("x", (d,i) => xScale(i) + xScale.bandwidth() / 2)
    .attr("y", d => h - yScale(d.value) + 14)
    .attr("fill", "white")
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("text-anchor", "middle")

d3.selectAll("p")
    .on("click", function(){


        let paragraphID = d3.select(this).attr("id")

        if(paragraphID === "add"){
            let minValue = 2;
            let maxValue = 25 - minValue;
            let newNumber = Math.floor(Math.random() * maxValue) + minValue;
            let lastKeyValue = dataset[dataset.length - 1].key;
            dataset.push({
                key: lastKeyValue + 1,
                value: newNumber
            });

        } else {
            dataset.shift();
        }

        xScale.domain(d3.range(dataset.length));
        yScale.domain([0, d3.max(dataset, d => d.value)]);

        let bars = svg.selectAll("rect")
            .data(dataset, key)

        bars.enter()
            .append("rect")
            .attr("x", w)
            .attr("y", d => h - yScale(d.value))
            .attr("width", xScale.bandwidth())
            .attr("height", d => yScale(d.value))
            .attr("fill", d => `rgb(0, 0, ${d.value * 10})`)
            .merge(bars)
            .transition()
            .duration(500)
            .attr("x", (d,i) => xScale(i))
            .attr("y", d => h - yScale(d.value))
            .attr("width", xScale.bandwidth())
            .attr("height", d => yScale(d.value))

        bars.exit()
            .transition()
            .duration(500)
            .attr("x", -xScale.bandwidth())
            .remove()

        let labels = svg.selectAll("text")
            .data(dataset, key)

        labels.enter()
            .append("text")
            .text(d => d.value)
            .attr("x", w)
            .attr("y", d => h - yScale(d.value) + 14)
            .attr("font-family", "sans-serif")
            .attr("fill", "white")
            .attr("font-size", "11px")
            .attr("text-anchor", "middle")
            .merge(labels)
            .transition()
            .duration(500)
            .attr("x", (d,i) => xScale(i) + xScale.bandwidth() / 2)

        labels.exit()
            .transition()
            .duration(500)
            .attr("x", -xScale.bandwidth())
            .remove()
    })
