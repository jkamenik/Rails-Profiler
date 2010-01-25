Profiler.actionTimelineTooltip = $.template(""+
  "${controller} -> ${action}<br>"+
  "${date}<br>"+
  "Request time: ${y} ms<br>"+
  "Longest sql time: ${longest_sql_ms} ms"
).compile();

Profiler.actionTimeline = function(id){
  var self = this; // closure for the Profile object
  $.getJSON("actions.json",function(data){
    var maxData = [];
    var longestData = [];
    var ticks = [];
    for(var i = 0; i < data.length; ++i){
      var x = i + 1;
      self.log(data);
      ticks.push(data[i]["action"]);
      longestData.push(data[i]['longest_sql_ms']);
      data[i]['y'] = data[i]['total_time_ms'];
      maxData.push(data[i]);
    }
    
    self.log(ticks);
    self.log(maxData);
    self.log(longestData);
    
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
          return self.actionTimelineTooltip.apply(this.point); //this.point['controller']+"->"+this.point.action+
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