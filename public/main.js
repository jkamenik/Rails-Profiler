function log(x){
  if(console && console.log){ console.log(x); };
}

Profiler = new function(){
  this.processJson = function(id){
    $.getJSON("actions.json",function(data){
      var maxData = [];
      var longestData = [];
      var ticks = [];
      for(var i = 0; i < data.length; ++i){
        var x = i + 1;
        log(data);
        ticks.push([x,data[i]["action"]+"<br>"+data[i]['date']]);
        maxData.push([x,data[i]['total_time_ms']]);
        longestData.push([x,data[i]['longest_sql_ms']]);
      }

      $.plot($(id),[{
        data: maxData,
        label: 'Total Request time',
        bars: {show: true,barWidth: 0.5, align: 'center'}
      },{
        data: longestData,
        label: 'Longest SQL time',
        yaxis: 2,
        points: {show: true}
      }],{
        grid: {
          autoHighlight: true,
          hoverable: true
        },
        xaxis: {
          ticks: ticks
        },
        yaxis: { tickFormatter: function (v, axis) { return v.toFixed(axis.tickDecimals) +"ms" }},
        y2axis: { tickFormatter: function (v, axis) { return v.toFixed(axis.tickDecimals) +"ms" }}
      });

      $(id).bind('plothover',function(event,loc,item){
        if(item){
          Profiler.hideToolTip();
          var point = item.datapoint[1].toFixed(2);
          Profiler.showToolTip(item.pageX,item.pageY,point+"ms");
          // mouse over an item
          log('Item hover');
          log(loc);
          log(item);
        }else{
          Profiler.hideToolTip();
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
    var d1 = [];
    for (var i = 0; i < 14; i += 0.5)
        d1.push([i, Math.sin(i)]);

    var d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];

    // a null signifies separate line segments
    var d3 = [[0, 12], [7, 12], null, [7, 2.5], [12, 2.5]];

    $.plot($(id), [ d1, d2, d3 ]);
  };
  
  return this;
};