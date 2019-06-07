import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import { CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateY
} from "react-stockcharts/lib/coordinates";
import { saveInteractiveNodes, getInteractiveNodes } from "./interactiveutils";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { fitWidth } from "react-stockcharts/lib/helper";
import { InteractiveYCoordinate } from "react-stockcharts/lib/interactive";

const mouseEdgeAppearance = {
  textFill: "#542605",
  stroke: "#05233B",
  strokeOpacity: 1,
  strokeWidth: 3,
  arrowWidth: 5,
  fill: "#BCDEFA"
};

function round(number) {
  return Math.round(number / 0.25) * 0.25;
}

class CandleStickChart extends React.Component {
  constructor(props) {
    super(props);
    this.onDragComplete = this.onDragComplete.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.saveInteractiveNodes = saveInteractiveNodes.bind(this);
    this.getInteractiveNodes = getInteractiveNodes.bind(this);

    this.state = {
      enableInteractiveObject: false
    };
  }

  onDelete(yCoordinate, moreProps) {
    console.log("onDelete ");
    this.setState(state => {
      const chartId = moreProps.chartConfig.id;
      const key = `yCoordinateList_${chartId}`;
      const list = state[key];
      return {
        [key]: list.filter(d => d.id !== yCoordinate.id)
      };
    });
  }

  onDragComplete(yCoordinateList, moreProps, draggedAlert) {
	let price=round(draggedAlert.yValue);
    let order = draggedAlert.order;
    if (draggedAlert.id === order.chartTakeProfit.id) {
	  order.takeprofit = price;
      this.props.onChanged(order);
    }
    if (draggedAlert.id === order.chartStoploss.id) {
      order.stoploss = price;
      this.props.onChanged(order);
    }
  }

  render() {
    const { type, data: initialData, width, ratio } = this.props;

    const calculatedData = initialData;
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      d => d.date
    );
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      calculatedData
    );

    const margin = { left: 70, right: 70, top: 20, bottom: 30 };

    const height = 550;
    const gridHeight = height - margin.top - margin.bottom;
    const gridWidth = width - margin.left - margin.right;
    const showGrid = true;
    const yGrid = showGrid
      ? { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.2 }
      : {};
    const xGrid = showGrid
      ? { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.2 }
      : {};

    return (
      <ChartCanvas
        height={height}
        width={width}
        ratio={ratio}
        margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
        type={type}
        seriesName="ES"
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
      >
        <Chart
          id={1}
          height={height - 50}
          yExtents={[d => [d.high, d.low]]}
          padding={{ top: 10, bottom: 20 }}
        >
          <XAxis
            axisAt="bottom"
            orient="bottom"
            tickStroke="#FFFFFF"
            stroke="#FFFFFF"
            opacity={0.5}
            {...xGrid}
          />
          />
          <YAxis
            axisAt="right"
            orient="right"
            ticks={5}
            tickStroke="#FFFFFF"
            stroke="#FFFFFF"
            opacity={0.5}
            {...yGrid}
          />
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format(".2f")}
            {...mouseEdgeAppearance}
          />
          <CandlestickSeries
            opacity="1.0"
            stroke={d => (d.close > d.open ? "#32CD32" : "#FF0000")}
            wickStroke={d => (d.close > d.open ? "#32CD32" : "#FF0000")}
            fill={d => (d.close > d.open ? "#32CD32" : "#FF0000")}
          />
          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
			yAccessor={d => d.close}
			lineStroke="#ffffff"
            fill={d => (d.close > d.open ? "#6BA583" : "#DB0000")}
          />
          <InteractiveYCoordinate
            ref={this.saveInteractiveNodes("InteractiveYCoordinate", 1)}
            enabled={this.state.enableInteractiveObject}
            onDragComplete={this.onDragComplete}
            onDelete={this.onDelete}
            yCoordinateList={this.props.orderChartItems}
          />
        </Chart>
        <CrossHairCursor stroke="#FFFFFF" />
      </ChartCanvas>
    );
  }
}

CandleStickChart.propTypes = {
  orderChartItems: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onChanged: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired
};

CandleStickChart.defaultProps = {
  type: "svg"
};

CandleStickChart = fitWidth(CandleStickChart);

export default CandleStickChart;
