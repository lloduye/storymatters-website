import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { 
  FaUsers, FaHandshake, FaChartLine, FaCalendarAlt, 
  FaCheckCircle, FaTimesCircle, FaClock, FaEnvelope,
  FaNewspaper, FaDollarSign, FaEye, FaBell
} from 'react-icons/fa';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    volunteer: 0,
    partnership: 0,
    subscribers: 0,
    stories: 0,
    totalViews: 0,
    donations: 0,
    emails: 0
  });
  
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [recentSubscribers, setRecentSubscribers] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [viewsData, setViewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load submissions
      const submissionsRef = collection(db, 'submissions');
      const submissionsQuery = query(submissionsRef, orderBy('submittedAt', 'desc'));
      const submissionsSnapshot = await getDocs(submissionsQuery);
      
      const submissions = submissionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate()
      }));

      // Load subscribers
      const subscribersRef = collection(db, 'subscribers');
      const subscribersQuery = query(subscribersRef, orderBy('subscribedAt', 'desc'));
      const subscribersSnapshot = await getDocs(subscribersQuery);
      
      const subscribers = subscribersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        subscribedAt: doc.data().subscribedAt?.toDate()
      }));

      // Load stories/content
      const contentRef = collection(db, 'content');
      const contentQuery = query(contentRef, orderBy('createdAt', 'desc'));
      const contentSnapshot = await getDocs(contentQuery);
      
      const stories = contentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        views: doc.data().views || 0
      }));

      // Load donations
      const donationsRef = collection(db, 'donations');
      const donationsQuery = query(donationsRef, orderBy('date', 'desc'));
      const donationsSnapshot = await getDocs(donationsQuery);
      
      const donations = donationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate()
      }));

      // Calculate total views
      const totalViews = stories.reduce((acc, story) => acc + story.views, 0);

      // Calculate stats
      const newStats = {
        ...submissions.reduce((acc, sub) => ({
          total: acc.total + 1,
          pending: acc.pending + (sub.status === 'pending' ? 1 : 0),
          approved: acc.approved + (sub.status === 'approved' ? 1 : 0),
          rejected: acc.rejected + (sub.status === 'rejected' ? 1 : 0),
          volunteer: acc.volunteer + (sub.type === 'volunteer' ? 1 : 0),
          partnership: acc.partnership + (sub.type === 'partnership' ? 1 : 0)
        }), {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          volunteer: 0,
          partnership: 0
        }),
        subscribers: subscribers.length,
        stories: stories.length,
        totalViews,
        donations: donations.length,
        totalDonations: donations.reduce((acc, don) => acc + (don.amount || 0), 0),
        emails: subscribers.length // Assuming one email per subscriber
      };

      setStats(newStats);
      setRecentSubmissions(submissions.slice(0, 5));
      setRecentSubscribers(subscribers.slice(0, 5));
      setRecentDonations(donations.slice(0, 5));

      // Calculate trend data (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), i);
        return {
          date: format(date, 'MMM dd'),
          submissions: submissions.filter(sub => 
            format(sub.submittedAt, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
          ).length,
          subscribers: subscribers.filter(sub => 
            format(sub.subscribedAt, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
          ).length,
          donations: donations.filter(don => 
            format(don.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
          ).length
        };
      }).reverse();

      setTrendData(last7Days);

      // Calculate views data
      const viewsByStory = stories.map(story => ({
        name: story.title,
        views: story.views || 0
      })).sort((a, b) => b.views - a.views).slice(0, 5);

      setViewsData(viewsByStory);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#10B981', '#FCD34D', '#EF4444'];

  const pieData = [
    { name: 'Approved', value: stats.approved },
    { name: 'Pending', value: stats.pending },
    { name: 'Rejected', value: stats.rejected }
  ];

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard data...</div>;
  }

  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>Total Submissions</h3>
            <p>{stats.total}</p>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <h3>Pending</h3>
            <p>{stats.pending}</p>
          </div>
        </div>

        <div className="stat-card approved">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>Approved</h3>
            <p>{stats.approved}</p>
          </div>
        </div>

        <div className="stat-card rejected">
          <div className="stat-icon">
            <FaTimesCircle />
          </div>
          <div className="stat-content">
            <h3>Rejected</h3>
            <p>{stats.rejected}</p>
          </div>
        </div>

        <div className="stat-card subscribers">
          <div className="stat-icon">
            <FaBell />
          </div>
          <div className="stat-content">
            <h3>Subscribers</h3>
            <p>{stats.subscribers}</p>
          </div>
        </div>

        <div className="stat-card stories">
          <div className="stat-icon">
            <FaNewspaper />
          </div>
          <div className="stat-content">
            <h3>Stories</h3>
            <p>{stats.stories}</p>
          </div>
        </div>

        <div className="stat-card views">
          <div className="stat-icon">
            <FaEye />
          </div>
          <div className="stat-content">
            <h3>Total Views</h3>
            <p>{stats.totalViews}</p>
          </div>
        </div>

        <div className="stat-card donations">
          <div className="stat-icon">
            <FaDollarSign />
          </div>
          <div className="stat-content">
            <h3>Total Donations</h3>
            <p>${stats.totalDonations?.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Submission Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="submissions" 
                stroke="#3B82F6" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => 
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Top Stories by Views</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="activities-grid">
        <div className="recent-subscribers">
          <h3>Recent Subscribers</h3>
          <div className="subscribers-list">
            {recentSubscribers.map(subscriber => (
              <div key={subscriber.id} className="subscriber-item">
                <FaEnvelope />
                <span>{subscriber.email}</span>
                <span className="date">
                  {format(subscriber.subscribedAt, 'MMM dd, yyyy')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="recent-donations">
          <h3>Recent Donations</h3>
          <div className="donations-list">
            {recentDonations.map(donation => (
              <div key={donation.id} className="donation-item">
                <FaDollarSign />
                <span>${donation.amount}</span>
                <span>{donation.donor}</span>
                <span className="date">
                  {format(donation.date, 'MMM dd, yyyy')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="recent-submissions">
        <h3>Recent Submissions</h3>
        <div className="submissions-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Name</th>
                <th>Status</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {recentSubmissions.map(submission => (
                <tr key={submission.id}>
                  <td>{format(submission.submittedAt, 'MMM dd, yyyy')}</td>
                  <td>
                    {submission.type === 'volunteer' ? (
                      <span className="type volunteer">
                        <FaUsers /> Volunteer
                      </span>
                    ) : (
                      <span className="type partnership">
                        <FaHandshake /> Partnership
                      </span>
                    )}
                  </td>
                  <td>
                    {submission.type === 'volunteer' 
                      ? submission.name 
                      : submission.organizationName}
                  </td>
                  <td>
                    <span className={`status ${submission.status}`}>
                      {submission.status}
                    </span>
                  </td>
                  <td>
                    <a href={`mailto:${submission.email}`}>
                      <FaEnvelope /> {submission.email}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 