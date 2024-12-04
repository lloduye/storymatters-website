import React from 'react';
import './News.css';
import ScrollAnimation from '../../components/ScrollAnimation/ScrollAnimation';
import ImagePlaceholder from '../../components/ImagePlaceholder/ImagePlaceholder';
import Newsletter from '../../components/Newsletter/Newsletter';

const News = () => {
  const newsItem = {
    title: "Community Dialogues Forum in Kakuma and Kalobeyei Seeks Solutions to Local Conflicts",
    date: "March 2024",
    category: "Community",
    content: [
      {
        text: `The Kenya Community Media Network, in collaboration with REF-FM and Atanayeche, hosted a crucial forum this month in Kakuma and Kalobeyei to address the underlying causes of conflicts in the area. The Community Dialogues Forum served as a platform for bringing together community members, local leaders, and experts to discuss and find sustainable solutions to pressing issues such as land disputes, resource-based conflicts, and gender-based violence (GBV). The event aimed to foster dialogue and collaboration in resolving the challenges faced by both the host and refugee communities.

The forum addressed critical problems such as land conflicts driven by deforestation for charcoal production, exacerbated by a growing population and strained relationships between the host and refugee communities. It also tackled inadequate access to water and food, which continues to fuel tension in the area. Attendees engaged in discussions aimed at fostering unity and promoting peacebuilding initiatives.`,
        image: {
          src: "Forum+Discussion",
          caption: "Community members engaging in dialogue during the forum"
        }
      },
      {
        text: `The forum featured a diverse panel of speakers, including Senior Chief Cosmas Nakayart Esuguru from Kakuma, probation Assistant Director of Turkana West Beatrice Kotoca, and Sub-County Probation Officer Sylvester Ekuwan, among others. They addressed questions from the community and offered advice on conflict resolution. The discussions centered on practical measures to address the issues and included contributions from community representatives, such as Beverlyne Maraka, who highlighted the impact of poverty on GBV. She cited cases of young girls being forced into sexual activities, leading to unaddressed pregnancies and unresolved legal cases.

Panelists underscored the need for better communication to resolve resource-based conflicts and intercommunity disputes. Lucia Nyumju, the chairlady of Kalobeyei Valley Two, pointed out that tensions between the host and refugee communities are often rooted in past experiences and misunderstandings. She advocated for community education on self-care, conflict resolution, and letting go of grudges to promote healing.`,
        image: {
          src: "Panel+Discussion",
          caption: "Panel of speakers addressing community concerns"
        }
      },
      {
        text: `The forum emphasized the importance of environmental conservation, noting that deforestation for charcoal production is against Article 109 of Kenya's constitution, which mandates the protection of the environment. Community leaders called for tree planting initiatives as a step toward sustainable resource management.

Senior Chief Cosmas Nakayart encouraged both the host and refugee communities to work together, stressing that peace in Kakuma could only be achieved through collective efforts. "Time will come when there will be no difference between the host and refugee communities. If we want Kakuma to be a peaceful place, let us work together in unity and learn to love one another," he said.

The Community Dialogues Forum marks a step towards fostering peace and addressing the underlying causes of conflicts in the region, with a strong emphasis on community-driven solutions and the need for ongoing collaboration among all stakeholders.`,
        image: {
          src: "Community+Unity",
          caption: "Host and refugee community members working together"
        }
      }
    ]
  };

  return (
    <div className="news">
      <div className="page-banner">
        <ImagePlaceholder 
          width={1920} 
          height={400} 
          text="Latest+News+and+Updates"
          className="banner-image"
        />
        <h1>News & Impact</h1>
      </div>

      <ScrollAnimation>
        <p className="page-intro">
          Stay updated with our latest initiatives, success stories, and community impact.
        </p>
      </ScrollAnimation>

      <ScrollAnimation>
        <article className="news-article">
          <div className="article-header">
            <h2>{newsItem.title}</h2>
            <div className="article-meta">
              <span className="article-date">{newsItem.date}</span>
              <span className="article-category">{newsItem.category}</span>
            </div>
          </div>
          
          <div className="article-sections">
            {newsItem.content.map((section, idx) => (
              <div key={idx} className="content-section">
                {idx % 2 === 0 ? (
                  <>
                    <div className="text-content">
                      {section.text.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>
                    <figure className="section-image">
                      <ImagePlaceholder 
                        width={600} 
                        height={400} 
                        text={section.image.src}
                      />
                      <figcaption>{section.image.caption}</figcaption>
                    </figure>
                  </>
                ) : (
                  <>
                    <figure className="section-image">
                      <ImagePlaceholder 
                        width={600} 
                        height={400} 
                        text={section.image.src}
                      />
                      <figcaption>{section.image.caption}</figcaption>
                    </figure>
                    <div className="text-content">
                      {section.text.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </article>
      </ScrollAnimation>

      <Newsletter />
    </div>
  );
};

export default News;