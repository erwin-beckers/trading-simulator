import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SelectDateDialog from "./SelectDateDialog";

class TopToolBar extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      openDialog:false
    };
    this.classes = makeStyles(theme => ({
      root: {
        flexGrow: 1
      },
      menuButton: {
        marginRight: theme.spacing(2)
      },
      title: {
        flexGrow: 1
      }
    }));
  }
  
  onCloseDialog(date){
    this.setState({
      openDialog:false
    });
    this.props.onGotoDate(date);
  }
  
  onCancelDialog(){
    this.setState({
      openDialog:false
    });
  }

  onOpenDialog(){
    this.setState({
      openDialog:true
    });
  }

  render() {
    return (
      <div className={this.classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={this.classes.menuButton}
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={this.classes.title}>
              Trading Simulator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Button variant="outlined" color="inherit" onClick={this.props.onBuyMarket}>
                Buy MKT
              </Button>&nbsp;&nbsp;
              <Button variant="outlined" color="inherit" onClick={this.props.onSellMarket}>
                Sell MKT
              </Button>&nbsp;&nbsp;
              <Button variant="outlined" color="inherit" onClick={this.props.onBuyLimit}>
                Buy Lmt
              </Button>&nbsp;&nbsp;
              <Button variant="outlined" color="inherit" onClick={this.props.onSellLimit}>
                Sell Lmt
              </Button>&nbsp;&nbsp;
              <Button variant="outlined" color="inherit" onClick={this.onOpenDialog.bind(this)}>
                Goto...
              </Button>&nbsp;&nbsp;
            </Typography>
            <Typography>Capital: $ {this.props.capital.toFixed(2)}&nbsp; ({this.props.percentage.toFixed(2)}%) </Typography>
          </Toolbar>
        </AppBar>
        <SelectDateDialog onCancel={this.onCancelDialog.bind(this)} onClose={this.onCloseDialog.bind(this)} open={this.state.openDialog}></SelectDateDialog>
      </div>
    );
  }
}

TopToolBar.propTypes = {
  onBuyMarket: PropTypes.func,
  onSellMarket: PropTypes.func,
  onBuyLimit: PropTypes.func,
  onSellLimit: PropTypes.func,
  onGotoDate: PropTypes.func,
  capital: PropTypes.number,
  percentage:PropTypes.number
};

export default TopToolBar;
