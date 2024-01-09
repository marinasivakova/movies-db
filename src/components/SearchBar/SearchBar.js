import React from "react";
import qs from "qs";
import axios from "axios";
import debounce from "lodash/debounce";
import { Select } from "antd";

const SearchBar = (props) => {
  const client = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NjlhOWQyMTM5NGFkNzgxZmYxMzk3Yzk2MThkNzAzMyIsInN1YiI6IjY1NzZmMjlhYTFkMzMyMDBjNGM3NmFmYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RnzdPYPaFX6GCcfrnEdTUS6hwRAJlMlotnBY6VCkfr4",
    },
  });

  const handleSearch = (newValue) => {
    const str = qs.stringify({
      query: newValue,
    });
    client
      .get(`/search/movie?${str}&include_adult=false&language=en-US&page=1`)
      .then((d) => {
        const { data } = d;
        const result = data.results;
        props.onSearch(result);
      });
  };

  const handleChange = (newValue) => {
    if (newValue.target.value) {
      handleSearch(newValue.target.value);
      newValue.target.value = "";
    }
  };

  return (
    <div className="search-bar__holder">
      <Select
        className="search-bar"
        showSearch
        placeholder={props.placeholder}
        onInput={debounce(handleChange, 1500)}
        notFoundContent={null}
      />
    </div>
  );
};
export default SearchBar;
