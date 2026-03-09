export default function BackgroundDecorations() {
  return (
    <> 
      <div className="absolute w-80 h-80 md:w-140 md:h-140 bg-gray-200 rounded-full -top-20 -right-20 md:-top-30 md:-right-50 opacity-60"></div>
      <div className="absolute w-50 h-50 md:w-90 md:h-90 bg-gray-200 rounded-full -bottom-20 -left-20 md:-bottom-40 md:-left-30 opacity-40"></div>
      
      <div className="hidden md:block absolute w-30 h-30 bg-gray-200 rounded-full bottom-20 right-30 opacity-80"></div>
      <div className="hidden md:block absolute w-16 h-16 bg-gray-200 rounded-full top-40 left-10 opacity-50"></div>
    </>
  );
}