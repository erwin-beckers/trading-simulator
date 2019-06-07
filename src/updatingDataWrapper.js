import React from "react";

function getDisplayName(ChartComponent) {
  const name =
    ChartComponent.displayName || ChartComponent.name || "ChartComponent";
  return name;
}

export default function updatingDataWrapper(ChartComponent) {
  const LENGTH = 130;

  class UpdatingComponentHOC extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        length: LENGTH,
        data: this.props.data.slice(0, LENGTH)
      };
      this.speed = 1000;
      this.onKeyPress = this.onKeyPress.bind(this);
    }
    componentDidMount() {
      document.addEventListener("keydown", this.onKeyPress);
    }
    componentWillUnmount() {
      if (this.interval) clearInterval(this.interval);
      document.removeEventListener("keydown", this.onKeyPress);
    }
    onKeyPress(e) {
      const keyCode = e.which;
      switch (keyCode) {
        case 32:
        case 39: // Right
          if (this.state.length < this.props.data.length) {
            this.props.onPriceChanged(this.props.data[this.state.length]);
            let newData = this.props.data.slice(0, this.state.length + 1);
            for (let i = 0; i < 20; ++i) {
              newData.push({
                date: this.props.data[i + this.state.length + 1].date
              });
            }
            this.setState({
              length: this.state.length + 1,
              data: newData
            });
          }
          break;

        case 37: // Left
          if (this.state.length > 0) {
            this.props.onPriceChanged(this.props.data[this.state.length]);
            let newData = this.props.data.slice(0, this.state.length - 1);
            for (let i = 0; i < 20 && i + this.state.length - 1 >= 0; ++i) {
              newData.push({
                date: this.props.data[i + this.state.length - 1].date
              });
            }
            this.setState({
              length: this.state.length - 1,
              data: newData
            });
          }
          break;

        case 50: {
          // 2 (50) - Start alter data
          this.func = () => {
            if (this.state.length < this.props.data.length) {
              this.setState({
                length: this.state.length + 1,
                data: this.props.data.slice(0, this.state.length + 1)
              });
            }
          };
          break;
        }
        case 80:
        case 49: {
          // 1 (49) - Start Push data
          this.func = () => {
            if (this.state.length < this.props.data.length) {
              this.setState({
                length: this.state.length + 1,
                data: this.props.data.slice(0, this.state.length + 1)
              });
            }
          };
          break;
        }
        case 27: {
          // ESC (27) - Clear interval
          this.func = null;
          if (this.interval) clearInterval(this.interval);
          break;
        }
        case 107: {
          // + (107) - increase the this.speed
          this.speed = Math.max(this.speed / 2, 50);
          break;
        }
        case 109:
        case 189: {
          // - (189, 109) - reduce the this.speed
          const delta = Math.min(this.speed, 1000);
          this.speed = this.speed + delta;
          break;
        }
        default:
          break;
      }
      if (this.func) {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(this.func, this.speed);
      }
    }
    render() {
      const { type } = this.props;
      const { data } = this.state;

      return <ChartComponent ref="component" orderChartItems={this.props.orderChartItems} onClose={this.props.onClose} onChanged={this.props.onChanged} data={data} type={type} />;
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
