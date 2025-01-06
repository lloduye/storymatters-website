const loadFeaturedStories = async () => {
  try {
    const q = query(
      collection(db, 'content'),
      where('status', '==', 'published'),
      where('featured', '==', true),
      limit(5)
    );
    const querySnapshot = await getDocs(q);
    const stories = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Featured story image:', {
        id: doc.id,
        image: data.image,
        featuredImage: data.featuredImage
      });
      return {
        id: doc.id,
        ...data
      };
    });
    console.log('All featured stories:', stories);
    setFeaturedStories(stories);
  } catch (error) {
    console.error('Error loading featured stories:', error);
  }
};

const loadTrendingStories = async () => {
  try {
    const q = query(
      collection(db, 'content'),
      where('status', '==', 'published'),
      orderBy('views', 'desc'),
      limit(5)
    );
    const querySnapshot = await getDocs(q);
    const stories = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Trending story image:', {
        id: doc.id,
        image: data.image,
        featuredImage: data.featuredImage
      });
      return {
        id: doc.id,
        ...data
      };
    });
    console.log('All trending stories:', stories);
    setTrendingStories(stories);
  } catch (error) {
    console.error('Error loading trending stories:', error);
  }
};

const loadLatestStories = async () => {
  try {
    const q = query(
      collection(db, 'content'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    const querySnapshot = await getDocs(q);
    const stories = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Latest story image:', {
        id: doc.id,
        image: data.image,
        featuredImage: data.featuredImage
      });
      return {
        id: doc.id,
        ...data
      };
    });
    console.log('All latest stories:', stories);
    setLatestStories(stories);
  } catch (error) {
    console.error('Error loading latest stories:', error);
  }
}; 
 
 
 