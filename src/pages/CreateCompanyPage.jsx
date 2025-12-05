import CreateCompany from '../components/company/CreateCompany';
import HomeLayout from '../components/HomeLayout';

export default function CreateCompanyPage() {
  return (
    <HomeLayout>
    <div className="page-container">
      <CreateCompany />
    </div>
    </HomeLayout>
  );
}
