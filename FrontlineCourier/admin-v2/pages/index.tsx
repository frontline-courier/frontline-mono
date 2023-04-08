import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import type { NextPage } from 'next'

const Home: NextPage = () => {

  const iframeStyle = {
    background: '#FFFFFF;',
    border: 'none',
    borderRadius: '2px',
    boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)'
  }

  return (
    <>
      <div className="flex justify-between m-4">
        <div className="">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
        </div>
      </div>

      <div className="flex m-4">
        <div>
          <iframe style={iframeStyle} width="640" height="480" src="https://charts.mongodb.com/charts-varun-enterprises-kjutz/embed/charts?id=f41f0174-4843-44f1-be25-7a1684f925fa&maxDataAge=3600&theme=light&autoRefresh=false"></iframe>
        </div>
        <div>
          <iframe style={iframeStyle} width="640" height="480" src="https://charts.mongodb.com/charts-varun-enterprises-kjutz/embed/charts?id=69b1c5ca-3bf9-4ffe-a9a3-3ede14cfb14e&maxDataAge=3600&theme=light&autoRefresh=true"></iframe>
        </div>
      </div>
    </>
  )
}

export default withPageAuthRequired(Home);
