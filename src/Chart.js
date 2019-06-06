
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
	BarSeries,
	BollingerSeries,
	CandlestickSeries,
	LineSeries,
	StochasticSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	EdgeIndicator,
	CurrentCoordinate,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import {
	OHLCTooltip,
	MovingAverageTooltip,
	BollingerBandTooltip,
	StochasticTooltip,
	GroupTooltip,
} from "react-stockcharts/lib/tooltip";
import { ema, stochasticOscillator, bollingerBand } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

const bbAppearance = {
	stroke: {
		top: "#964B00",
		middle: "#FF6600",
		bottom: "#964B00",
	},
	fill: "#4682B4"
};
const stoAppearance = {
	stroke: Object.assign({},
		StochasticSeries.defaultProps.stroke,
		{ top: "#37a600", middle: "#b8ab00", bottom: "#37a600" })
};

class CandleStickChartWithDarkTheme extends React.Component {
	render() {
		const height = 750;
		const { type, data: initialData, width, ratio } = this.props;

		const margin = { left: 70, right: 70, top: 20, bottom: 30 };

		const gridHeight = height - margin.top - margin.bottom;
		const gridWidth = width - margin.left - margin.right;

		const showGrid = true;
		const yGrid = showGrid ? { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.2 } : {};
		const xGrid = showGrid ? { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.2 } : {};


		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(initialData);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start, end];


		return (
			<ChartCanvas height={750}
				width={width}
				ratio={ratio}
				margin={margin}
				type={type}
				seriesName="MSFT"
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
			>


				<Chart id={1} height={675}
					yExtents={[d => [d.high, d.low]]}
					padding={{ top: 10, bottom: 20 }}
				>
				<YAxis axisAt="left" orient="left" ticks={5} {...yGrid} inverted={true}
					tickStroke="#FFFFFF" />
					<YAxis axisAt="right" orient="right" ticks={5} {...yGrid} inverted={true}
						tickStroke="#FFFFFF" />
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0}
						stroke="#FFFFFF" opacity={0.5} />
					<XAxis axisAt="top" orient="top" showTicks={false} outerTickSize={0}
						stroke="#FFFFFF" opacity={0.5} />

					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<CandlestickSeries
					    opacity="1.0"
						stroke={d => d.close > d.open ? "#00AA00" : "#ff0000"}
						wickStroke={d => d.close > d.open ? "#00AA00" : "#ff0000"}
						fill={d => d.close > d.open ? "#00AA00" : "#ff0000"} />
						
					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#DB0000"}/>

				
				</Chart>
				<Chart id={2}
					yExtents={d => d.volume}
					height={100} origin={(w, h) => [0, h - 100]}
				>
					<XAxis axisAt="bottom" orient="bottom"
						{...xGrid}
						tickStroke="#FFFFFF"
						stroke="#FFFFFF" />
					<YAxis axisAt="right" orient="right"
						tickValues={[20, 50, 80]}
						tickStroke="#FFFFFF"/>

					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />
					<BarSeries
						yAccessor={d => d.volume}
						fill={d => d.close > d.open ? "#6BA583" : "#DB0000"} />
				</Chart>
				<CrossHairCursor stroke="#FFFFFF" />
			</ChartCanvas>
		);
	}
}
CandleStickChartWithDarkTheme.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithDarkTheme.defaultProps = {
	type: "svg",
};
CandleStickChartWithDarkTheme = fitWidth(CandleStickChartWithDarkTheme);

export default CandleStickChartWithDarkTheme;
