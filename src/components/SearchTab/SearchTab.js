import { Component } from "react";
import { Pagination} from "antd";

import SearchBar from "../SearchBar";
import MoviesList from "../MoviesList";
import ErrorHandler from "../ErrorHandler";

export default class SearchTab extends Component {
  state = {
    page: this.props.page,
    moviesData: this.props.moviesData,
    networkConnection: this.props.networkConnection
  }

  updateData = (searchInput) => {
    if (searchInput.length === 0) {
      this.setState({
        error: {
          message: "No results",
          code: "Your search query returned no results :(",
        },
      });
    } else {
      this.setState({
        error: null,
      });
    }
    if (searchInput !== this.state.moviesData) {
      this.setState({
        moviesData: searchInput,
      });
    }
  };

  render() {
    let {page, moviesData, networkConnection, error} = this.state;
    let { changePage, ratedData } = this.props;
    if (error) {
      return (
        <div className="app">
          <SearchBar
            placeholder="Input movie name"
            style={{
              margin: "auto",
              width: 1000,
            }}
            onSearch={this.updateData}
          />
          <ErrorHandler e={error} />
        </div>
      );
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
            ratedData={ratedData}
          />
        </div>
      );
    }
    return (
      <div className="search-tab">
        <SearchBar
          placeholder="Input movie name"
          style={{
            margin: "auto",
            width: 1000,
          }}
          onSearch={this.updateData}
        />
        <MoviesList
          data={moviesData}
          ratedData={ratedData}
        />
        <Pagination
          className="pagination"
          onChange={(e)=> {changePage(e)}}
          defaultCurrent={page}
          total={50}
        />
      </div>
    );
  }
}
