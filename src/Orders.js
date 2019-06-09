import React from "react";
import PropTypes from "prop-types";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import TabContainer from "./TabContainer";


const StyledTabs = withStyles({
  root:{
    minHeight: "auto",
    padding: 0
  },
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#303030",
    "& > div": {
      maxWidth: 100,
      width: "100%",
      backgroundColor: "white"
    }
  }
})(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const StyledTab = withStyles(theme => ({
  root: {
    textTransform: "none",
    color: "#fff",
    backgroundColor: "#303030",
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(12),
    marginRight: "1px",
    "&:focus": {
      opacity: 1
    },
    minHeight: "auto",
    padding:2
  }
}))(props => <Tab disableRipple {...props} />);

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    backgroundColor: "#303030",
    color: theme.palette.common.white,
    fontSize: 12,
    padding:0
  }
}))(TableCell);

class Orders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0
    };
  }

  closeOrder(order) {
    this.props.onClose(order);
  }

  onMoveToBreakEven(order) {
    if (order.profitloss > 0) {
      order.stoploss = order.open;
      this.props.onChanged(order);
    }
  }

  handleChange(event, newValue) {
    this.setState({
      tabIndex: newValue
    });
  }

  handleChangeIndex(index) {
    this.setState({
      tabIndex: index
    });
  }

  render() {
    return (
      <div style={{height:"100%"}} >
        <AppBar position="static" color="default">
          <StyledTabs
            value={this.state.tabIndex}
            onChange={this.handleChange.bind(this)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <StyledTab label="Orders" />
            <StyledTab label="History" />
            <StyledTab label="Statistics" />
          </StyledTabs>
        </AppBar>
        {this.state.tabIndex === 0 && (
          <div  style={{overflow:'auto', height:'calc(100% - 110px)'}}>
            <Table size="small" style={{padding:0}}>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Type</StyledTableCell>
                  <StyledTableCell align="center">Size</StyledTableCell>
                  <StyledTableCell align="center">Open</StyledTableCell>
                  <StyledTableCell align="center">Stoploss</StyledTableCell>
                  <StyledTableCell align="center">Take profit</StyledTableCell>
                  <StyledTableCell align="center">P/L</StyledTableCell>
                  <StyledTableCell align="center">B/E</StyledTableCell>
                  <StyledTableCell align="center">Close</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.orders.map(row => (
                  <TableRow key={row.id}>
                    <StyledTableCell align="center">{row.type}</StyledTableCell>
                    <StyledTableCell align="center">{row.size}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.open.toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.stoploss.toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.takeprofit.toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      ${row.profitloss.toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => this.onMoveToBreakEven(row)}
                      >
                        B/E
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => this.closeOrder(row)}
                      >
                        Close
                      </Button>
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
        )}
        {this.state.tabIndex === 1 && (
          <div  style={{overflow:'auto', height:'calc(100% - 110px)'}}>
            <Table size="small" style={{padding:0}}>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">Date</StyledTableCell>
                  <StyledTableCell align="center">Type</StyledTableCell>
                  <StyledTableCell align="center">Size</StyledTableCell>
                  <StyledTableCell align="center">Open</StyledTableCell>
                  <StyledTableCell align="center">Stoploss</StyledTableCell>
                  <StyledTableCell align="center">Take profit</StyledTableCell>
                  <StyledTableCell align="center">P/L</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.history.map(row => (
                  <TableRow key={row.id}>
                  <StyledTableCell align="center">{row.date.toLocaleString()}</StyledTableCell>
                    <StyledTableCell align="center">{row.type}</StyledTableCell>
                    <StyledTableCell align="center">{row.size}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.open.toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.stoploss.toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.takeprofit.toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      ${row.profitloss.toFixed(2)}
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
        )}
      </div>
    );
  }
}

Orders.propTypes = {
  orders: PropTypes.array.isRequired,
  history: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onChanged: PropTypes.func.isRequired
};

export default Orders;
