import React, { Component, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Loader from "./components/Loader";
import getDataFromAPI from "./client/TMDB";
import DefaultTab from "./components/DefaultTab.js/DefaultTab";

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
      getDataFromAPI("rated", this.state.page).then((d) => {
        this.setState({
          ratedData: d,
        });
      });
    }
    if (!this.state.moviesData) {
      this.setState({
        isLoaded: false,
      });
      getDataFromAPI("search", this.state.page, "query=return").then((d) => {
        this.setState({
          isLoaded: true,
          moviesData: d,
        });
      });
    }
    if (!this.state.genres) {
      getDataFromAPI("genres").then((d) => {
        this.setState({
          isLoaded: true,
          genres: d,
        });
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.tab !== this.state.tab) {
      if (this.state.tab === "Rated") {
        getDataFromAPI("rated", this.state.ratedPage).then((d) => {
          this.setState({
            ratedData: d,
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
       return <ContextGenres.Provider value={genres}>
          <DefaultTab
            tab={tab}
            page={page}
            moviesData={moviesData}
            networkConnection={networkConnection}
            changePage={changePage}
            ratedData={ratedData}
            ratedPage={ratedPage}
            switchTab={this.switchTab}
          />
        </ContextGenres.Provider>;
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
