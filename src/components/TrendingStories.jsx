const TrendingStories = ({ stories }) => {
  return (
    <div className="trending-stories">
      {stories.map(story => (
        <Link to={`/news/${story.id}`} key={story.id} className="trending-story">
          <div className="trending-story-image">
            {(story.featuredImage || story.image) ? (
              <img src={story.featuredImage || story.image} alt={story.title} />
            ) : (
              <div className="placeholder-image">
                <FaImage />
              </div>
            )}
          </div>
          <div className="trending-story-content">
            <h3>{story.title}</h3>
            <p>{story.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}; 
 
 