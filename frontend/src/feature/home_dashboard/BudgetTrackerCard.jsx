import { ArrowRight } from 'lucide-react';
import SummaryCard from "./SummaryCard";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';




export default function BudgetTrackerCard({ data, onViewDetails }){
    if(!data) return null;

    const { budget_summary, spending_trends, recent_transactions } = data

    return (
        <div className="bg-gray-300 rounded-3xl shad-md p-6">
            <div className=' flex justify-between mb-4'>
                <h2 className="text-xl font-bold">Budget Tracker</h2>
                <button
                    onClick={onViewDetails}
                    className='flex text-sm text-gray-500 font-medium cursor-pointer group'
                >
                    <span className='flex items-center gap-0.5 group-hover:border-b group-hover:border-gray-500 pb-px leading-none'>
                        <span>View Details</span>
                        <ArrowRight className='w-4 h-4'/>
                    </span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2 ">
                    {/*Budget Summary */}
                    <div className='grid grid-cols-4 gap-1'>
                        <SummaryCard 
                            label = "Budget"
                            value = {`₱${budget_summary.budget_amount.toLocaleString()}`}
                        />
                        <SummaryCard 
                            label = "Income"
                            value = {`₱${budget_summary.total_income.toLocaleString()}`}
                        />
                        <SummaryCard 
                            label = "Expense"
                            value = {`₱${budget_summary.total_expense.toLocaleString()}`}
                        />
                        <SummaryCard 
                            label = "Savings"
                            value = {`₱${budget_summary.total_savings.toLocaleString()}`}
                        />
                    </div>
                    
                    {/*Cycle Info */}
                    <div className=''>
                        <p className='font-bold text-sm'>
                            Current Cycle # {budget_summary.cycle_info.cycle_number}: {' '}
                        </p>

                        <div className='flex gap-3 text-[12px] '>
                            {new Date(budget_summary.cycle_info.start_date).toLocaleDateString()} - {' '}
                            {new Date(budget_summary.cycle_info.end_date).toLocaleDateString()}
                            <p className='font-bold text-amber-400'>{budget_summary.cycle_info.days_remaining}D left</p>
                        </div>
                        
                    </div>

                    {/*Recent Transactions */}

                    <div className='text-gray-700  rounded-2xl p-2 space-y-3 max-h-68 overflow-y-auto pr-2 custom-scrollbar'>
                        <h3 className='font-bold'>Recent Transactions</h3>
                        <div className=''>
                            {recent_transactions.transactions.map(transac => (
                                <div
                                    key={transac.id}
                                    className="flex justify-between items-center text-sm font-semibold mb-2 border-b border-gray-400/50 pb-2"
                                >
                                    <div>
                                        <p>{transac.description}</p>
                                        <p className='text-[10px] font-bold text-gray-600 opacity-70'>{transac.category?.name}</p>
                                    </div>
                                    <span className= {`font-bold ${transac.type === 'income' ? 'text-green-600' : 'text-red-500'} text-sm`}>
                                        {transac.type === "income" ? '+' : '-'}₱{transac.amount.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Line Graph */}
                <div>
                    <p className='font-bold text-2xl mb-10'>Spending Over Time</p>
                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={spending_trends.trends.map(t => ({
                                    name: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                                    value: t.amount,
                                }))}
                                margin={{ top: 35, right: 0, left: 0, bottom: 5 }}
                            >
                                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} />
                                <YAxis
                                    tick={{ fontSize: 10, fill: '#6b7280' }}
                                    tickFormatter={(v) => `₱${v.toLocaleString()}`}
                                    width={60}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                                    formatter={(value) => [`₱${value.toLocaleString()}`, 'Spent']}
                                />
                                <Area type="natural" dataKey="value" stroke="#c4b5fd" fill="#8b5cf6" fillOpacity={0.5} strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>




        </div>



    );
}