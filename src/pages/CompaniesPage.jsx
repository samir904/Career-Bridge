import CompanyList from '../components/company/CompanyList';
import HomeLayout from '../components/HomeLayout';

export default function CompaniesPage() {
  return (
    <HomeLayout>
    <div className="page-container">
      <CompanyList />
    </div>
    </HomeLayout>
  );
}
