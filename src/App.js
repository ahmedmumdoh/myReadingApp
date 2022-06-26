import React, { useEffect, useState } from "react";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Home from "./components/Home";
import Search from "./components/Search";

function BooksApp() {
  const [state, setState] = useState({
    showSearchPage: false,
    books: [],
    search: "",
    booksFromSearch: [],
    loadSearch: false
  });

  useEffect(() => {
    BooksAPI.getAll().then((res) => {
      setState((prevState) => ({
        ...prevState,
        books: res
      }));
    });
  }, []);

  const handleBooksSearch = async (search) => {
    await BooksAPI.search(search).then((res) => {
      if (res && !res.error) {
        setState((prevState) => ({
          ...prevState,
          booksFromSearch: res.map((booksSearch) => {
            prevState.books.forEach((book) => {
              if (booksSearch.id === book.id) booksSearch.shelf = book.shelf;
            });
            return booksSearch;
          }),
          loadSearch: true
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          booksFromSearch: `No books like: " ${state.search} "`,
          loadSearch: false
        }));
      }
    }); // then
    console.log("Search");
    console.log(state.booksFromSearch);
  };

  const changeShelf = async (book, shelf) => {
    await BooksAPI.update(book, shelf);
    await BooksAPI.getAll().then((res) => {
      setState((prevState) => ({
        ...prevState,
        books: res
      }));
    });
    handleBooksSearch(state.search);
  };

  const handleSearch = async (event) => {
    await setState((prevState) => ({
      ...prevState,
      search: event.target.value
    }));
    console.log(state.search);
    handleBooksSearch(state.search);
  };

  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/search">
            <Search
              handleSearch={handleSearch}
              search={state.search}
              booksFromSearch={state.booksFromSearch}
              changeShelf={changeShelf}
              loadSearch={state.loadSearch}
            />
          </Route>
          <Route path="/">
            <Home books={state.books} changeShelf={changeShelf} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default BooksApp;
