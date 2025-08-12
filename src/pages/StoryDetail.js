import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkerAlt, faClock, faShare, faBookmark, faComment, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const StoryDetail = () => {
  const { id } = useParams();

  // Story data - in a real app, this would come from an API or database
  const stories = [
    {
      id: 1,
      title: "Community Dialogues Forum in Kakuma and Kalobeyei Seeks Solutions to Local Conflicts",
      excerpt: "The Kenya Community Media Network, in collaboration with REF-FM and Atanayeche, hosted a crucial forum this month in Kakuma and Kalobeyei to address the underlying causes of conflicts in the area.",
      author: "Kakuma Media",
      location: "Kakuma Refugee Camp and Kalobeyei Integrated Settlement",
      publishDate: "2024-10-04",
      image: "/Images/2025-01-06-community-dialogues.jpg",
      category: "Community Peacebuilding",
      readTime: "5 min read",
      content: `
        <p>The Kenya Community Media Network, in collaboration with REF-FM and Atanayeche, hosted a crucial forum this month in Kakuma and Kalobeyei to address the underlying causes of conflicts in the area. The Community Dialogues Forum served as a platform for bringing together community members, local leaders, and experts to discuss and find sustainable solutions to pressing issues such as land disputes, resource-based conflicts, and gender-based violence (GBV). The event aimed to foster dialogue and collaboration in resolving the challenges faced by both the host and refugee communities.</p>
        
        <p>The forum addressed critical problems such as land conflicts driven by deforestation for charcoal production, exacerbated by a growing population and strained relationships between the host and refugee communities. It also tackled inadequate access to water and food, which continues to fuel tension in the area. Attendees engaged in discussions aimed at fostering unity and promoting peacebuilding initiatives.</p>
        
        <h2>Panelists Provide Insights and Solutions</h2>
        
        <p>The forum featured a diverse panel of speakers, including Senior Chief Cosmas Nakayart Esuguru from Kakuma, probation Assistant Director of Turkana West Beatrice Kotoca, and Sub-County Probation Officer Sylvester Ekuwan, among others. They addressed questions from the community and offered advice on conflict resolution. The discussions centered on practical measures to address the issues and included contributions from community representatives, such as Beverlyne Maraka, who highlighted the impact of poverty on GBV. She cited cases of young girls being forced into sexual activities, leading to unaddressed pregnancies and unresolved legal cases.</p>
        
        <h2>Resource Conflicts and Communication Challenges</h2>
        
        <p>Panelists underscored the need for better communication to resolve resource-based conflicts and intercommunity disputes. Lucia Nyumju, the chairlady of Kalobeyei Valley Two, pointed out that tensions between the host and refugee communities are often rooted in past experiences and misunderstandings. She advocated for community education on self-care, conflict resolution, and letting go of grudges to promote healing.</p>
        
        <p>The forum emphasized the importance of environmental conservation, noting that deforestation for charcoal production is against Article 109 of Kenya's constitution, which mandates the protection of the environment. Community leaders called for tree planting initiatives as a step toward sustainable resource management.</p>
        
        <h2>Calls for Unity and Collective Action</h2>
        
        <p>Senior Chief Cosmas Nakayart encouraged both the host and refugee communities to work together, stressing that peace in Kakuma could only be achieved through collective efforts.</p>
        
        <blockquote class="border-l-4 border-blue-600 pl-6 my-6 italic text-gray-700 text-lg">
          "Time will come when there will be no difference between the host and refugee communities. If we want Kakuma to be a peaceful place, let us work together in unity and learn to love one another."
          <footer class="text-sm text-gray-600 mt-2">— Senior Chief Cosmas Nakayart</footer>
        </blockquote>
        
        <p>The Community Dialogues Forum marks a step towards fostering peace and addressing the underlying causes of conflicts in the region, with a strong emphasis on community-driven solutions and the need for ongoing collaboration among all stakeholders.</p>
      `,
      tags: ["Community Peacebuilding", "Conflict Resolution", "Kakuma", "Kalobeyei", "Kenya", "Refugee Communities", "Environmental Conservation", "Gender-Based Violence"]
    },
    {
      id: 2,
      title: "Project Design Team Forum in Kakuma and Kalobayei",
      excerpt: "This November, Kenya Community Media Network, in collaboration with Atanayece and REM-FM, hosted an important forum in Kakuma and Kalobayei settlements. The forum focused on critical issues impacting the community, including water-related conflicts, sexual and gender-based violence (GBV), and land disputes.",
      author: "Kakuma Media",
      location: "Kakuma Refugee Camp and Kalobeyei Integrated Settlement",
      publishDate: "2024-11-22",
      image: "/Images/2025-01-06-project-design.jpg",
      category: "Community Development",
      readTime: "4 min read",
      content: `
        <p>This November, Kenya Community Media Network, in collaboration with Atanayece and REM-FM, hosted an important forum in Kakuma and Kalobayei settlements. The forum focused on critical issues impacting the community, including water-related conflicts, sexual and gender-based violence (GBV), and land disputes.</p>
        
        <p>Radio journalists Joseph Etabo, Peter Taban, and Ivy Sipoliko led the discussion, diving deep into the root causes of these conflicts and exploring sustainable solutions. Key insights were shared, such as the need for more water sources like boreholes to address water scarcity and the harmful impacts of early marriage on girls' education and health.</p>
        
        <h2>Community Leaders Share Perspectives</h2>
        
        <p>Community leaders, including Nyunyu Okello, Gilo Ojo, and others, also contributed their perspectives, emphasizing the role of education and community involvement in resolving these issues. It was clear that, while there are tensions, especially around water distribution, collaboration and mutual respect between both refugee and host communities are essential for lasting peace.</p>
        
        <h2>Addressing Critical Community Issues</h2>
        
        <p>The forum served as a powerful platform for dialogue, bringing together journalists, community members, and leaders to tackle some of the region's most pressing challenges. Together, we can create a more peaceful and sustainable future for all.</p>
        
        <p>Key topics discussed included:</p>
        <ul class="list-disc pl-6 space-y-2 my-4">
          <li>Water scarcity and the need for additional boreholes</li>
          <li>Early marriage impacts on girls' education and health</li>
          <li>Land disputes and resource allocation</li>
          <li>Community collaboration for sustainable solutions</li>
        </ul>
        
        <p>The forum highlighted the importance of bringing together diverse voices to address complex community challenges and find practical solutions that benefit all residents of Kakuma and Kalobayei.</p>
      `,
      tags: ["Community Development", "Water Resources", "Gender-Based Violence", "Land Disputes", "Kakuma", "Kalobayei", "Kenya", "Community Media", "Conflict Resolution"]
    }
  ];

  // Find the story based on the ID from the URL
  const story = stories.find(s => s.id === parseInt(id)) || stories[0];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            to="/stories" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Stories
          </Link>
        </div>
      </div>

             {/* Featured Image - Full Screen Width */}
       <div className="w-full">
                 <img 
          src={story.image} 
          alt={story.title}
          className="w-full h-64 md:h-80 object-cover"
          style={{ objectPosition: 'center 30%' }}
        />
       </div>

       {/* Story Content Container */}
       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Details */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {story.category}
            </span>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
              {formatDate(story.publishDate)}
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
              {story.location}
            </div>
            <div className="text-gray-500">
              {story.readTime}
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {story.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          {story.excerpt}
        </p>

        {/* Author */}
        <div className="mb-6">
          <div className="flex items-center text-gray-700">
            <FontAwesomeIcon icon={faClock} className="mr-2" />
            <span className="font-medium">By {story.author}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {story.tags.map((tag, index) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Story Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-gray-700 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: story.content }}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
                            <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: story.title,
                        text: story.excerpt,
                        url: window.location.href
                      });
                    } else {
                      // Fallback: copy to clipboard
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faShare} className="mr-2" />
                  Share Story
                </button>
                <button 
                  onClick={() => {
                    // This would typically save to localStorage or user account
                    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
                    if (bookmarks.includes(story.id)) {
                      const newBookmarks = bookmarks.filter(id => id !== story.id);
                      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
                      alert('Story removed from bookmarks');
                    } else {
                      bookmarks.push(story.id);
                      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
                      alert('Story added to bookmarks');
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faBookmark} className="mr-2" />
                  Bookmark
                </button>
                <button 
                  onClick={() => {
                    // This would typically open a comment form or modal
                    alert('Comment feature coming soon! This would open a comment form.');
                  }}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faComment} className="mr-2" />
                  Comment
                </button>
          </div>
        </div>
      </div>

             {/* Related Stories Section */}
       <section className="py-16 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">
             More Stories
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.filter(s => s.id !== story.id).map(otherStory => (
                             <Link 
                 key={otherStory.id} 
                 to={`/stories/${otherStory.id}`}
                 className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer h-full"
               >
                 <div className="relative">
                   <img 
                     src={otherStory.image} 
                     alt={otherStory.title}
                     className="w-full h-48 object-cover"
                     style={{ objectPosition: 'center 30%' }}
                   />
                   <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                     {otherStory.category}
                   </div>
                 </div>
                 
                 <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center space-x-3 text-xs text-gray-600 mb-3">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                      {formatDate(otherStory.publishDate)}
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                      {otherStory.location}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
                    {otherStory.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                    {otherStory.excerpt}
                  </p>
                  
                                     <div className="flex items-center justify-between mt-auto">
                     <div className="text-sm text-gray-600">
                       By {otherStory.author}
                     </div>
                     <span className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">
                       Read More →
                     </span>
                   </div>
                 </div>
               </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link 
              to="/stories"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              View All Stories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StoryDetail;
