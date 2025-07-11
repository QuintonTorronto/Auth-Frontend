interface Props {
  name: string;
  email: string;
}

export default function WelcomeCard({ name, email }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">
        Welcome, {name || "User"}!
      </h2>
      <p className="text-sm text-gray-600">Email: {email || "..."}</p>
    </div>
  );
}
