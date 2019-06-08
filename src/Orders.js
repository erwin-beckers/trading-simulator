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

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    backgroundColor: "#303030",
    color: theme.palette.common.white,
    fontSize: 14
  }
}))(TableCell);

class Orders extends React.Component {
  constructor(props) {
    super(props);
    this.classes = makeStyles(theme => ({
      root: {
        width: "100%",
        height: "calc(100vh - 800px)"
      },
      paper: {
        marginTop: theme.spacing(3),
        width: "100%",
        overflowX: "auto",
        marginBottom: theme.spacing(2)
      },
      table: {
        minWidth: 650
      }
    }));
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
  render() {
    return (
      <div className={this.classes.root}>
        <Paper className={this.classes.paper}>
          <Table className={this.classes.table} size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell align="right">Type</StyledTableCell>
                <StyledTableCell align="right">Size</StyledTableCell>
                <StyledTableCell align="right">Open</StyledTableCell>
                <StyledTableCell align="right">Stoploss</StyledTableCell>
                <StyledTableCell align="right">Take profit</StyledTableCell>
                <StyledTableCell align="right">P/L</StyledTableCell>
                <StyledTableCell align="right">B/E</StyledTableCell>
                <StyledTableCell align="right">Close</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.orders.map(row => (
                <TableRow key={row.id}>
                  <StyledTableCell align="right">{row.type}</StyledTableCell>
                  <StyledTableCell align="right">{row.size}</StyledTableCell>
                  <StyledTableCell align="right">
                    {row.open.toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.stoploss.toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.takeprofit.toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    ${row.profitloss.toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      variant="outlined"
                      color="primary"
                      className={this.classes.button}
                      onClick={() => this.onMoveToBreakEven(row)}
                    >
                      B/E
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      variant="outlined"
                      color="primary"
                      className={this.classes.button}
                      onClick={() => this.closeOrder(row)}
                    >
                      Close
                    </Button>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

Orders.propTypes = {
  orders: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onChanged: PropTypes.func.isRequired
};

export default Orders;
