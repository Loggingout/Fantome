interface BookingButtonProps {
    onClick: () => void;
}

export default function BookingButton({ onClick}: BookingButtonProps) {
    

    return(
        <button onClick={onClick} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">Book Now</button>
    )
}