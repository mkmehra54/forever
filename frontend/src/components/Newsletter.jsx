import React from 'react'

const Newsletter = () => {
    const submitHandler = (e) => {
        e.preventDefault();
        
    }
  return (
    <section className='text-center'>
        <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
        <p className='text-gray-400 mt-3'>Join our newsletter for exclusive updates, style tips, and early access to new arrivals and special offers. Be the first to know — straight to your inbox.</p>
        <form onClick={submitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3 rounded-sm overflow-hidden'>
            <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter your email' id='' name='' />
            <button type='submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
        </form>
    </section>
  )
}

export default Newsletter