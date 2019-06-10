import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";

import { ChartCanvas, Chart, ZoomButtons } from "react-stockcharts";
import {
  BarSeries,
  AreaSeries,
  CandlestickSeries,
  LineSeries
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
  CrossHairCursor,
  CurrentCoordinate,
  EdgeIndicator,
  MouseCoordinateY
} from "react-stockcharts/lib/coordinates";
import { saveInteractiveNodes, getInteractiveNodes } from "./interactiveutils";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { ema, sma } from "react-stockcharts/lib/indicator";
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
      enableInteractiveObject: false,
			suffix: 1
    };
  }

  onDelete(yCoordinate, moreProps) {
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
    let price = round(draggedAlert.yValue);
    let order = draggedAlert.order;
    if (draggedAlert.id === order.chartTakeProfit.id) {
      order.takeprofit = price;
      this.props.onChanged(order);
    }
    if (draggedAlert.id === order.chartStoploss.id) {
      order.stoploss = price;
      this.props.onChanged(order);
    }
    if (order.chartOpen && draggedAlert.id === order.chartOpen.id && !order.isopened) {
      order.open = price;
      this.props.onChanged(order);
    }
  }
	handleReset() {
		this.setState({
			suffix: this.state.suffix + 1
		});
	}

  render() {
    const ema20 = ema()
      .id(0)
      .options({ windowSize: 20 })
      .merge((d, c) => {
        d.ema20 = c;
      })
      .accessor(d => d.ema20);

    const ema50 = ema()
      .id(2)
      .options({ windowSize: 50 })
      .merge((d, c) => {
        d.ema50 = c;
      })
      .accessor(d => d.ema50);

    const smaVolume70 = sma()
      .id(3)
      .options({ windowSize: 70, sourcePath: "volume" })
      .merge((d, c) => {
        d.smaVolume70 = c;
      })
      .accessor(d => d.smaVolume70);

    const { type, data: initialData, width, ratio } = this.props;

    const calculatedData = ema20(ema50(smaVolume70(initialData)));
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      d => d.date
    );
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      calculatedData
    );

    const margin = { left: 70, right: 70, top: 20, bottom: 30 };
    const height = this.props.chartHeight;
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
        seriesName={`MSFT_${this.state.suffix}`}
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
      >
        <Chart
          id={2}
          yExtents={[d => d.volume, smaVolume70.accessor()]}
          height={100}
          origin={(w, h) => [0, h - 100]}
        >
          <YAxis
            axisAt="left"
            orient="left"
            ticks={5}
            tickStroke="#FFFFFF"
            stroke="#FFFFFF"
            tickFormat={format(".2s")}
          />

          <BarSeries
            yAccessor={d => d.volume}
            fill={d => (d.close > d.open ? "#6BA583" : "#FF0000")}
          />
          <AreaSeries
            yAccessor={smaVolume70.accessor()}
            stroke={smaVolume70.stroke()}
            fill={smaVolume70.fill()}
          />

          <CurrentCoordinate
            yAccessor={smaVolume70.accessor()}
            fill={smaVolume70.stroke()}
          />
          <CurrentCoordinate yAccessor={d => d.volume} fill="#9B0A47" />

          <EdgeIndicator
            itemType="first"
            orient="left"
            edgeAt="left"
            yAccessor={d => d.volume}
            displayFormat={format(".4s")}
            fill="#0F0F0F"
          />
          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={d => d.volume}
            displayFormat={format(".4s")}
            fill="#0F0F0F"
          />
          <EdgeIndicator
            itemType="first"
            orient="left"
            edgeAt="left"
            yAccessor={smaVolume70.accessor()}
            displayFormat={format(".4s")}
            fill={smaVolume70.fill()}
          />
          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={smaVolume70.accessor()}
            displayFormat={format(".4s")}
            fill={smaVolume70.fill()}
          />
        </Chart>
        <Chart
          id={1}
          height={height - 50}
          yPan
          yExtents={[d => [d.high, d.low], ema20.accessor(), ema50.accessor()]}
          padding={{ top: 10, bottom: 20 }}
        >
          <XAxis
            axisAt="bottom"
            orient="bottom"
            tickStroke="#FFFFFF"
            stroke="#FFFFFF"
            opacity={0.5}
            {...xGrid}
            ticks={12}
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
            fill={d => (d.close > d.open ? "transparent" : "#FF0000")}
          />
          <LineSeries
            yAccessor={ema20.accessor()}
            stroke={ema20.stroke()}
            highlightOnHover
          />
          <LineSeries
            yAccessor={ema50.accessor()}
            stroke={ema50.stroke()}
            highlightOnHover
          />
          <CurrentCoordinate
            yAccessor={ema20.accessor()}
            fill={ema20.stroke()}
          />
          <CurrentCoordinate
            yAccessor={ema50.accessor()}
            fill={ema50.stroke()}
          />
          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={d => d.close}
            lineStroke="#ffffff"
            fill={d => (d.close > d.open ? "#6BA583" : "#DB0000")}
          />
          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={ema20.accessor()}
            fill={ema20.fill()}
          />
          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={ema50.accessor()}
            fill={ema50.fill()}
          />
          <InteractiveYCoordinate
            ref={this.saveInteractiveNodes("InteractiveYCoordinate", 1)}
            enabled={this.state.enableInteractiveObject}
            onDragComplete={this.onDragComplete}
            onDelete={this.onDelete}
            yCoordinateList={this.props.orderChartItems}
          />
					<ZoomButtons
						onReset={this.handleReset.bind(this)}
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
  chartHeight: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired
};

CandleStickChart.defaultProps = {
  type: "svg"
};

CandleStickChart = fitWidth(CandleStickChart);

export default CandleStickChart;
