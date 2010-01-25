Profiler.test = function(id){
  var y = [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6];
  var x = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  new Highcharts.Chart({
    chart: {
      renderTo: id,
      defaultSeriesType: 'bar'
    },
    xAxis: {
      categories: x,
      title: {
        text: 'Month'
      }
    },
    yAxis: {
      title: {
        text: 'Temperature (°C)'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    series: [{
      name: 'Tokyo',
      data: y
    }]
  });
};