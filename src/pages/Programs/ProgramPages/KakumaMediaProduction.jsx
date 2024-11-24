import React from 'react';
import '../ProgramPage.css';
import ScrollAnimation from '../../../components/ScrollAnimation/ScrollAnimation';
import ImagePlaceholder from '../../../components/ImagePlaceholder/ImagePlaceholder';
import Newsletter from '../../../components/Newsletter/Newsletter';

const KakumaMediaProduction = () => {
  return (
    <div className="program-page">
      <div className="program-banner">
        <ImagePlaceholder 
          width={1920} 
          height={400} 
          text="Kakuma+Media+Production"
          className="banner-image"
        />
        <h1>Kakuma Media Production</h1>
      </div>

      <ScrollAnimation>
        <section className="program-intro">
          <h2>Coming Soon</h2>
          <p>This program is currently under development. Please check back later for updates.</p>
        </section>
      </ScrollAnimation>

      <Newsletter />
    </div>
  );
};

export default KakumaMediaProduction; 