import Layout from "@/layouts/default"
import { ReactElement } from "react"

const Dashboard = () => {
  return (
    <>
      <div className="bg-cover h-full w-full" style={{
        background: "linear-gradient(90deg,rgba(25,24,24,1.0),#005741)"
      }}>
        <div className="bg-[url('/images/bg.svg')] pt-40 pb-32 gap-10 h-full w-full flex flex-col justify-center items-center">
        </div>
      </div>
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