import React, { Component } from "react";
import Movie from "../Movie";
export default class MoviesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.setState({ data: this.props.data });
    }
  }

  render() {
    const { data } = this.state;
    let films;
    if (Object.keys(data).length === 0) {
      return <div></div>
    } else {
      let ratedArray = this.props.ratedData;
      if (!ratedArray) {
        return null;
      }
     films = data.map((item) => {
      let rating = ratedArray.filter((ratedFilm)=>{
        return ratedFilm.id === item.id
      })
      let ratingValue = '0.0';
      if  (rating.length) {
        ratingValue = rating[0].rating
      }
      const { id } = item;
        return (
          <Movie
            {...item}
            key={id}
            rating={ratingValue}
          />
        );
    });
  }
    return <div className="films">{films}</div>;
  }
}
