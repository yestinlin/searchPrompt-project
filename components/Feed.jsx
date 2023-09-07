"use client";
import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";
import Loading from "../app/loading";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard key={post.id} post={post} handleTagClick={handleTagClick} />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const handleSearchChange = (e) => {
    //setLoading(true);
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);
    //debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        //setLoading(false);
        setSearchResult(searchResult);
      }, 500)
    );
  };

  const filterPrompts = (searchText) => {
    const regex = new RegExp(searchText, "i");
    return posts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleTagClick = (tag) => {
    setSearchText(tag);
    const tagPosts = posts.filter((item) => item.tag === tag);
    setSearchResult(tagPosts);
  };

  // const searchSubmitted = (e) => {
  //   e.preventDefault();
  //   //setSubmitting(true);

  //   const theIndex = posts.findIndex(
  //     (post) =>
  //       post.prompt.toLowerCase().includes(searchText.toLowerCase()) ||
  //       post.tag.toLowerCase().includes(searchText.toLowerCase()) ||
  //       post.creator.username.toLowerCase().includes(searchText.toLowerCase())
  //   );
  //   if (theIndex === -1) return;
  //   const result = [];
  //   result.push(posts[theIndex]);
  //   setSearchResult(result);
  // };

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/prompt");
      const data = await res.json();
      setLoading(false);
      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {loading ? (
        <Loading />
      ) : searchText ? (
        searchResult.length !== 0 ? (
          <PromptCardList data={searchResult} handleTagClick={handleTagClick} />
        ) : (
          <p className="mt-5 font-inter text-gray-800">
            No Result. Please search again.
          </p>
        )
      ) : (
        <PromptCardList data={posts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
