import React from "react";
import { render } from "react-dom";
import TopToolBar from "./TopToolBar";
import Orders from "./Orders";
import ChartComponent from "./Chart";
import { getData } from "./utils";
import { TypeChooser } from "react-stockcharts/lib/helper";
import { InteractiveYCoordinate } from "react-stockcharts/lib/interactive";
import shortid from "shortid";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";

const sell = {
  ...InteractiveYCoordinate.defaultProps.defaultPriceCoordinate,
  stroke: "white",
  textFill: "white",
  bgFill: "red",
  text: "1 Sell STP",
  edge: {
    ...InteractiveYCoordinate.defaultProps.defaultPriceCoordinate.edge,
    stroke: "white",
    textFill: "white",
    fill: "red"
  }
};
const buy = {
  ...InteractiveYCoordinate.defaultProps.defaultPriceCoordinate,
  stroke: "white",
  bgFill: "#32CD32",
  textFill: "black",
  text: "1 Sell LMT",
  edge: {
    ...InteractiveYCoordinate.defaultProps.defaultPriceCoordinate.edge,
    stroke: "white",
    fill: "#32CD32"
  }
};
const open = {
  ...InteractiveYCoordinate.defaultProps.defaultPriceCoordinate,
  stroke: "white",
  textFill: "32CD32",
  text: "1 (0.00)",
  bgFill: "transparent",
  textBox: {
    height: 24,
    left: 20,
    padding: { left: 10, right: 5 },
    closeIcon: {
      padding: { left: 0, right: 0 },
      width: 0
    }
  },
  edge: {
    ...InteractiveYCoordinate.defaultProps.defaultPriceCoordinate.edge,
    stroke: "white"
  }
};

class RootComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      orderChartItems: [],
      initialCapital: 10000,
      capital: 10000,
      percentage: 0,
      tickSize: 0.25,
      tickValue: 12.5,
      currentPrice: undefined,
      chartHeight: this.getWindowHeight() - 100,
      startDate: "1/1/2019"
    };
  }

  createOrder(
    id,
    type,
    size,
    open,
    stoploss,
    takeprofit,
    profitloss,
    isopened
  ) {
    return { id, type, size, open, stoploss, takeprofit, profitloss, isopened };
  }

  addOrderChartItems(order, orderChartItems) {
    if (orderChartItems.length === 0) {
      let openOrder = {
        ...open,
        yValue: order.open,
        id: shortid.generate(),
        draggable: false
      };
      orderChartItems.push(openOrder);
    }

    if (order.type === "Long") {
      let buyLimit = {
        ...buy,
        yValue: order.open,
        id: shortid.generate(),
        draggable: true,
        order: order,
        text: "1 Buy LMT"
      };
      let takeProfit = {
        ...buy,
        yValue: order.takeprofit,
        id: shortid.generate(),
        draggable: true,
        order: order
      };
      let stopLoss = {
        ...sell,
        yValue: order.stoploss,
        id: shortid.generate(),
        draggable: true,
        order: order
      };
      order.chartTakeProfit = takeProfit;
      order.chartStoploss = stopLoss;
      orderChartItems.push(takeProfit);
      orderChartItems.push(stopLoss);
      if (!order.isopened) {
        order.chartOpen = buyLimit;
        orderChartItems.push(buyLimit);
      }
    } else {
      let sellLimit = {
        ...sell,
        yValue: order.open,
        id: shortid.generate(),
        draggable: true,
        order: order,
        text: "1 Sell LMT"
      };
      let takeProfit = {
        ...sell,
        yValue: order.takeprofit,
        id: shortid.generate(),
        draggable: true,
        order: order,
        text: "1 Buy STP"
      };
      let stopLoss = {
        ...buy,
        yValue: order.stoploss,
        id: shortid.generate(),
        draggable: true,
        order: order,
        text: "1 Buy LMT"
      };
      order.chartTakeProfit = takeProfit;
      order.chartStoploss = stopLoss;
      orderChartItems.push(takeProfit);
      orderChartItems.push(stopLoss);
      if (!order.isopened) {
        order.chartOpen = sellLimit;
        orderChartItems.push(sellLimit);
      }
    }
  }

  removeOrderChartItems(order, orderChartItems) {
    let items = [];
    for (let i = 0; i < orderChartItems.length; ++i) {
      if (orderChartItems[i].order !== order) {
        items.push(orderChartItems[i]);
      }
    }
    return items;
  }

  removeChartItems(chartItemsToRemove, orderChartItems) {
    let items = [];
    for (let i = 0; i < orderChartItems.length; ++i) {
      let found = false;
      for (let x = 0; x < chartItemsToRemove.length; ++x) {
        if (orderChartItems[i] === chartItemsToRemove[x]) {
          found = true;
          break;
        }
      }

      if (!found) {
        items.push(orderChartItems[i]);
      }
    }
    return items;
  }

  onBuyMarketOrder() {
    if (!this.state.currentPrice) return;
    let now = new Date().getTime();
    var newOrder = this.createOrder(
      now,
      "Long",
      1,
      this.state.currentPrice.close,
      this.state.currentPrice.close - 4,
      this.state.currentPrice.close + 4,
      0,
      true
    );
    let newOrders = this.state.orders.slice();
    newOrders.push(newOrder);
    this.setState({ orders: newOrders });

    let orderChartItems = this.state.orderChartItems.slice();
    this.addOrderChartItems(newOrder, orderChartItems);
    this.updateOpenPosition(newOrders, orderChartItems);
    this.setState({ orderChartItems: orderChartItems });
  }

  onSellMarketOrder() {
    if (!this.state.currentPrice) return;
    let now = new Date().getTime();
    var newOrder = this.createOrder(
      now,
      "Short",
      1,
      this.state.currentPrice.close,
      this.state.currentPrice.close + 4,
      this.state.currentPrice.close - 4,
      0,
      true
    );
    let newOrders = this.state.orders.slice();
    newOrders.push(newOrder);
    this.setState({ orders: newOrders });

    let orderChartItems = this.state.orderChartItems.slice();
    this.addOrderChartItems(newOrder, orderChartItems);
    this.updateOpenPosition(newOrders, orderChartItems);
    this.setState({ orderChartItems: orderChartItems });
  }

  onBuyLimitOrder() {
    if (!this.state.currentPrice) return;
    let now = new Date().getTime();
    var newOrder = this.createOrder(
      now,
      "Long",
      1,
      this.state.currentPrice.close + 2,
      this.state.currentPrice.close - 2,
      this.state.currentPrice.close + 6,
      0,
      false
    );
    let newOrders = this.state.orders.slice();
    newOrders.push(newOrder);
    this.setState({ orders: newOrders });

    let orderChartItems = this.state.orderChartItems.slice();
    this.addOrderChartItems(newOrder, orderChartItems);
    this.updateOpenPosition(newOrders, orderChartItems);
    this.setState({ orderChartItems: orderChartItems });
  }

  onSellLimitOrder() {
    if (!this.state.currentPrice) return;
    let now = new Date().getTime();
    var newOrder = this.createOrder(
      now,
      "Short",
      1,
      this.state.currentPrice.close - 2,
      this.state.currentPrice.close + 2,
      this.state.currentPrice.close - 6,
      0,
      false
    );
    let newOrders = this.state.orders.slice();
    newOrders.push(newOrder);
    this.setState({ orders: newOrders });

    let orderChartItems = this.state.orderChartItems.slice();
    this.addOrderChartItems(newOrder, orderChartItems);
    this.updateOpenPosition(newOrders, orderChartItems);
    this.setState({ orderChartItems: orderChartItems });
  }

  onCloseOrder(order) {
    if (order.isopened) {
      this.setState({
        capital: this.state.capital + order.profitloss,
        percentage:
          (100.0 *
            (this.state.capital +
              order.profitloss -
              this.state.initialCapital)) /
          this.state.initialCapital
      });
    }
    let newOrders = this.state.orders.slice();
    let index = newOrders.indexOf(order);
    if (index >= 0) {
      newOrders.splice(index, 1);
      this.setState({ orders: newOrders });
    }
    if (newOrders.length === 0) {
      this.setState({ orderChartItems: [] });
      return;
    }
    let orderChartItems = this.removeOrderChartItems(
      order,
      this.state.orderChartItems
    );
    this.updateOpenPosition(newOrders, orderChartItems);
    this.setState({ orderChartItems: orderChartItems });
  }

  onOrderChanged(order) {
    order.chartTakeProfit.yValue = order.takeprofit;
    order.chartStoploss.yValue = order.stoploss;
    if (!order.isopened && order.chartOpen) {
      order.chartOpen.yValue = order.open;
    }
    let newOrders = this.state.orders.slice();
    this.setState({
      orders: newOrders
    });
  }

  calculateProfit(order, price) {
    if (order.type === "Long") {
      return (
        ((price - order.open) / this.state.tickSize) * this.state.tickValue
      );
    } else {
      return (
        ((order.open - price) / this.state.tickSize) * this.state.tickValue
      );
    }
  }

  closeOrdersTPorSL(price) {
    if (this.state.orders.length == 0) {
      return;
    }

    let ordersToClose = [];
    let chartItemsToRemove = [];
    for (let i = 0; i < this.state.orders.length; ++i) {
      let order = this.state.orders[i];
      if (!order.isopened) {
        if (order.type === "Long") {
          if (price.high >= order.open) {
            order.isopened = true;
            order.profitloss = this.calculateProfit(order, order.stoploss);
            chartItemsToRemove.push(order.chartOpen);
            order.chartOpen = null;
          }
        } else {
          if (price.low <= order.open) {
            order.isopened = true;
            order.profitloss = this.calculateProfit(order, order.stoploss);
            chartItemsToRemove.push(order.chartOpen);
            order.chartOpen = null;
          }
        }
      }
    }
    for (let i = 0; i < this.state.orders.length; ++i) {
      let order = this.state.orders[i];
      if (!order.isopened) continue;

      if (order.type === "Long") {
        if (price.low <= order.stoploss) {
          // stoploss hit, close order
          order.profitloss = this.calculateProfit(order, order.stoploss);
          ordersToClose.push(order);
        } else if (price.high >= order.takeprofit) {
          // takeprofit hit, close order
          order.profitloss = this.calculateProfit(order, order.takeprofit);
          ordersToClose.push(order);
        }
        order.profitloss = this.calculateProfit(order, price.close);
      } else {
        // short
        if (price.high >= order.stoploss) {
          // stoploss hit, close order
          order.profitloss = this.calculateProfit(order, order.stoploss);
          ordersToClose.push(order);
        } else if (price.low <= order.takeprofit) {
          // takeprofit hit, close order
          order.profitloss = this.calculateProfit(order, order.takeprofit);
          ordersToClose.push(order);
        }
        order.profitloss = this.calculateProfit(order, price.close);
      }
    }

    if (ordersToClose.length) {
      for (let i = 0; i < ordersToClose.length; ++i) {
        this.onCloseOrder(ordersToClose[i]);
      }
    }
    let newOrders = this.state.orders.slice();
    var chartItems = this.state.orderChartItems.slice();
    if (chartItemsToRemove.length > 0) {
      chartItems = this.removeChartItems(chartItemsToRemove, chartItems);
    }
    this.updateOpenPosition(newOrders, chartItems);
    this.setState({
      orders: newOrders,
      orderChartItems: chartItems
    });
  }

  onPriceChanged(price) {
    this.setState({ currentPrice: price });
    this.closeOrdersTPorSL(price);
  }

  updateOpenPosition(orders, orderChartItems) {
    if (orders.length <= 0 || orderChartItems.length <= 0) {
      return;
    }
    let averagePrice = 0;
    let totalProfitLoss = 0;

    for (let i = 0; i < orders.length; ++i) {
      if (orders[i].isopened) {
        averagePrice += orders[i].open;
        totalProfitLoss += orders[i].profitloss;
      }
    }
    averagePrice /= orders.length;
    orderChartItems[0].yValue = averagePrice;
    if (totalProfitLoss >= 0) {
      orderChartItems[0].text =
        orders.length + " $" + totalProfitLoss.toFixed(2);
      orderChartItems[0].textFill = "#32CD32";
    } else {
      orderChartItems[0].text =
        orders.length + " $(" + +totalProfitLoss.toFixed(2) + ")";
      orderChartItems[0].textFill = "#FF0000";
    }
  }

  getWindowHeight() {
    let w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName("body")[0];
    return w.innerHeight || e.clientHeight || g.clientHeight;
  }

  onOrdersTableHeightChanged(height) {
    var height = this.getWindowHeight() - (height + 70);
    var self = this;
    setTimeout(() => {
      self.setState({ chartHeight: height });
    }, 100);
  }

  onGotoDate(date) {
    this.setState({
      startDate: date
    });
  }

  render() {
    return (
      <div>
        <TopToolBar
          onBuyMarket={this.onBuyMarketOrder.bind(this)}
          onSellMarket={this.onSellMarketOrder.bind(this)}
          onBuyLimit={this.onBuyLimitOrder.bind(this)}
          onSellLimit={this.onSellLimitOrder.bind(this)}
          onGotoDate={this.onGotoDate.bind(this)}
          capital={this.state.capital}
          percentage={this.state.percentage}
        />
        <SplitterLayout
          vertical={true}
          percentage={false}
          secondaryInitialSize={230}
          onSecondaryPaneSizeChange={this.onOrdersTableHeightChanged.bind(this)}
        >
          <ChartComponent
            orderChartItems={this.state.orderChartItems}
            onClose={this.onCloseOrder.bind(this)}
            onChanged={this.onOrderChanged.bind(this)}
            onPriceChanged={this.onPriceChanged.bind(this)}
            chartHeight={this.state.chartHeight}
            startDate={this.state.startDate}
          />
          <Orders
            orders={this.state.orders}
            onClose={this.onCloseOrder.bind(this)}
            onChanged={this.onOrderChanged.bind(this)}
          />
        </SplitterLayout>
      </div>
    );
  }
}

render(<RootComponent>,</RootComponent>, document.getElementById("root"));
