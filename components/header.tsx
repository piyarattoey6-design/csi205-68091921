'use client'
import { Badge } from "@/components/tailgrids/core/badge";
import NavMenu from "./NavMenu";

export default function Header (){
    return(
        // header container
        <div className='mt-4 text-center'>
            {/* code  */}
            <div className='flex justify-center gap-4'>
        <Badge size="lg" className='h-16 w-16 justify-center rounded-lg text-3xl font-bold text-white bg-red-500 -rotate-6'>C</Badge>
        <Badge size="lg" className='h-16 w-16 justify-center rounded-lg text-3xl font-bold text-white bg-green-600 rotate-6'>S</Badge>
        <Badge size="lg" className='h-16 w-16 justify-center rounded-lg text-3xl font-bold text-white bg-blue-600 -rotate-6'>I</Badge>
        <Badge size="lg" className='h-16 w-16 justify-center rounded-lg text-3xl font-bold text-white bg-cyan-400 rotate-6'>2</Badge>
        <Badge size="lg" className='h-16 w-16 justify-center rounded-lg text-3xl font-bold text-white bg-amber-400 -rotate-6'>0</Badge>
        <Badge size="lg" className='h-16 w-16 justify-center rounded-lg text-3xl font-bold text-white bg-gray-500 rotate-6'>5</Badge>
            </div>

            {/* name  */}
            <div className='mt-4 flex justify-center'>
                <Badge size="lg" className='rounded-lg bg-gray-900 px-5 py-2 text-2xl font-bold text-white'>FRONT END SOFTWARE DEVELOPMENT</Badge>
            </div>

            {/* menu */}
            <NavMenu />

        </div>
        
    )
}