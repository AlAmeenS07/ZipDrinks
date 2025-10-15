import { useSelector } from "react-redux"
import AdminMain from "../../Components/Admin/AdminMain"

const AdminDash = () => {

  const name = useSelector(state => state.admin.adminData);
  // {console.log(name)}

  return (
    <>
      <AdminMain>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <h3>Name - {name?.fullname}</h3>
          </div>
      </AdminMain>
    </>
  )
}

export default AdminDash