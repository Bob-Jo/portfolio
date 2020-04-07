$(function() {
    $("span.pie").peity("pie", {
        fill: ['#e84418', '#d7d7d7', '#ffffff']
    })

    $(".line").peity("line",{
        fill: '#e84418',
        stroke:'#bf2800',
    })

    $(".bar").peity("bar", {
        fill: ["#e84418", "#d7d7d7"]
    })

    $(".bar_dashboard").peity("bar", {
        fill: ["#e84418", "#d7d7d7"],
        width:100
    })

    var updatingChart = $(".updating-chart").peity("line", { fill: '#e84418',stroke:'#bf2800', width: 64 })

    setInterval(function() {
        var random = Math.round(Math.random() * 10)
        var values = updatingChart.text().split(",")
        values.shift()
        values.push(random)

        updatingChart
            .text(values.join(","))
            .change()
    }, 1000);

});
