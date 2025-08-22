const { Pool } = require('pg');
require('dotenv').config({ path: './env.local' });

// Direct Neon database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

console.log('Connecting to Neon database...');
console.log('Database URL configured:', !!process.env.DATABASE_URL);

// Test stories data for Imani Rugenge
const testStories = [
  {
    title: "Empowering Youth Through Digital Skills",
    excerpt: "How our community program is transforming young lives through technology education and digital literacy training.",
    content: `<p>In the heart of our community, a remarkable transformation is taking place. Young people who once felt disconnected from the digital world are now creating websites, building mobile apps, and launching their own online businesses.</p>

<p>Our Digital Skills Empowerment Program, launched six months ago, has already reached over 200 youth aged 16-25. The program focuses on practical skills that matter: web development, digital marketing, graphic design, and entrepreneurship.</p>

<h3>Real Impact, Real Stories</h3>
<p>Meet Sarah, 19, who started the program with no computer experience. Today, she runs a successful online clothing boutique that serves customers across three provinces. "I never imagined I could build something like this," she says, pointing to her professionally designed website.</p>

<p>Then there's Marcus, 22, who used his new video editing skills to start a content creation business. He now works with local businesses to create promotional videos and social media content.</p>

<h3>The Ripple Effect</h3>
<p>What started as a small initiative has created a ripple effect throughout the community. Program graduates are now mentoring new participants, creating a sustainable cycle of learning and growth.</p>

<p>The program offers:</p>
<ul>
<li>Free laptops for all participants</li>
<li>High-speed internet access</li>
<li>Mentorship from industry professionals</li>
<li>Job placement assistance</li>
<li>Micro-grants for startup ideas</li>
</ul>

<p>As we look to the future, we're expanding the program to reach even more young people. Because when we invest in digital skills, we're investing in our community's future.</p>`,
    category: "Youth Empowerment",
    location: "Kampala, Uganda",
    readTime: "4 min read",
    tags: "youth, technology, education, empowerment, digital skills",
    author: "Imani Rugenge",
    status: "published",
    featured: "true",
    publishDate: "2024-01-15",
    viewCount: 156,
    imageName: "2025-01-17-nurture-talent.jpg"
  },
  {
    title: "Women Leading Change in Rural Communities",
    excerpt: "Exploring how women entrepreneurs are driving economic transformation in rural areas through innovative business solutions.",
    content: `<p>In the rolling hills of rural Uganda, a quiet revolution is taking place. Women entrepreneurs are not just participating in the economy—they're transforming it.</p>

<p>Over the past year, I've had the privilege of documenting the stories of remarkable women who are reshaping their communities through innovative business ventures and unwavering determination.</p>

<h3>Breaking Barriers, Building Businesses</h3>
<p>Grace Nakato started with just 50,000 shillings and a dream. Today, her organic farming cooperative employs 45 women and supplies fresh produce to markets across the region. "We don't wait for opportunities," she explains, "we create them."</p>

<p>Her cooperative has revolutionized local agriculture by:</p>
<ul>
<li>Introducing sustainable farming practices</li>
<li>Establishing direct market connections</li>
<li>Providing financial literacy training</li>
<li>Creating a savings and loan program</li>
</ul>

<h3>The Power of Collective Action</h3>
<p>What makes these women's stories particularly inspiring is their commitment to lifting others as they climb. Every successful business becomes a stepping stone for other women in the community.</p>

<p>Mary Atim's tailoring business has grown from a single sewing machine to a workshop employing 12 women. But her impact goes beyond employment—she's created a skills training program that has taught over 100 women to sew.</p>

<h3>Technology as a Game Changer</h3>
<p>Mobile money and digital platforms have been game changers for these rural entrepreneurs. Agnes Amongi, who runs a successful chicken farming operation, uses mobile banking to manage payments and a smartphone app to track her inventory.</p>

<p>These women are proving that with the right support, rural communities can become engines of innovation and economic growth. Their stories remind us that change often begins with a single person willing to take the first step.</p>`,
    category: "Women Empowerment",
    location: "Mbarara, Uganda",
    readTime: "6 min read",
    tags: "women, entrepreneurship, rural development, agriculture, empowerment",
    author: "Imani Rugenge",
    status: "published",
    featured: "false",
    publishDate: "2024-01-22",
    viewCount: 289,
    imageName: "2025-02-03-girls-media.jpeg"
  },
  {
    title: "Building Bridges Through Community Art Projects",
    excerpt: "How local artists are using creative expression to address social issues and bring communities together.",
    content: `<p>Art has always been a powerful medium for storytelling, but in our community, it's becoming something even more profound—a bridge between divided groups and a catalyst for positive change.</p>

<p>The Community Art Bridge Project, which I've been following for the past six months, demonstrates how creative expression can address complex social issues while fostering unity and understanding.</p>

<h3>Art as a Universal Language</h3>
<p>When words fail, art speaks. This truth became evident during our recent peace mural project, where artists from different ethnic backgrounds worked together to create a stunning 100-meter wall painting depicting shared hopes and dreams.</p>

<p>James Okello, a young painter involved in the project, reflects: "Through art, we realized we have more in common than we thought. The colors we use, the stories we tell—they're universal."</p>

<h3>Addressing Social Issues Through Creativity</h3>
<p>The project has tackled various community challenges:</p>
<ul>
<li><strong>Environmental awareness:</strong> Sculptures made from recycled materials highlight pollution concerns</li>
<li><strong>Gender equality:</strong> Theater performances challenging stereotypes</li>
<li><strong>Youth engagement:</strong> Hip-hop concerts promoting positive messages</li>
<li><strong>Cultural preservation:</strong> Traditional dance workshops for young people</li>
</ul>

<h3>Economic Impact</h3>
<p>Beyond social benefits, the art projects have created economic opportunities. Local artists have formed cooperatives, selling their work to tourists and art collectors. The monthly art market now attracts visitors from neighboring districts.</p>

<p>Betty Nakimuli, a ceramic artist, shares her transformation: "Before this project, I was struggling to make ends meet. Now I have regular customers and have trained five other women in pottery. Art has become our livelihood."</p>

<h3>The Ripple Effect</h3>
<p>What started as a small initiative has grown into a movement. Schools now incorporate community art projects into their curricula, and local government has allocated funds for public art installations.</p>

<p>The success of these projects proves that art isn't just decoration—it's a powerful tool for community development and social change.</p>`,
    category: "Arts & Culture",
    location: "Jinja, Uganda",
    readTime: "5 min read",
    tags: "art, community, culture, social change, unity",
    author: "Imani Rugenge",
    status: "published",
    featured: "false",
    publishDate: "2024-02-05",
    viewCount: 178,
    imageName: "2025-01-07-art-for.jpeg"
  },
  {
    title: "Healthcare Innovation in Remote Villages",
    excerpt: "Discovering how mobile health clinics and telemedicine are revolutionizing healthcare access in underserved communities.",
    content: `<p>In remote villages where the nearest hospital is hours away, healthcare innovation is literally saving lives. Mobile clinics and telemedicine programs are bridging the gap between urban medical expertise and rural healthcare needs.</p>

<p>During my three-week journey through remote communities, I witnessed firsthand how technology and innovative thinking are transforming healthcare delivery in areas previously considered unreachable.</p>

<h3>Mobile Clinics: Healthcare on Wheels</h3>
<p>The mobile health unit arrives in Kasese village every Tuesday at 9 AM sharp. Dr. Patricia Namara and her team have been making this journey for two years, bringing essential medical services directly to people's doorsteps.</p>

<p>"We see everything from routine check-ups to emergency cases," Dr. Namara explains while preparing for the day's consultations. "But more importantly, we're building trust and educating communities about preventive care."</p>

<p>The mobile clinic provides:</p>
<ul>
<li>Basic medical consultations</li>
<li>Vaccination programs</li>
<li>Maternal health services</li>
<li>Health education workshops</li>
<li>Pharmacy services</li>
<li>Emergency medical response</li>
</ul>

<h3>Telemedicine: Connecting Experts to Patients</h3>
<p>When complex cases arise, the mobile clinic connects to specialists in the capital through telemedicine technology. I watched as a patient with chest pains received real-time consultation from a cardiologist 300 kilometers away.</p>

<p>The telemedicine program has achieved remarkable results:</p>
<ul>
<li>Reduced travel costs for patients by 80%</li>
<li>Decreased emergency referral times from days to hours</li>
<li>Improved diagnostic accuracy through specialist consultations</li>
<li>Enhanced local healthcare worker training</li>
</ul>

<h3>Community Health Champions</h3>
<p>Perhaps the most sustainable aspect of this healthcare revolution is the training of local community health workers. Martha Achieng, a mother of four, completed the program six months ago and now serves as her village's primary health educator.</p>

<p>"I can handle basic treatments, recognize emergency symptoms, and connect people to the mobile clinic," she says proudly. "My neighbors trust me because I understand their challenges."</p>

<h3>Challenges and Solutions</h3>
<p>The program faces challenges—unreliable internet connectivity, funding constraints, and cultural barriers. However, innovative solutions are emerging:</p>
<ul>
<li>Solar-powered communication equipment</li>
<li>Offline diagnostic tools</li>
<li>Community-funded health insurance schemes</li>
<li>Cultural sensitivity training for medical staff</li>
</ul>

<p>This healthcare innovation proves that with creativity and commitment, geographical barriers don't have to mean healthcare barriers. Every village deserves access to quality medical care, and these programs are making that vision a reality.</p>`,
    category: "Health",
    location: "Kasese, Uganda",
    readTime: "7 min read",
    tags: "healthcare, innovation, telemedicine, rural health, mobile clinics",
    author: "Imani Rugenge",
    status: "published",
    featured: "true",
    publishDate: "2024-02-12",
    viewCount: 342,
    imageName: "2025-03-04-training-session.jpg"
  },
  {
    title: "Environmental Conservation Through Youth Leadership",
    excerpt: "Young environmental activists are leading the charge in forest conservation and sustainable development initiatives.",
    content: `<p>Climate change isn't a distant threat—it's a reality that young people in our communities face every day. But rather than waiting for solutions from others, they're taking action themselves, leading innovative conservation projects that are making a real difference.</p>

<p>The Youth Environmental Leadership Initiative, which started with just 10 passionate young people, has grown into a movement involving over 500 youth across five districts.</p>

<h3>Reforestation with Purpose</h3>
<p>Every Saturday morning, you'll find Emmanuel Kiprotich and his team of young volunteers planting trees on the hillsides of Mount Elgon. But this isn't just about planting trees—it's about restoring ecosystems and creating sustainable livelihoods.</p>

<p>"We don't just plant and leave," Emmanuel explains, holding a young eucalyptus seedling. "We work with local farmers to establish agroforestry systems that provide income while protecting the environment."</p>

<p>The reforestation program includes:</p>
<ul>
<li>Native species restoration</li>
<li>Fruit tree plantations for food security</li>
<li>Medicinal plant gardens</li>
<li>Community woodlots for sustainable timber</li>
<li>Watershed protection initiatives</li>
</ul>

<h3>Innovation in Action</h3>
<p>What sets these young environmentalists apart is their innovative approach. They've developed mobile apps to track tree survival rates, created social media campaigns that reach thousands, and established tree nurseries that generate income for local communities.</p>

<p>Mercy Atyang, 22, leads the organization's technology initiatives. "We use drones to monitor forest coverage and GPS to track our planting sites," she says. "Technology helps us be more effective and accountable."</p>

<h3>Beyond Trees: Comprehensive Environmental Action</h3>
<p>The initiative has expanded beyond reforestation to address various environmental challenges:</p>

<h4>Waste Management</h4>
<p>Youth-led recycling programs have reduced community waste by 40% while creating employment opportunities for young people.</p>

<h4>Clean Energy</h4>
<p>Solar panel installation projects have brought clean energy to 150 rural households, reducing dependence on firewood and kerosene.</p>

<h4>Water Conservation</h4>
<p>Rainwater harvesting systems designed and built by youth teams now serve 30 schools and community centers.</p>

<h3>Changing Mindsets</h3>
<p>Perhaps the most significant impact is the change in community attitudes toward environmental conservation. Young activists organize workshops, school programs, and community events that educate people about climate change and sustainable practices.</p>

<p>"We're not just fighting for trees," says Sarah Chemutai, the initiative's communications coordinator. "We're fighting for our future. And we're showing that young people can lead the way in creating positive change."</p>

<h3>Scaling Up</h3>
<p>The success of local projects has attracted attention from government agencies and international organizations. The youth group has received funding to expand their programs and train young environmental leaders in other regions.</p>

<p>Their story demonstrates that environmental conservation isn't just about policy and regulations—it's about empowering young people to become stewards of their environment and champions of sustainable development.</p>

<p>As I watched the sunrise over newly planted hillsides, I realized that these young environmentalists aren't just planting trees—they're planting hope for a sustainable future.</p>`,
    category: "Environment",
    location: "Mount Elgon, Uganda",
    readTime: "8 min read",
    tags: "environment, youth, conservation, sustainability, climate change",
    author: "Imani Rugenge",
    status: "published",
    featured: "false",
    publishDate: "2024-02-20",
    viewCount: 267,
    imageName: "2025-03-22-youth-discussion.jpg"
  }
];

async function addTestStories() {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    // First, check if Imani Rugenge exists
    console.log('Checking if user Imani Rugenge exists...');
    const userResult = await client.query('SELECT * FROM users WHERE full_name = $1', ['Imani Rugenge']);
    
    if (userResult.rows.length === 0) {
      console.log('User Imani Rugenge not found. Creating user...');
      
      // Create the user first
      const createUserResult = await client.query(`
        INSERT INTO users (username, full_name, email, password_hash, role, status, phone, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        'imani.rugenge',
        'Imani Rugenge',
        'imani.rugenge@storymatters.org',
        '$2a$10$placeholder.hash.for.testing.purposes.only',
        'editor',
        'active',
        '+256 700 123 456',
        new Date(),
        new Date()
      ]);
      
      console.log('User created:', createUserResult.rows[0]);
    } else {
      console.log('User Imani Rugenge found:', userResult.rows[0]);
    }
    
    // Clear existing stories by Imani Rugenge
    console.log('Clearing existing stories by Imani Rugenge...');
    await client.query('DELETE FROM stories WHERE author = $1', ['Imani Rugenge']);
    
    // Add new test stories
    console.log('Adding test stories...');
    
    for (let i = 0; i < testStories.length; i++) {
      const story = testStories[i];
      
      console.log(`Adding story ${i + 1}: ${story.title}`);
      
             const result = await client.query(`
         INSERT INTO stories (
           title, excerpt, content, category, location, read_time, tags, author, 
           status, featured, publish_date, view_count, image, created_at, updated_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         RETURNING *
       `, [
         story.title,
         story.excerpt,
         story.content,
         story.category,
         story.location,
         story.readTime,
         story.tags,
         story.author,
         story.status,
         story.featured === 'true',
         story.publishDate,
         story.viewCount,
         story.imageName,
         new Date(),
         new Date()
       ]);
      
      console.log(`✓ Story added with ID: ${result.rows[0].id}`);
    }
    
    client.release();
    console.log(`\n✅ Successfully added ${testStories.length} test stories for Imani Rugenge!`);
    
    // Verify the stories were added
    const verifyClient = await pool.connect();
    const verifyResult = await verifyClient.query('SELECT id, title, author, status FROM stories WHERE author = $1', ['Imani Rugenge']);
    verifyClient.release();
    
    console.log('\n📚 Stories in database for Imani Rugenge:');
    verifyResult.rows.forEach((story, index) => {
      console.log(`${index + 1}. "${story.title}" (ID: ${story.id}, Status: ${story.status})`);
    });
    
  } catch (error) {
    console.error('Error adding test stories:', error);
  } finally {
    await pool.end();
  }
}

// Run the script
addTestStories();
