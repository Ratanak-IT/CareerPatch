export default function ButtonComponent({ text = "Apply Now", onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        bg-[#1E88E5]
        hover:bg-[#2563EB]
        active:scale-95
        transition-all duration-200
        text-white
        text-sm
        font-medium
        px-5 py-2
        rounded-xl
        shadow-sm
        hover:shadow-md
        font-poppins
      "
    >
      {text}
    </button>
  );
}