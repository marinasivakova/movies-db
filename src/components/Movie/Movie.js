import React, { Component } from "react";
import { format, parseISO } from "date-fns";
import { Rate } from "antd";

import { ContextGenres } from "../..";
import getDataFromAPI from "../TMDB/TMDB";
export default class Movie extends Component {
  state = {};
  componentDidMount() {
    if (this.props.rating) {
      this.setState(() => {
        return {
          rating: this.props.rating,
        };
      });
    }
  }

  getPoster = () => {
    if (this.props.poster_path === null) {
      return "https://placehold.co/183x281";
    } else {
      return "https://image.tmdb.org/t/p/original" + this.props.poster_path;
    }
  };

  getGenres = () => {
    let genres = ContextGenres._currentValue;
    let genreNames = [];
    if (this.props.genre_ids.length !== 0) {
      genreNames = this.props.genre_ids.map((id) => {
        let genre = genres.find((g) => g.id === id);
        if (genre) {
          return genre.name;
        }
        return null;
      });
    }
    if (genreNames[0] !== null) {
      return genreNames.map((genre) => {
        return (
          <div className="genres__genre" key={genre}>
            {genre}
          </div>
        );
      });
    }
  };

  openDesc = (e) => {
    if (e.target.style.overflow === "hidden" || !e.target.style.overflow) {
      e.target.style.overflow = "initial";
      e.target.style.height = "initial";
    } else {
      e.target.style.overflow = "hidden";
      e.target.style.height = "60px";
    }
  };

  handleChange = (e) => {
    getDataFromAPI("rate", e, this.props.id);
    this.setState({
      rating: e,
    });
  };

  changeStyle = (rating) => {
    if (rating < 3) {
      return "#E90000";
    } else if (rating <= 5) {
      return "#E97E00";
    } else if (rating <= 7) {
      return "#E9D100";
    } else {
      return "#66E900";
    }
  };

  render() {
    let { widenDesc, desc, title } = this.props;
    let rating = "0.0";
    let textDate;
    if (this.state.rating) {
      rating = this.state.rating;
    }
    if (!desc) {
      desc = "No description was provided";
    }
    if (!this.props.release_date) {
      textDate = "Unknown release date";
    } else {
      let newDate = format(parseISO(this.props.release_date), "MMMM d, y");
      textDate = newDate;
    }
    let genreJSX = this.getGenres();
    let poster = this.getPoster();


    return (
      <div className="film" onClick={widenDesc}>
        <img
          src={poster}
          alt="Poster for the movie"
          className="film__poster"
        />
        <div className="film__overview">
          <div className="film__rate-tab">
            <span className="film__title">{title}</span>
            <span
              className="film__rating"
              style={{ border: `2px solid ${this.changeStyle(rating)}` }}
            >
              {rating}
            </span>
          </div>
          <span className="film__release">{textDate}</span>
          <div className="film__genres">{genreJSX}</div>
          <p className="film__description" onClick={this.openDesc}>
            {desc}
          </p>
        </div>
        <Rate
          className="film__stars"
          value={rating}
          count={10}
          allowHalf={true}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
