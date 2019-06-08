import React from "react";

function getDisplayName(ChartComponent) {
  const name =
    ChartComponent.displayName || ChartComponent.name || "ChartComponent";
  return name;
}

export default function updatingDataWrapper(ChartComponent) {
  const LENGTH = 300;

  class UpdatingComponentHOC extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        offset: 0,
        data: this.getData(0)
      };
      this.onKeyPress = this.onKeyPress.bind(this);
    }

    componentDidUpdate(prevProps) {
      if (this.props.startDate !== prevProps.startDate) {
        var startDate = Date.parse(this.props.startDate);
        for (let i = 0; i < this.props.data.length; ++i) {
          let date = this.props.data[i].date;
          if (date >= startDate) {
            let offset = Math.max(0, i - LENGTH);
            let newData = this.getData(offset);
            this.updateData(newData, offset);
            return;
          }
        }
      }
    }

    componentDidMount() {
      document.addEventListener("keydown", this.onKeyPress);
    }

    componentWillUnmount() {
      if (this.interval) clearInterval(this.interval);
      document.removeEventListener("keydown", this.onKeyPress);
    }

    getData(offset) {
      let newData = this.props.data.slice(offset + 1, offset + 1 + LENGTH);
      let currentPrice=newData[newData.length - 1];
      this.setState({
        currentPrice:currentPrice
      });
      for (let i = 0; i < 20; ++i) {
        newData.push({
          date: currentPrice.date
        });
      }
      return newData;
    }

    updateData(newData, offset) {
      this.setState({
        offset: offset,
        data: newData
      });
      this.props.onPriceChanged(this.state.currentPrice);
    }

    onKeyPress(e) {
      const keyCode = e.which;
      switch (keyCode) {
        case 32:
        case 39: // Right
          let newOffset = this.state.offset + 1;
          if (newOffset + LENGTH < this.props.data.length) {
            let newData = this.getData(newOffset);
            this.updateData(newData, newOffset);
          }
          break;

        case 37: // Left
          if (this.state.offset > 0) {
            let newData = this.getData(this.state.offset - 1);
            this.updateData(newData, this.state.offset - 1);
          }
          break;
      }
    }
    render() {
      const { type } = this.props;
      const { data } = this.state;

      return (
        <ChartComponent
          ref="component"
          orderChartItems={this.props.orderChartItems}
          onClose={this.props.onClose}
          onChanged={this.props.onChanged}
          data={data}
          type={type}
          chartHeight={this.props.chartHeight}
        />
      );
    }
  }
  UpdatingComponentHOC.defaultProps = {
    type: "svg"
  };
  UpdatingComponentHOC.displayName = `updatingDataWrapper(${getDisplayName(
    ChartComponent
  )})`;

  return UpdatingComponentHOC;
}
