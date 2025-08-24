import React from 'react';
import { useQuery } from '@apollo/client/react';
import { Row, Col, Card, Spinner, Alert, Table } from 'react-bootstrap';
import { GET_DASHBOARD } from '../graphql/queries';
import { DashboardData } from '../types';
import { Users, FileText, MessageSquare, Heart } from 'lucide-react';

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
}> = ({ icon, title, value, color }) => (
  <Col md={3} sm={6} className="mb-4">
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body className="text-center">
        <div className={`mb-3 ${color}`}>{icon}</div>
        <h3 className="fw-bold">{value.toLocaleString()}</h3>
        <p className="text-muted mb-0">{title}</p>
      </Card.Body>
    </Card>
  </Col>
);

const Dashboard: React.FC = () => {
  const { loading, error, data } = useQuery(GET_DASHBOARD);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        Error loading dashboard: {error.message}
      </Alert>
    );
  }

  const dashboardData: DashboardData = data.dashboard;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 fw-bold">Dashboard</h1>
      </div>

      <Row className="mb-5">
        <StatCard
          icon={<Users size={32} />}
          title="Total Users"
          value={dashboardData.totalUsers}
          color="text-primary"
        />
        <StatCard
          icon={<FileText size={32} />}
          title="Total Posts"
          value={dashboardData.totalPosts}
          color="text-success"
        />
        <StatCard
          icon={<MessageSquare size={32} />}
          title="Total Comments"
          value={dashboardData.totalComments}
          color="text-warning"
        />
        <StatCard
          icon={<Heart size={32} />}
          title="Total Likes"
          value={dashboardData.totalLikes}
          color="text-danger"
        />
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <h5 className="mb-0 fw-semibold">User Statistics</h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>User</th>
                  <th className="text-center">Posts</th>
                  <th className="text-center">Comments</th>
                  <th className="text-center">Likes</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.userStats.map((user) => (
                  <tr key={user.id}>
                    <td className="fw-semibold">{user.username}</td>
                    <td className="text-center">{user.postCount}</td>
                    <td className="text-center">{user.commentCount}</td>
                    <td className="text-center">{user.likeCount}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;