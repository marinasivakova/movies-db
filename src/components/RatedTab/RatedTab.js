import { Component } from "react";
import { Pagination } from "antd";

import MoviesList from "../MoviesList";
import ErrorHandler from "../ErrorHandler";
import Loader from "../Loader";
import getDataFromAPI from "../TMDB/TMDB";

export default class RatedTab extends Component {
  state = {
    data: this.props.moviesData,
  };
  changePage = (current) => {
    if (current !== this.state.page) {
      this.setState({
        page: current,
      });
    }
  };

  updateData = (page) => {
    let result;
    getDataFromAPI("rated", page).then((d) => {
      result = d;
      if (result.length === 0) {
        this.setState({
          error: {
            message: "No results",
            code: "Final rating page",
          },
        });
      } else {
        this.setState({
          error: null,
        });
      }
      this.setState({
        data: result,
      });
    });
  };

  render() {
    let { networkConnection, changePage, page } = this.props;
    while (!this.state.data) {
      return <Loader />;
    }
    if (!networkConnection) {
      return (
        <div className="app">
          <ErrorHandler
            e={{
              code: "It seems you are currently experiencing network issues and is thus unable to connect to the Movies-DB app. Please try again later!",
              message: "Network Error",
            }}
          />
          <MoviesList
            key={Math.random()}
            data={this.state.data}
            ratedData={this.state.data}
          />
        </div>
      );
    }
    return (
      <div className="search-tab">
        <MoviesList data={this.state.data} ratedData={this.state.data} />
        <Pagination
          className="pagination"
          defaultCurrent={page}
          onChange={(e) => {
            changePage(e);
            this.updateData(e);
          }}
          total={50}
        />
      </div>
    );
  }
}
