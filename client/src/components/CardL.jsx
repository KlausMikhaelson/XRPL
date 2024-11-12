import React from 'react'

const CardL = (props) => {
  return (
    <div className='flex text-white flex-wrap items-center justify-around px-20 md:px-28 lg:px-32 mb-20 md:mb-0  '>
        <div>
            <img src={props.img} alt="" />
        </div>
        <div className='text-white border-4 border-white rounded-lg flex flex-col md:w-[40%] w-fit items-center justify-evenly p-12 md:p-16 text-center'>
            <h1 className='text-xl md:text-2xl font-bold text-white text-center'>{props.title}</h1>
            <h1 className='text-base md:text-xl text-white text-justify mt-10'>{props.content}</h1>
        </div>
    </div>
  )
}

export default CardL