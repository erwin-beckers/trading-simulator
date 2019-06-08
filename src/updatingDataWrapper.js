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
        data: this.props.data.slice(0, LENGTH)
      };
      this.updateData(0);
      this.onKeyPress = this.onKeyPress.bind(this);
    }

    componentDidMount() {
      document.addEventListener("keydown", this.onKeyPress);
    }

    componentWillUnmount() {
      if (this.interval) clearInterval(this.interval);
      document.removeEventListener("keydown", this.onKeyPress);
    }

    updateData(offset) {
      let newData = this.props.data.slice(offset + 1, offset + 1 + LENGTH);
      var currentPrice = newData[newData.length - 1];
      for (let i = 0; i < 20; ++i) {
        newData.push({
          date: currentPrice.date
        });
      }
      this.setState({
        offset: offset,
        data: newData
      });
      this.props.onPriceChanged(currentPrice);
    }

    onKeyPress(e) {
      const keyCode = e.which;
      switch (keyCode) {
        case 32:
        case 39: // Right
          let newOffset = this.state.offset + 1;
          if (newOffset + LENGTH < this.props.data.length) {
            this.updateData(newOffset);
          }
          break;

        case 37: // Left
          if (this.state.offset > 0) {
            this.updateData(this.state.offset - 1);
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
