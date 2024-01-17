import React, { Component } from "react";
import { format, parseISO } from "date-fns";
import { Rate } from "antd";

import { ContextGenres } from "../..";
import getDataFromAPI from "../../client/TMDB";
export default class Movie extends Component {
  constructor(props) {
    super(props);
    this.myRating = React.createRef();
  }
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
    if (e.target.classList[0] === "film__description") {
      e.target.classList.add("film__description__extended");
      e.target.classList.remove("film__description");
      if (e.target.offsetHeight < 40) {
        e.target.classList.remove("film__description__extended");
        e.target.classList.add("film__description");
      }
    } else {
      e.target.classList.remove("film__description__extended");
      e.target.classList.add("film__description");
    }
  };

  handleChange = (e) => {
    getDataFromAPI("rate", e, this.props.id);
    this.setState({
      rating: e,
    });
    this.changeStyle(e);
  };

  changeStyle = (rating) => {
    if (!this.myRating.current) {
      return;
    }
    this.myRating.current.classList.remove("film__rating--bad");
    this.myRating.current.classList.remove("film__rating--mid");
    this.myRating.current.classList.remove("film__rating--good");
    this.myRating.current.classList.remove("film__rating--great");
    if (rating < 3) {
      this.myRating.current.classList.add("film__rating--bad");
    } else if (rating <= 5) {
      this.myRating.current.classList.add("film__rating--mid");
    } else if (rating <= 7) {
      this.myRating.current.classList.add("film__rating--good");
    } else {
      this.myRating.current.classList.add("film__rating--great");
    }
  };

  render() {
    let { title } = this.props;
    let desc = this.props.overview;
    let rating = "0.0";
    let textDate;
    if (this.state.rating) {
      rating = this.state.rating;
    }
    if (rating) {
      this.changeStyle(rating);
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
      <div className="film">
        <img src={poster} alt="Poster for the movie" className="film__poster" />
        <div>
          <div className="film__overview">
            <div className="film__rate-tab">
              <h2 className="film__title">{title}</h2>
              <span className="film__rating" ref={this.myRating}>
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
      </div>
    );
  }
}
