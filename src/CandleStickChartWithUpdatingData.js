import CandleStickChart from "./CandleStickChart";
import updatingDataWrapper from "./updatingDataWrapper";

const CandleStickChartWithUpdatingData = updatingDataWrapper(CandleStickChart);

export default CandleStickChartWithUpdatingData;
