import CompanyDetail from '../components/company/CompanyDetail';
import HomeLayout from '../components/HomeLayout';

export default function CompanyDetailsPage() {
  return (
    <HomeLayout>
    <div className="page-container">
      <CompanyDetail />
    </div>
    </HomeLayout>
  );
}
