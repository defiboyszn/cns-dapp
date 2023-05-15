import Layout from "@/layouts/default"
import { ReactElement } from "react"

const Dashboard = () => {
    return (
        <>
        
        </>
    )
}



Dashboard.getLayout = function getLayout(page: ReactElement) {
    return (
      <Layout>
        {page}
      </Layout>
    )
  }