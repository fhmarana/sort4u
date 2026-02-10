import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import checkIcon from "@/assets/check.png"
import plateIcon from "@/assets/plate.png";
import reminderIcon from "@/assets/Reminder.png";
import moneyIcon from "@/assets/Money.png"



export default function LandingPage() {
    return (
        <div className="w-full">
            {/* NavBar Section - Responsive */}
            <nav className="flex justify-between items-center bg-white py-4 md:py-6 px-4 sm:px-8 md:px-12 lg:px-20 border-b">
                <div>
                    <span className="font-bold text-xl sm:text-2xl">SORT4U</span>
                </div>

                <div className="flex gap-2 sm:gap-3">
                    <Link to="/login">
                        <Button className="px-3 sm:px-4 md:px-6 py-5 bg-cyan-400 hover:bg-cyan-500 text-sm md:text-base">
                            Log in
                        </Button>
                    </Link>
                    
                    <Link to="/signup">
                        <Button variant="outline" className="px-3 sm:px-4 md:px-6 py-5  text-black text-sm md:text-base">
                            Sign up
                        </Button>
                    </Link>
                    
                </div>
            </nav>

            {/* Hero Section - Responsive: mobile (min-h-screen), tablet (h-auto), desktop (h-[1024px]) */}
            <section className="w-full min-h-screen lg:h-192 bg-white flex items-center justify-center px-4 sm:px-6 py-12 md:py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                        <span className="italic">Everything you need to stay on track</span>
                        <br />
                        <span className="font-bold not-italic">Sorted in one place.</span>
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl font-semibold mb-3 md:mb-4 px-2">
                        Track your food, your memories, and your money without the stress.
                    </p>

                    <p className="text-sm sm:text-xl mb-8 md:mb-10 text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                        SORT4U brings your daily essentials together in one clean, easy-to-use web app designed
                        for students and young professionals who want life to feel more organized—not more complicated.
                    </p>

                    <Link to="/signup">
                        <Button className="px-8 sm:px-10 py-4 sm:py-6 text-base sm:text-lg rounded-full bg-gray-800 hover:bg-gray-900 text-amber-50">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </section>

            {/* What is SORT4U Section */}
            <section className="w-full min-h-screen lg:min-h-256 bg-white flex items-center justify-center px-4 sm:px-6 py-12 md:py-20">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8">What is SORT4U?</h2>

                    <p className="text-sm sm:text-base text-gray-700 max-w-4xl mx-auto mb-12 md:mb-16 leading-relaxed px-4">
                        SORT4U is an all-in-one lifestyle and productivity platform that helps you manage the things that matter most every day.
                        Instead of juggling multiple apps, SORT4U combines calorie tracking, memory lane reminders, and budget
                        tracker tools into ONE space—so you can focus on living, not just tracking.
                    </p>

                    {/* Features Section */}
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12">Features Built for Real Life</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto ">
                        {/* Smart Calorie Tracker Card */}
                        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8 text-center hover:shadow-lg transition-shadow">
                            <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Smart Calorie Tracker</h4>
                            <img src={plateIcon} alt="Calorie Track" className="mx-auto block h-35 w-35 md:h-35 md:w-40 object-contain" />
                            <div className="text-3xl md:text-4xl mb-3 md:mb-4"></div>
                            <p className="text-xs sm:text-sm lg:text-[14px] mb-3 md:mb-4 font-bold">
                                No forms. No guessing. No overload.
                            </p>
                            <p className="text-xs sm:text-sm lg:text-[14px] mb-3 md:mb-9 text-black space-y-1.5 md:space-y-2">
                                Just type the name of the food you ate, and SORT4U’s AI instantly estimates its calorie content.
                                It’s a faster, simpler way to stay mindful of what you eat—perfect for busy days and real-world meals.
                            </p>

                            <p className="text-xs sm:text-sm lg:text-[14px] mb-3 md:mb-4 font-bold">
                                Why it works?
                            </p>
                            <p className="text-xs sm:text-sm lg:text-[14px] text-black space-y-1.5 md:space-y-2">
                                You track consistently because it’s quick, intuitive, and doesn’t demand nutrition expertise.
                            </p>
                        </div>

                        {/* Memory Lane Reminders Card */}
                        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8 text-center hover:shadow-lg transition-shadow">
                            <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Memory Lane Reminders</h4>
                            <img src={reminderIcon} alt="Calorie Track" className="mx-auto block h-30 w-30 md:h-40 md:w-35 object-contain" />
                            <p className="text-xs sm:text-sm lg:text-[14px] mb-3 md:mb-4 font-bold">
                                Reminders don’t have to feel cold or forgettable.
                            </p>
                            <p className="text-xs sm:text-sm lg:text-[14px] mb-3 md:mb-4 text-black space-y-1.5 md:space-y-2">
                                Upload a photo, add a reminder, set a date, include hashtags, and write a short note. SORT4U turns reminders into
                                personal memory moments—so you remember why something matters, not just when.
                            </p>

                            <p className="text-xs sm:text-sm lg:text-[14px] mb-3 md:mb-4 font-bold">
                                Why it works?.
                            </p>
                            <p className="text-xs sm:text-sm lg:text-[14px] text-black space-y-1.5 md:space-y-2">
                                Visual memories are easier to recall and feel more meaningful than plain text alerts.
                            </p>
                        </div>

                        {/* Goal-First Budget Tracker Card */}
                        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8 text-center hover:shadow-lg transition-shadow">
                            <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Goal-First Budget Tracker</h4>
                            <img src={moneyIcon} alt="Calorie Track" className="mx-auto block h-30 w-30 md:h-40 md:w-35 object-contain" />
                            <p className="text-xs sm:text-sm lg:text-[14px] mb-3 md:mb-4 font-bold">
                                Budgeting made realistic, not restrictive.
                            </p>
                            <p className="text-xs sm:text-sm lg:text-[14px] mb-3 md:mb-14 text-black space-y-1.5 md:space-y-2">
                                Start by setting a spending limit or savings goal. From there, SORT4U helps you track expenses based on that goal,
                                keeping you aware without overwhelming charts or financial jargon.
                            </p>

                            <p className="text-xs sm:text-sm lg:text-[14px] mb-3 md:mb-4 font-bold">
                                Why it works?
                            </p>
                            <p className="text-xs sm:text-sm lg:text-[14px] text-black space-y-1.5 md:space-y-2">
                                You stay in control of your money while still enjoying flexibility.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose SORT4U Section */}
            <section className="w-full min-h-screen lg:min-h-[900px] bg-white flex flex-col items-center justify-center px-4 sm:px-6 py-12 md:py-20">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 md:mb-16">Why Choose SORT4U?</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-12 md:mb-40 max-w-7xl mx-auto">
                        {/* Benefit Cards */}
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 md:p-6 text-center hover:shadow-lg transition-shadow">
                            <div className=" flex items-center justify-center mx-auto mb-1 md:mb-2">
                                <img src={checkIcon} alt="check" className="w-5 h-5 md:w-15 md:h-15 text-green-600" />
                            </div>
                            <p className="text-xs sm:text-sm font-semibold">
                                One platform instead of 3+ scattered apps
                            </p>
                        </div>

                        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 md:p-6 text-center hover:shadow-lg transition-shadow">
                            <div className=" flex items-center justify-center mx-auto mb-1 md:mb-2">
                                <img src={checkIcon} alt="check" className="w-5 h-5 md:w-15 md:h-15 text-green-600" />
                            </div>
                            <p className="text-xs sm:text-sm font-semibold">
                                Simple, sleek, designed for people—not corporations
                            </p>
                        </div>

                        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 md:p-6 text-center hover:shadow-lg transition-shadow">
                            <div className=" flex items-center justify-center mx-auto mb-1 md:mb-2">
                                <img src={checkIcon} alt="check" className="w-5 h-5 md:w-15 md:h-15 text-green-600" />
                            </div>
                            <p className="text-xs sm:text-sm font-semibold">
                                Built with students and young professionals in mind
                            </p>
                        </div>

                        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 md:p-6 text-center hover:shadow-lg transition-shadow">
                            <div className=" flex items-center justify-center mx-auto mb-1 md:mb-2">
                                <img src={checkIcon} alt="check" className="w-5 h-5 md:w-15 md:h-15 text-green-600" />
                            </div>
                            <p className="text-xs sm:text-sm font-semibold">
                                Clean design that prioritizes clarity over clutter
                            </p>
                        </div>

                        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 md:p-6 text-center hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
                            <div className=" flex items-center justify-center mx-auto mb-1 md:mb-2">
                                <img src={checkIcon} alt="check" className="w-5 h-5 md:w-15 md:h-15 text-green-600" />
                            </div>
                            <p className="text-xs sm:text-sm font-semibold">
                                Tools that adapt to your lifestyl, not the other way around
                            </p>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-8 md:mt-16">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 px-4">Start Sorting Your Life Today</h3>
                        <p className="text-sm sm:text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto px-4">
                            Stay organized. Stay mindful. Stay in control.<br />
                            SORT4U helps you keep it all together—without the hassle.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}