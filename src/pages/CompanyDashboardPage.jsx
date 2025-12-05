import CompanyDashboard from '../components/company/CompanyDashboard';
import HomeLayout from '../components/HomeLayout';

export default function CompanyDashboardPage() {
  return (
    <HomeLayout>
    <div className="page-container">
      <CompanyDashboard />
    </div>
    </HomeLayout>
  );
}
