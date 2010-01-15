function log(x){
  if(console && console.log){ console.log(x); };
}

Profiler = {};

function showToolTip(x, y, contents) {
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
}
function hideToolTip(){
  $("#tooltip").remove();
};

Profiler.processJson= function(id){
  $.getJSON("out.json",function(data){
    var arr = [[0,null]];
    var ticks = [[0,'']];
    for(x in data){
      var total = 0;
      var longest = 0;
      for(var i=0; i < data[x].length; ++i){
        total += data[x][i]['total_time'];
        longest = Math.max(longest,data[x][i]['longest_time']);
      }
      if(x.length > 0){
        var avg = total/x.length;
      }
      
      log(arr.length+1);
      log(avg);
      
      ticks.push([arr.length+1,x]);
      arr.push([arr.length+1, avg]);
    }
    ticks.push([arr.length+1,'']);
    arr.push([arr.length+1,null]);
    
    log(arr);
    log(ticks);
    
    $.plot($(id),[{
      data: arr,
      bars: {show: true,barWidth: 0.5, align: 'center'}
    }],{
      grid: {
        autoHighlight: true,
        hoverable: true
      },
      xaxis: {
        ticks: ticks
      }
    });
    
    $(id).bind('plothover',function(event,loc,item){
      if(item){
        hideToolTip();
        var point = item.datapoint[1].toFixed(2);
        showToolTip(item.pageX,item.pageY,"Average time for request: "+point+"s");
        // mouse over an item
        log('Item hover');
        log(loc);
        log(item);
      }else{
        hideToolTip();
      }
    });
  });
};

Profiler.test = function(id){
  var d1 = [];
  for (var i = 0; i < 14; i += 0.5)
      d1.push([i, Math.sin(i)]);

  var d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];

  // a null signifies separate line segments
  var d3 = [[0, 12], [7, 12], null, [7, 2.5], [12, 2.5]];
  
  $.plot($(id), [ d1, d2, d3 ]);
};