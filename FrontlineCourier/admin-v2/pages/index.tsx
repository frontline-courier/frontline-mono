import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <p className="text-2xl">Welcome to Frontline Admin Portal, Login to continue...</p>
      </div>
    </div>
  )
}

export default Home
