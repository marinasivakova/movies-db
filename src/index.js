import React, { Component, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Loader from "./components/Loader";
import SearchTab from "./components/SearchTab/SearchTab";
import RatedTab from "./components/RatedTab/RatedTab";
import TabPicker from "./components/TabPicker/TabPicker";
import getDataFromAPI from "./components/TMDB/TMDB";

export const ContextGenres = React.createContext([]);
if (!document.cookie) {
  getDataFromAPI();
}

class App extends Component {
  state = {
    isLoaded: false,
    networkConnection: true,
    page: 1,
    ratedPage: 1,
    tab: "Search",
  };

  componentDidMount() {
    window.addEventListener("offline", () => {
      this.setState({ networkConnection: false });
    });
    window.addEventListener("online", () => {
      this.setState({ networkConnection: true });
    });
    if (!this.state.ratedData) {
      let result;
      getDataFromAPI("rated", this.state.page).then((d) => {
        result = d;
        this.setState({
          ratedData: result,
        });
      });
    }
    if (!this.state.moviesData) {
      this.setState({
        isLoaded: false,
      });
      let result;
      getDataFromAPI("search", this.state.page, "query=return").then((d) => {
        result = d;
        this.setState({
          isLoaded: true,
          moviesData: result,
        });
      });
    }
    if (!this.state.genres) {
      let result;
      getDataFromAPI("genres").then((d) => {
        result = d;
        this.setState({
          isLoaded: true,
          genres: result,
        });
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.tab !== this.state.tab) {
      if (this.state.tab === "Rated") {
        let result;
        getDataFromAPI("rated", this.state.ratedPage).then((d) => {
          result = d;
          this.setState({
            ratedData: result,
          });
        });
      }
    }
  }

  switchTab = (e) => {
    this.setState({
      tab: e,
    });
  };

  render() {
    const changePage = (current) => {
      if (this.state.tab === "Rated") {
        if (current !== this.state.ratedPage) {
          this.setState({
            ratedPage: current,
          });
        }
      }
      if (current !== this.state.page) {
        this.setState({
          page: current,
        });
      }
    };
    const {
      isLoaded,
      moviesData,
      ratedData,
      networkConnection,
      page,
      ratedPage,
      genres,
      tab,
    } = this.state;
    if (!isLoaded) {
      return <Loader />;
    } else {
      if (genres && moviesData) {
        if (tab === "Search") {
          return (
            <ContextGenres.Provider value={genres}>
              <TabPicker onPress={this.switchTab} />
              <SearchTab
                page={page}
                moviesData={moviesData}
                networkConnection={networkConnection}
                changePage={changePage}
                ratedData={ratedData}
              />
            </ContextGenres.Provider>
          );
        } else if (tab === "Rated") {
          return (
            <ContextGenres.Provider value={genres}>
              <TabPicker onPress={this.switchTab} />
              <RatedTab
                page={ratedPage}
                moviesData={ratedData}
                networkConnection={networkConnection}
                changePage={changePage}
              />
            </ContextGenres.Provider>
          );
        }
      }
    }
  }
}

let container = null;

document.addEventListener("DOMContentLoaded", function () {
  if (!container) {
    container = document.getElementById("root");
    const root = createRoot(container);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
});
