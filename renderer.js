require('electron').webFrame.setZoomLevelLimits(1, 1)

var width = 136,
    height = 136;
var divFactor = 2.5;

var fields = [
    {
        value: 24,
        size: 24,
        label: "h",
        update: function (date) {
            return date.getHours();
        },
        fill: "#1e88e5",
        stroke: "#1e88e5",
        arc: d3.svg.arc()
            .innerRadius(width / divFactor)
            .outerRadius(width / divFactor + 10)
            .startAngle(0)
            .endAngle(function (d) {
                return (d.value / d.size) * 2 * Math.PI;
            })
    },
    {
        value: 60,
        size: 60,
        label: "m",
        update: function (date) {
            return date.getMinutes();
        },
        fill: "#03a9f4",
        stroke: "#03a9f4",
        arc: d3.svg.arc()
            .innerRadius(width / divFactor - 10)
            .outerRadius(width / divFactor - 0)
            .startAngle(0)
            .endAngle(function (d) {
                return (d.value / d.size) * 2 * Math.PI;
            })
    },
    {
        value: 60,
        size: 60,
        label: "s",
        update: function (date) {
            return date.getSeconds();
        },
        fill: "#4dd0e1",
        stroke: "#4dd0e1",
        arc: d3.svg.arc()
            .innerRadius(width / divFactor - 20)
            .outerRadius(width / divFactor - 10)
            .startAngle(0)
            .endAngle(function (d) {
                return (d.value / d.size) * 2 * Math.PI;
            })
    }
];

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var field = svg.selectAll(".field")
    .data(fields)
    .enter().append("g")
    .attr("transform", function (d, i) {
        return "translate(" + width / 2 + "," + height / 2 + ")";
    })
    .attr("class", "field");

var path = field.append("path")
    .attr("class", "path path--foreground")
    .style("fill", function (d) {
        return d.fill
    });

console.log(labelClass);
label = svg.append("text").attr("transform", function (d, i) {
        return "translate(" + 140 / 2 + "," + 140 / 2 + ")";
    })
    .attr("class", labelClass)
    .attr("dy", ".35em");

(function update() {
    var now = new Date();

    field
        .each(function (d) {
            d.previous = d.value, d.value = d.update(now);
        });

    path.transition()
        .ease("elastic")
        .duration(750)
        .attrTween("d", arcTween);
    label.text('');
    label
        .text(function () {
            var t = "";
            field.each(function (d) {
                var v = d.value;
                if (d.value < 10) {
                    v = "0" + v;
                }
                if (d.label.indexOf("s") == -1) {
                    t += v + ':';
                } else {
                    t += v;
                }
            });
            return t;
        });

    setTimeout(update, 1000 - (now % 1000));
})();

function arcTween(b) {
    var i = d3.interpolate({
        value: b.previous
    }, b);
    return function (t) {
        return b.arc(i(t));
    };
}