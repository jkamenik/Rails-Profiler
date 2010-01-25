Profiler.actionTimelineTooltip = $.template(""+
  "<b>${y} ms</b><br>"+
  "${controller} -> ${action}<br>"+
  "${date}<br>"+
  "Action time: ${total_time_ms} ms<br>"+
  "Longest sql time: ${longest_sql_ms} ms<br>"+
  "Params: ${parameters}"
).compile();

Profiler.actionTimeline = function(id){
  var self = this; // closure for the Profile object
  $.getJSON("actions.json",function(data){
    var maxData = [];
    var longestData = [];
    var ticks = [];
    
    for(var i = 0; i < data.length; ++i){
      var total = data[i];
      var longest = self.clone(total);
      
      ticks.push('&nbsp;'); //cheap trick to remove the label
      
      total['y'] = data[i]['total_time_ms'];
      longest['y'] = data[i]['longest_sql_ms'];
      
      maxData.push(total);
      longestData.push(longest);
    }
    
    self.log(ticks);
    self.log(maxData);
    self.log(longestData);
    
    new Highcharts.Chart({
      chart: {
        renderTo: id,
        margin: [50,0,60,75]
      },
      title: {
        text: 'Max time per request'
      },
      tooltip: {
        formatter: function(){
          if(!this.point.controller){
            return this.point.y+" ms";
          }
          return self.actionTimelineTooltip.apply(this.point);
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
        }
      },
      yAxis: {
        title: {
          text: 'Time (ms)'
        }
      },
      series: [{
        type: 'area',
        name: 'Total Time',
        data: maxData
      },{
        type: 'area',
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