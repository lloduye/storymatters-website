const FeaturedStories = ({ stories }) => {
  return (
    <div className="featured-stories">
      {stories.map(story => (
        <Link to={`/news/${story.id}`} key={story.id} className="featured-story">
          <div className="featured-story-image">
            {(story.featuredImage || story.image) ? (
              <img src={story.featuredImage || story.image} alt={story.title} />
            ) : (
              <div className="placeholder-image">
                <FaImage />
              </div>
            )}
          </div>
          <div className="featured-story-content">
            <h3>{story.title}</h3>
            <p>{story.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}; 
 
 