
import { ArrowRight } from 'lucide-react';



export default function MemoryLaneCard({data, onViewAll}){
    if (!data) return null;

    return (
        <div className="bg-gray-300 rounded-3xl shadow-md p-6 min-h-80 max-h-96">
            <div className='flex items-center justify-between'>
                <h2 className="text-xl font-bold"> Memory Lane</h2>
                <button
                    onClick={onViewAll}
                    className='flex text-sm text-gray-500 font-medium cursor-pointer group'
                >
                    <span className='flex items-center gap-0.5 group-hover:border-b group-hover:border-gray-500 pb-px leading-none'>
                        <span>View All</span>
                        <ArrowRight className='w-4 h-4'/>
                    </span>
                </button>
            </div>

            <p className='text-[12px] text-gray-700 opacity-50 mb-4'> 
                {data.total_memories} memories captured
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {data.memories.length > 0? (
                    data.memories.map(memory => (
                        <div
                            key={memory.id}
                            className='flex items-center gap-3 pl-5  transition-colors bg-gray-400 rounded-2xl'
                        >
                            <div className='flex-1'>
                                <p className='text-[12px] font-medium text-black opacity-70 font-semibold'>
                                    {memory.description}
                                </p>
                            </div>

                            {memory.image_url ? (
                                <img 
                                    src={memory.image_url}
                                    alt= {memory.description}
                                    className='w-50 h-10 rounded-r-lg object-cover  bg-gray-200 ' />
                            ) : (
                                <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                                    <span className="text-gray-400 text-2xl">📷</span>
                                </div>
                            )}

                            
                        </div>
                    ))
                ) : (
                    <p> No memories yet</p>
                )}
            </div>


        </div>
    );
}