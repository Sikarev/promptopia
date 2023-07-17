'use client';

import { useState, useEffect } from 'react';
import PromptCard from "@components/PromptCard";

const PromptCardList = ({data, handleTagClick}) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}

function Feed() {
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState([]);
  const [postsToShow, setPostsToShow] = useState([]);

  const filterPosts = (text) => {
    if (!text) {
      setPostsToShow(() => posts);
    } else {
      setPostsToShow(() => posts
        .filter(post => (
          (post.creator?.username ?? '') +
          (post.prompt ?? '') +
          (post.tag ?? ''))
          .toLowerCase()
          .includes(text)
        )
      );
    }
  }

  const handleSearchChange = (e) => {
    setSearchText(() => e.target.value);
    const text = e.target.value.toLowerCase();
    filterPosts(text);
  };

  const handleTagClick = (tagName) => {
    setSearchText(() => tagName);
    filterPosts(tagName);
  }

  const clearSearchInput = () => {
    setSearchText('');
    filterPosts();
  }

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt');
      const data = await response.json();
      setPosts(data);
      setPostsToShow(data);
    }

    fetchPosts();
  }, []);


  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
            type="text"
            placeholder="Search for a prompt, tag or a username"
            value={searchText}
            onChange={(e) => handleSearchChange(e)}
            required
            className="search_input peer"
        />
        <div className="h-full pr-2 pl-2 absolute right-4 flex items-center justify-center">
          <div
            className="cursor-pointer opacity-40 hover:opacity-100"
            onClick={() => clearSearchInput()}
          >&#10005;</div>
        </div>
      </form>

      <PromptCardList
        data={postsToShow}
        handleTagClick={handleTagClick}
      />
    </section>
  )
}

export default Feed;
