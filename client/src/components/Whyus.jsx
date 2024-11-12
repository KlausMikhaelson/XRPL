import React from 'react'
import CardR from './CardR'
import CardL from './CardL'
import Img1 from '../assets/home-banner.png'
import Img2 from '../assets/learn.png'
import Img3 from '../assets/skills.png'
const Whyus = () => {
  return (
    <div className='text-white flex flex-col items-center py-16 md:py-28 lg:py-32 mt-10 md:mt-0 '>
        <CardR img={Img1} title="Connect with Like-Minded Developers" content="CodeConnect brings together a diverse community of coding enthusiasts who share your passion. Forge connections, exchange ideas, and learn from others in a vibrant and supportive environment."/>
        <CardL img={Img2} title="Supercharged Coding Skills" content="Two heads are better than one! Our cutting-edge algorithm matches you with the perfect coding buddy based on your skills, interests, and goals. Collaborate on projects, solve problems together, and elevate your coding expertise to new heights."/>
        <CardR img={Img3} title="Global Network" content="CodeConnect isn't just limited to your local area. Connect with coding buddies from around the world, gaining fresh perspectives and insights that can take your projects to the next level."/>
    </div>
  )
}

export default Whyus