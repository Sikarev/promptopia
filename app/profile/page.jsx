'use client'

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

import Profile from '@components/Profile';
import { useRouter } from "next/navigation";
import { useSearchParams } from '@node_modules/next/navigation';

const MyProfile = () => {
  const { data: session } = useSession();
  const currentUserId = session?.user.id;

  const [posts, setPosts] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');


  const router = useRouter();
  const searchParams = useSearchParams();
  const profileOwnerId = searchParams.get('id');

  const userId = profileOwnerId ?? currentUserId;

  const isProfileOwner = currentUserId === profileOwnerId;

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${userId}/posts`);
      const data = await response.json();
      setPosts(data);
      setName(`${isProfileOwner ? 'My' : data?.[0]?.creator?.username ?? 'User'} Profile`);
      setDesc(`Welcome to ${name} personalized profile page. ${isProfileOwner
        ? 'Share your exceptional prompts and inspire others with the power of your imagination'
        : `Explore ${name} exceptional prompts and be inspired by the power of their imagination`}`);
    }

    if (userId && posts.length === 0) {
      fetchPosts();
    }
  });

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`)
  }
  const handleDelete = async (post) => {
    const hasConfirmed = confirm('Are you sure you want to delete this prompt?');

    if (!hasConfirmed) {
      return Promise.resolve();
    }

    try {
      await fetch(`api/prompt/${post._id.toString()}`, {
        method: 'DELETE',
      });

      const filteredPosts = posts.filter(p => p._id !== post._id);
      setPosts(filteredPosts);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Profile
      name={name}
      desc={desc}
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  )
}

export default MyProfile;
