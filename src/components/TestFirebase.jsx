import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const TestFirebase = () => {
  const [content, setContent] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const q = query(
          collection(db, 'content'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const contentData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Fetched content:', contentData);
        setContent(contentData);
      } catch (error) {
        console.error('Error fetching content:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Test Stories from Firebase</h2>
      {content.length === 0 ? (
        <p>No stories found in database</p>
      ) : (
        <ul>
          {content.map(story => (
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