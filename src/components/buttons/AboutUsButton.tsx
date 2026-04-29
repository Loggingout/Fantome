interface AboutUsButtonProps {
    onClick: () => void;
}
export default function AboutUsButton({ onClick }: AboutUsButtonProps) {
    return(
        // Button should fit in the navbar header section via LandingPage.tsx, will build a seperate component for the Navbar later.
        <button onClick={onClick} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">About Us</button>
    )
}