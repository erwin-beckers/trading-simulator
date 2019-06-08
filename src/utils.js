import { tsvParse, csvParse } from "d3-dsv";
import { timeParse } from "d3-time-format";

function parseData(parse) {
  return function(d) {
    d.date = parse(d.time);
    d.open = +d.open;
    d.high = +d.high;
    d.low = +d.low;
    d.close = +d.close;
    d.volume = 10*d.volume;

    return d;
  };
}

const parseDate = timeParse("%Y-%m-%d %H:%M:%S");

export function getData() {
  const promiseMSFT = fetch(
    "https://raw.githubusercontent.com/erwin-beckers/trading-simulator/master/data/es-5-min.csv"
  )
    .then(response => response.text())
    .then(data => csvParse(data, parseData(parseDate)));
  return promiseMSFT;
}
