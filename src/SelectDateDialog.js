import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class SelectDateDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "1/1/2019"
    };
  }

  handleClose() {
    this.props.onClose(this.state.date);
  }

  handleCancel() {
    this.props.onCancel();
  }

  handleChange(e) {
    this.setState({
      date: e.target.value
    });
  }
  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.handleCancel.bind(this)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Select date</DialogTitle>
          <DialogContent>
            <DialogContentText>Select date:</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="date"
              type="date"
              defaultValue="2019-01-01"
              onChange={this.handleChange.bind(this)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel.bind(this)} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default SelectDateDialog;
