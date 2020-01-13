var apiKey = "Jyrx2sQR5VfAK34mTAdX";

/**
 * Helper function to select stock data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * index 0 - Date
 * index 1 - Open
 * index 2 - High
 * index 3 - Low
 * index 4 - Close
 * index 5 - Volume
 */


function unpack(rows, index) {
  return rows.map(function(row) {
    return row[index];
  });
}

function getMonthlyData() {

  var queryUrl = `https://www.quandl.com/api/v3/datasets/WIKI/AMZN.json?start_date=2016-10-01&end_date=2017-10-01&collapse=monthly&api_key=${apiKey}`;
  d3.json(queryUrl).then(function(data) {
    var dates = unpack(data.dataset.data, 0);
    var openPrices = unpack(data.dataset.data, 1);
    var highPrices = unpack(data.dataset.data, 2);
    var lowPrices = unpack(data.dataset.data, 3);
    var closingPrices = unpack(data.dataset.data, 4);
    var volume = unpack(data.dataset.data, 5);
    buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume);
  });
}

function buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume) {
  var table = d3.select("#summary-table");
  var tbody = table.select("tbody");
  var trow;
  for (var i = 0; i < 12; i++) {
    trow = tbody.append("tr");
    trow.append("td").text(dates[i]);
    trow.append("td").text(openPrices[i]);
    trow.append("td").text(highPrices[i]);
    trow.append("td").text(lowPrices[i]);
    trow.append("td").text(closingPrices[i]);
    trow.append("td").text(volume[i]);
  }
}

function buildPlot() {
  
    d3.csv("csv_files/course_ID_final_db.csv").then(function(data) {
    
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
      x: states_list,
      y: states_count
    };

    var data = [trace1];
    /*
    var layout = {
      title: `${stock} closing prices`,
      xaxis: {
        range: [startDate, endDate],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      },
      showlegend: false
    };
    */
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

    var trace1 = {
      type: 'scatter',
      x: Object.keys(bogeys_state),
      y: Object.values(bogeys_state),
      mode: 'markers',
      name: 'Median Bogey Difficulty per state',
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

    var layout = {
      xaxis: {
        autotick: false
      }
    };

    Plotly.newPlot('plot2', data),layout;
      });
}

buildSecondPlot();

// BONUS - Dynamically add the current date to the report header
var monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var today = new Date();
var date = `${monthNames[today.getMonth()]} ${today.getFullYear().toString().substr(2, 2)}`;

d3.select("#report-date").text(date);
