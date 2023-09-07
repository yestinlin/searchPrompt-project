"use client";
import React from "react";
import { useState, useEffect } from "react";
import Loading from "../../../app/loading";
import { useSearchParams } from "next/navigation";
import Profile from "@components/Profile";

const userProfile = ({ params }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const userName = searchParams.get("name");

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`/api/users/${params?.id}/posts`);
      const data = await res.json();
      setLoading(false);
      setUserPosts(data);
    };

    if (params?.id) fetchPosts();
  }, [params.id]);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Profile
          name={`${userName}'s`}
          desc={`Welcome to ${userName}'s profile. Explore ${userName}'s exceptional prompts and be inspired by the power of their imagination`}
          data={userPosts}
        />
      )}
    </>
  );
};

export default userProfile;
