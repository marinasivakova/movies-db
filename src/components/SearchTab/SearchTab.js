import { Component } from "react";
import { Pagination } from "antd";

import SearchBar from "../SearchBar";
import MoviesList from "../MoviesList";
import ErrorHandler from "../ErrorHandler";
import getDataFromAPI from "../../client/TMDB";

export default class SearchTab extends Component {
  state = {
    moviesData: this.props.moviesData,
    networkConnection: this.props.networkConnection,
    inputValue: "query=return",
  };

  updateData = (page, inputValue) => {
    if (!inputValue) {
      inputValue = this.state.inputValue;
    } else {
      this.setState({
        inputValue: inputValue,
      });
    }
    this.setState({
      page: page,
    });
    let result;

    getDataFromAPI("search", page, inputValue).then((d) => {
      result = d;
      if (result.length === 0) {
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
      if (result !== this.state.moviesData) {
        this.setState({
          moviesData: result,
        });
      }
    });
  };

  render() {
    let { page, moviesData, networkConnection, error } = this.state;
    let { changePage, ratedData } = this.props;
    if (error) {
      return (
        <div className="app">
          <SearchBar
            page={page}
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
          page={page}
          placeholder="Input movie name"
          onSearch={this.updateData}
        />
        <MoviesList data={moviesData} ratedData={ratedData} />
        <Pagination
          className="pagination"
          onChange={(e) => {
            changePage(e);
            this.updateData(e);
          }}
          current={page}
          total={50}
        />
      </div>
    );
  }
}
