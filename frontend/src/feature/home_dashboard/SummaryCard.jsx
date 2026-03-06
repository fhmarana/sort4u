

export default function SummaryCard({ label, value }) {
    return(
        <div className="bg-gray-100 p-3 rounded-2xl">
            <p className="text-xs text-gray-500 uppercase font-bold">{label}</p>
            <p className="text-lg font-black mt-1">{value}</p>
        </div>
    );
}



