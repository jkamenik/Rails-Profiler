Profiler = new function(){
  this.log = function(x){
    if(console && console.log){
      console.log(x);
    }
  };
};

/*
Profiler = new function(){
  var tooltip = $.template(""+
    "${controller} -> ${action}<br>"+
    "${date}<br>"+
    "Request time: ${y} ms<br>"+
    "Longest sql time: ${longest_sql_ms} ms"
  ).compile();
  
  this.processJson = function(id){
    $.getJSON("actions.json",function(data){
      var maxData = [];
      var longestData = [];
      var ticks = [];
      for(var i = 0; i < data.length; ++i){
        var x = i + 1;
        log(data);
        ticks.push(data[i]["action"]);
        longestData.push(data[i]['longest_sql_ms']);
        data[i]['y'] = data[i]['total_time_ms'];
        maxData.push(data[i]);
      }
      
      log(ticks);
      log(maxData);
      log(longestData);
      
      new Highcharts.Chart({
        chart: {
          renderTo: id,
          margin: [50,0,60,75],
          defaultSeriesType: 'column'
        },
        title: {
          text: 'Max time per request'
        },
        tooltip: {
          formatter: function(){
            if(!this.point.controller){
              return this.point.y+" ms";
            }
            return tooltip.apply(this.point); //this.point['controller']+"->"+this.point.action+
              // "<br>"+this.point.date+
              // "<br>"+this.point.parameters+
              // "<br>"+this.point.y+" ms";
          }
        },
        legend: {
          layout: 'vertical',
          style: {
            left: 'auto',
            bottom: 'auto',
            right: '10px',
            top: '10px'
          },
          backgroundColor: '#FFFFFF'
        },
        xAxis: {
          categories: ticks,
          title: { 
            text: 'Actions',
            enabled: true
          },
          labels: {
            rotation: -45,
            align: 'right'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Time (ms)'
          }
        },
        series: [{
          type: 'column',
          name: 'Total Time',
          data: maxData
        },{
          type: 'scatter',
          name: 'Longest Sql',
          data: longestData
        }],
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true,
              color: 'auto'
            }
          }
        }
      });
    });
  };
  
  this.showToolTip = function(x, y, contents) {
      $('<div id="tooltip">' + contents + '</div>').css( {
          position: 'absolute',
          display: 'none',
          top: y + 5,
          left: x + 5,
          border: '1px solid #fdd',
          padding: '2px',
          'background-color': '#fee',
          opacity: 0.80
      }).appendTo("body").fadeIn(200);
  };
  this.hideToolTip = function(){
    $("#tooltip").remove();
  };
  
  // Function for testing the grid
  this.test = function(id){
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
  
  return this;
};
*/