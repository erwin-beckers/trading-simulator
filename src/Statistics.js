import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    backgroundColor: "#303030",
    color: theme.palette.common.white,
    fontSize: 12,
    padding: 0,
    border:'none',
    width:"130px"
  }
}))(TableCell);

class Statistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: this.getStatistics()
    };
  }

  getStatistics() {
    let rows = [];
    let grossProfit = 0;
    let grossLoss = 0;
    let winners = 0;
    let losers = 0;
    let maxLoser=0;
    let maxWinner=0;
    let maxWinningStreak=0;
    let maxLosingStreak=0;
    let currentWinningStreak=0;
    let currentLosingStreak=0;
    for (let i = 0; i < this.props.history.length; ++i) {
      let order = this.props.history[i];
      if (order.profitloss >= 0) {
        winners++;
        grossProfit += order.profitloss;
        if (order.profitloss > maxWinner) maxWinner=order.profitloss;
        currentWinningStreak++;
        currentLosingStreak=0;
        if (currentWinningStreak > maxWinningStreak)
        {
          maxWinningStreak=currentWinningStreak;
        }
      } else {
        losers++;
        grossLoss += order.profitloss;
        if (order.profitloss < maxLoser) maxLoser=order.profitloss;
        currentLosingStreak++;
        currentWinningStreak=0;
        if (currentLosingStreak > maxLosingStreak)
        {
          maxLosingStreak=currentLosingStreak;
        }
      }
    }
    let netProfit = grossProfit + grossLoss;
    let profitFactor = Math.abs(grossProfit / grossLoss);
    let winRatio = 100.0 * (winners / this.props.history.length);
    let avgWinner = grossProfit / winners;
    let avgLoser = grossLoss / losers;
    let probabilityWin=(winners / this.props.history.length);
    let probabilityLoose=(losers / this.props.history.length);
    let expectedValue = (probabilityWin * avgWinner) - (probabilityLoose * avgLoser);
    rows.push({ key: "Net profit", value: "$ " + netProfit.toFixed(2) });
    rows.push({ key: "Gross profit", value: "$ " + grossProfit.toFixed(2) });
    rows.push({ key: "Gross loss", value: "$ " + grossLoss.toFixed(2) });
    rows.push({ key: "Trades", value: this.props.history.length });
    rows.push({ key: "Profit factor ", value: profitFactor.toFixed(2) });
    rows.push({ key: "Win ratio ", value: winRatio.toFixed(2) + "%" });
    rows.push({ key: "Winners ", value: winners });
    rows.push({ key: "Losers ", value: losers });
    rows.push({ key: "Max winning streak ", value: maxWinningStreak });
    rows.push({ key: "Max losing streak ", value: maxLosingStreak });
    rows.push({ key: "Max winner ", value: "$ " + maxWinner.toFixed(2)});
    rows.push({ key: "Max loser ", value: "$ " + maxLoser.toFixed(2) });
    rows.push({ key: "Avg winner ", value: "$ " + avgWinner.toFixed(2) });
    rows.push({ key: "Avg loser ", value: "$ " + avgLoser.toFixed(2) });
    rows.push({ key: "Expected value ", value: "$ " + expectedValue.toFixed(2) });
    return rows;
  }

  componentDidUpdate(prevProps) {
    if (this.props.history !== prevProps.history) {
      this.setState({
        rows: this.getStatistics()
      });
    }
  }

  render() {
    return (
      <Table size="small" style={{ padding: 0 }}>
        <TableBody>
          {this.state.rows.map(row => (
            <TableRow key={row.key}  style={{margin:'0', padding:'0'}}>
              <StyledTableCell align="left">&nbsp;</StyledTableCell>
              <StyledTableCell align="left">{row.key}</StyledTableCell>
              <StyledTableCell align="left">{row.value}</StyledTableCell>
              <StyledTableCell align="left">&nbsp;</StyledTableCell>
              <StyledTableCell align="left">&nbsp;</StyledTableCell>
              <StyledTableCell align="left">&nbsp;</StyledTableCell>
              <StyledTableCell align="left">&nbsp;</StyledTableCell>
              <StyledTableCell align="left">&nbsp;</StyledTableCell>
              <StyledTableCell align="left">&nbsp;</StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

Statistics.propTypes = {
  history: PropTypes.array.isRequired
};

export default Statistics;
