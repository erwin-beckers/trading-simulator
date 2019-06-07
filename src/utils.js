import { tsvParse, csvParse } from "d3-dsv";
import { timeParse } from "d3-time-format";

function parseData(parse) {
  return function(d) {
    d.date = parse(d.Date);
    d.open = +d.Open;
    d.high = +d.High;
    d.low = +d.Low;
    d.close = +d.Close;
    d.volume = +d.Volume;

    return d;
  };
}

const parseDate = timeParse("%Y-%m-%d");

export function getData() {
  //Date      ,Open      ,High      ,Low       ,Close     ,Volume,Adj Close
  //2015-06-08,2092.34009,2093.01001,2079.11011,2079.28003,2917150000,2079.28003

  //date		open				high				low					close		volume	split	dividend	absoluteChange	percentChange
  //2010-01-04	25.436282332605284	25.835021381744056	25.411360259406774	25.710416	38409100	
  const promiseMSFT = fetch(
    "https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/SP500.csv"
  )
    .then(response => response.text())
    .then(data => csvParse(data, parseData(parseDate)));
  return promiseMSFT;
}
