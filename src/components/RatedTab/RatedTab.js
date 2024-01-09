import { Component } from "react";
import { Pagination } from "antd";

import MoviesList from "../MoviesList";
import ErrorHandler from "../ErrorHandler";
import Loader from "../Loader";

export default class RatedTab extends Component {
  state = {
    page: 1
  }

  changePage = (current) => {
    if (current !== this.state.page) {
      this.setState({
        page: current,
      });
    }
  };
  render() {
    let {moviesData, networkConnection, changePage } = this.props;
    let {page}= this.state.page;
    if (!moviesData) {
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
            data={moviesData}
            ratedData={moviesData}
          />
        </div>
      );
    }
    return (
      <div className="search-tab">
        <MoviesList
          data={moviesData}
          ratedData={moviesData}
        />
        <Pagination
          className="pagination"
          defaultCurrent={page}
          onChange={(e)=> {changePage(e)}}
        />
      </div>
    );
  }
}
