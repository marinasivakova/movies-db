import React, { Component, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import Loader from "./components/Loader";
import SearchTab from "./components/SearchTab/SearchTab";
import RatedTab from "./components/RatedTab/RatedTab";
import TabPicker from "./components/TabPicker/TabPicker";

//const apiKey = "969a9d21394ad781ff1397c9618d7033";
const url =
  "/search/movie?query=return&include_adult=false&language=en-US&page=";
const genresUrl = "/genre/movie/list?language=en";
const client = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NjlhOWQyMTM5NGFkNzgxZmYxMzk3Yzk2MThkNzAzMyIsInN1YiI6IjY1NzZmMjlhYTFkMzMyMDBjNGM3NmFmYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RnzdPYPaFX6GCcfrnEdTUS6hwRAJlMlotnBY6VCkfr4",
  },
});
export const ContextGenres = React.createContext([]);
if (!document.cookie) {
  client.get("authentication/guest_session/new").then((res) => {
    document.cookie =
      `guest_session_id=` +
      res.data.guest_session_id +
      `; expires=` +
      res.data.expires_at;
  });
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
      const apiKey = "969a9d21394ad781ff1397c9618d7033";
        let session = document.cookie.match(/=(.*)/gm).map(function (s) {
          return s.slice(1);
        });
        axios
          .get(
            `https://api.themoviedb.org/3/guest_session/${session}/rated/movies?api_key=${apiKey}&language=en-US&page=${this.state.page}&sort_by=created_at.asc`,
            {
              headers: {
                accept: "application/json",
              },
            }
          )
          .then((res) => {
            this.setState({
              ratedData: res.data.results,
            });
          });
    }
    if (!this.state.moviesData) {
      this.setState({
        isLoaded: false,
      });
      client
        .get(url + this.state.page)
        .then((res) => {
          this.setState({
            isLoaded: true,
            moviesData: res.data.results,
          });
        })
        .catch((err) => {
          this.setState({
            error: err,
          });
        });
    }
    if (!this.state.genres) {
      client(genresUrl)
        .then((res) => {
          this.setState({
            isLoaded: true,
            genres: res.data.genres,
          });
        })
        .catch((err) => {
          this.setState({
            error: err,
          });
        });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.tab !== this.state.tab) {
      if (this.state.tab === "Rated") {
        const apiKey = "969a9d21394ad781ff1397c9618d7033";
        let session = document.cookie.match(/=(.*)/gm).map(function (s) {
          return s.slice(1);
        });
        axios
          .get(
            `https://api.themoviedb.org/3/guest_session/${session}/rated/movies?api_key=${apiKey}&language=en-US&page=${this.state.ratedPage}&sort_by=created_at.asc`,
            {
              headers: {
                accept: "application/json",
              },
            }
          )
          .then((res) => {
            this.setState({
              ratedData: res.data.results,
            });
          });
      }
    }
    if (prevState.page !== this.state.page) {
      this.setState({
        isLoaded: false,
      });
      client
        .get(url + this.state.page)
        .then((res) => {
          this.setState({
            isLoaded: true,
            moviesData: res.data.results,
          });
        })
        .catch((err) => {
          this.setState({
            error: err,
          });
        });
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
    const { isLoaded, moviesData, ratedData, networkConnection, page, ratedPage, genres, tab } =
      this.state;
    if (!isLoaded) {
      return <Loader />;
    } else {
      if (genres) {
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
