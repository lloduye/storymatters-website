import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const TestFirebase = () => {
  const [stories, setStories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const q = query(collection(db, 'stories'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const storiesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Fetched stories:', storiesData);
        setStories(storiesData);
      } catch (error) {
        console.error('Error fetching stories:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Test Stories from Firebase</h2>
      {stories.length === 0 ? (
        <p>No stories found in database</p>
      ) : (
        <ul>
          {stories.map(story => (
            <li key={story.id}>
              <h3>{story.title}</h3>
              <p>Date: {story.date}</p>
              <p>Category: {story.category}</p>
              {story.image && <img src={story.image} alt={story.title} style={{width: '200px'}} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TestFirebase; 