const LatestStories = ({ stories }) => {
  return (
    <div className="latest-stories">
      {stories.map(story => (
        <Link to={`/news/${story.id}`} key={story.id} className="latest-story">
          <div className="latest-story-image">
            {(story.featuredImage || story.image) ? (
              <img src={story.featuredImage || story.image} alt={story.title} />
            ) : (
              <div className="placeholder-image">
                <FaImage />
              </div>
            )}
          </div>
          <div className="latest-story-content">
            <h3>{story.title}</h3>
            <p>{story.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}; 
 
 
 