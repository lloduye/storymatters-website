import React from 'react';
import { useNavigate } from 'react-router-dom';
import './News.css';
import ScrollAnimation from '../../components/ScrollAnimation/ScrollAnimation';
import Newsletter from '../../components/Newsletter/Newsletter';

const News = () => {
  const navigate = useNavigate();
  const newsItems = [
    {
      title: "Community Dialogues Forum in Kakuma and Kalobeyei Seeks Solutions to Local Conflicts",
      date: "March 2024",
      category: "Community",
      description: "The Kenya Community Media Network hosted a crucial forum addressing conflicts and fostering unity between host and refugee communities.",
      image: "forum-discussion.jpg",
      content: [
        {
          text: `The Kenya Community Media Network, in collaboration with REF-FM and Atanayeche, hosted a crucial forum this month in Kakuma and Kalobeyei to address the underlying causes of conflicts in the area. The Community Dialogues Forum served as a platform for bringing together community members, local leaders, and experts to discuss and find sustainable solutions to pressing issues such as land disputes, resource-based conflicts, and gender-based violence (GBV). The event aimed to foster dialogue and collaboration in resolving the challenges faced by both the host and refugee communities.

The forum addressed critical problems such as land conflicts driven by deforestation for charcoal production, exacerbated by a growing population and strained relationships between the host and refugee communities. It also tackled inadequate access to water and food, which continues to fuel tension in the area. Attendees engaged in discussions aimed at fostering unity and promoting peacebuilding initiatives.`,
          image: {
            src: "forum-discussion.jpg",
            caption: "Community members engaging in dialogue during the forum"
          }
        },
        {
          text: `The forum featured a diverse panel of speakers, including Senior Chief Cosmas Nakayart Esuguru from Kakuma, probation Assistant Director of Turkana West Beatrice Kotoca, and Sub-County Probation Officer Sylvester Ekuwan, among others. They addressed questions from the community and offered advice on conflict resolution. The discussions centered on practical measures to address the issues and included contributions from community representatives, such as Beverlyne Maraka, who highlighted the impact of poverty on GBV. She cited cases of young girls being forced into sexual activities, leading to unaddressed pregnancies and unresolved legal cases.

Panelists underscored the need for better communication to resolve resource-based conflicts and intercommunity disputes. Lucia Nyumju, the chairlady of Kalobeyei Valley Two, pointed out that tensions between the host and refugee communities are often rooted in past experiences and misunderstandings. She advocated for community education on self-care, conflict resolution, and letting go of grudges to promote healing.`,
          image: {
            src: "panel-discussion.jpg",
            caption: "Panel of speakers addressing community concerns"
          }
        },
        {
          text: `The forum emphasized the importance of environmental conservation, noting that deforestation for charcoal production is against Article 109 of Kenya's constitution, which mandates the protection of the environment. Community leaders called for tree planting initiatives as a step toward sustainable resource management.

Senior Chief Cosmas Nakayart encouraged both the host and refugee communities to work together, stressing that peace in Kakuma could only be achieved through collective efforts. "Time will come when there will be no difference between the host and refugee communities. If we want Kakuma to be a peaceful place, let us work together in unity and learn to love one another," he said.

The Community Dialogues Forum marks a step towards fostering peace and addressing the underlying causes of conflicts in the region, with a strong emphasis on community-driven solutions and the need for ongoing collaboration among all stakeholders.`,
          image: {
            src: "community-unity.jpg",
            caption: "Host and refugee community members working together"
          }
        }
      ]
    },
    {
      title: "Project Design Team Forum in Kakuma and Kalobayei",
      date: "November 2023",
      category: "Community",
      description: "Kenya Community Media Network, Atanayece and REM-FM collaborate on addressing water conflicts and community issues.",
      image: "forum-discussion2.jpg",
      content: [
        {
          text: `This November, Kenya Community Media Network, in collaboration with Atanayece and REM-FM, hosted an important forum in Kakuma and Kalobayei settlements. The forum focused on critical issues impacting the community, including water-related conflicts, sexual and gender-based violence (GBV), and land disputes.`,
          image: {
            src: "forum-discussion2.jpg",
            caption: "Project Design Team Forum in session"
          }
        },
        {
          text: `Radio journalists Joseph Etabo, Peter Taban, and Ivy Sipoliko led the discussion, diving deep into the root causes of these conflicts and exploring sustainable solutions. Key insights were shared, such as the need for more water sources like boreholes to address water scarcity and the harmful impacts of early marriage on girls' education and health.`,
          image: {
            src: "panel-discussion2.jpg",
            caption: "Radio journalists leading the discussion"
          }
        },
        {
          text: `Community leaders, including Nyunyu Okello, Gilo Ojo, and others, also contributed their perspectives, emphasizing the role of education and community involvement in resolving these issues. It was clear that, while there are tensions, especially around water distribution, collaboration and mutual respect between both refugee and host communities are essential for lasting peace.

The forum served as a powerful platform for dialogue, bringing together journalists, community members, and leaders to tackle some of the region's most pressing challenges. 

Together, we can create a more peaceful and sustainable future for all.`,
          image: {
            src: "community-unity2.jpg",
            caption: "Community leaders sharing perspectives"
          }
        }
      ]
    }
  ];

  const handleStoryClick = (story) => {
    navigate(`/news/${story.title.toLowerCase().replace(/\s+/g, '-')}`, { state: { story } });
  };

  return (
    <div className="news">
      <div className="page-banner">
        <img 
          src="forum-discussion.jpg"
          alt="Latest News and Updates"
          className="banner-image"
        />
        <div className="banner-overlay"></div>
        <h1>News & Impact</h1>
      </div>

      <div className="container">
        <ScrollAnimation>
          <p className="page-intro">
            Stay updated with our latest initiatives, success stories, and community impact.
          </p>
        </ScrollAnimation>

        <ScrollAnimation>
          <div className="news-grid">
            {newsItems.map((story, index) => (
              <div 
                key={index} 
                className="news-card"
                onClick={() => handleStoryClick(story)}
              >
                <div className="news-card-image">
                  <img 
                    src={story.image} 
                    alt={story.title}
                    className="card-image"
                  />
                  <div className="image-overlay"></div>
                  <span className="news-category">{story.category}</span>
                </div>
                <div className="news-card-content">
                  <span className="news-date">{story.date}</span>
                  <h2>{story.title}</h2>
                  <p>{story.description}</p>
                  <button className="read-more">Read Full Story →</button>
                </div>
              </div>
            ))}
          </div>
        </ScrollAnimation>

        <Newsletter />
      </div>
    </div>
  );
};

export default News;