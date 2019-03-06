import React, { Component } from "react";
import AddBook from "./addBook";
import BookCardInfo from "./bookCardInfo";
import axios from "axios";

class AccountPage extends Component {
  state = {
    name: this.props.user.firstname,
    email: this.props.user.email,
    currentSellingBook: [],
    intervalIsSet: null,
    userInfo: [
      {
        Header: "Username",
        accessor: "name"
      },
      {
        Header: "Email",
        accessor: "email"
      }
    ]
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getMyCurrentSellingBook();

    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getMyCurrentSellingBook, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  //new function for getting current selling book
  getMyCurrentSellingBook = () => {
    axios
      .post("http://localhost:3001/api/search", {
        owner: this.props.user.username
      })
      .then(res => {
        this.setState({ currentSellingBook: res.data.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <React.Fragment>
        <h1 style={{ textAlign: "center" }}>
          Welcome {this.props.user.firstname + " " + this.props.user.lastname}
        </h1>
        <table style={{ textAlign: "center" }}>
          <tr>
            <th>Your username</th>
            <th>Your account email</th>
          </tr>
          <tr>
            <td>{this.props.user.username}</td>
            <td>{this.props.user.email}</td>
          </tr>
        </table>
        <hr />
        <h2 style={{ textAlign: "center" }}>
          Here is the book you are currently selling
        </h2>

        <div>
          {this.state.currentSellingBook.map(book => (
            <BookCardInfo key={book._id} bookInfo={book} />
          ))}
        </div>

        <AddBook username={this.props.user.username} />
      </React.Fragment>
    );
  }
}

export default AccountPage;