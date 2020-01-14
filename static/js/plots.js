function buildPlot() {
    d3.csv("csv_files/course_ID_final_db.csv").then(function(data) {
    console.log("Test");
    values = Object.values(data);
    
    var States = [];

    for (const val of values) {
      States.push(val.State);
    }

    function foo(arr) {
      var a = [], b = [], prev;

      arr.sort();

      for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
          a.push(arr[i]);
          b.push(1);
        }
        else {
          b[b.length-1]++;
        }
        prev = arr[i];
      }

      return [a, b];
    }

    states_list = foo(States)[0];
    states_count = foo(States)[1];

    var trace1 = {
      type: "bar",
      name: "Count per State",
      title: "# of Courses per State",
      x: states_list,
      y: states_count
    };

    var data = [trace1];
    Plotly.newPlot("plot", data);

  });
}

buildPlot();

function buildSecondPlot() {
  d3.csv("csv_files/final_db.csv").then(function(data) {
    values = Object.values(data);
    var States = [];
    var BogeyRating = [];
    for (const val of values) {
      States.push(val.State_x);
      BogeyRating.push(parseFloat(val.Bogey_Rating))
    }

    const bogeys_state = {};
    counter = 0;
    for (const state of States) {
      if (state in bogeys_state){
        bogeys_state[state].push(BogeyRating[counter]);
      }
      else{
        bogeys_state[state] = [BogeyRating[counter]];
      }
      counter = counter + 1;
    }
    
    function median(values){
      if(values.length ===0) return 0;
    
      values.sort(function(a,b){
        return a-b;
      });
    
      var half = Math.floor(values.length / 2);
    
      if (values.length % 2)
        return values[half];
    
      return (values[half - 1] + values[half]) / 2.0;
    }

    for (const state of Object.keys(bogeys_state)){
      bogeys_state[state] = median(bogeys_state[state]);
    }

    delete bogeys_state["undefined"];

    var trace1 = {
      type: 'scatter',
      x: Object.keys(bogeys_state),
      y: Object.values(bogeys_state),
      mode: 'markers',
      title: 'Median Bogey Difficulty per state',
      marker: {
        color: 'rgba(156, 165, 196, 0.95)',
        line: {
          color: 'rgba(156, 165, 196, 1.0)',
          width: 1,
        },
        symbol: 'circle',
        size: 4
      }
    };

    var data = [trace1];

    Plotly.newPlot('plot2', data);
  });
}

buildSecondPlot();