interface SessionStepOneFormProps {
  name: string;
  setName: (value: string) => void;
  nameError: boolean;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SessionForm({ name, setName, nameError, loading, error, onSubmit }: SessionStepOneFormProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-100">EphemChat</h1>
          <p className="mt-1 text-sm text-neutral-500">Anonymous Chat</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Name Input */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs font-medium tracking-wide text-neutral-400 uppercase">
              Display Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={17}
              className={`w-full rounded border px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 transition-colors outline-none ${
                nameError
                  ? "border-red-800 bg-red-950 focus:border-red-700"
                  : "border-neutral-700 bg-neutral-900 focus:border-neutral-600"
              }`}
              autoFocus
            />
            <div className="flex justify-between text-xs text-neutral-500">
              <span>{nameError ? "Name must be 3-17 characters" : "3 to 17 characters"}</span>
              <span>{name.length}/17</span>
            </div>
          </div>

          {/* Error Display */}
          {error && <div className="rounded border border-red-900 bg-red-950 px-4 py-2 text-sm text-red-200">{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={nameError || !name || loading}
            className="w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm font-medium text-neutral-200 transition-colors hover:border-neutral-600 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? "Creating Session..." : "Create Session"}
          </button>
        </form>

        {/* Info Box */}
        <div className="space-y-2 rounded border border-neutral-800 bg-neutral-900 px-4 py-3">
          <p className="text-xs font-medium tracking-wide text-neutral-400 uppercase">How it works</p>
          <ul className="space-y-2 text-xs text-neutral-500">
            <li className="flex gap-2">
              <span className="text-neutral-600">→</span>
              <span>Create a session with your name</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-600">→</span>
              <span>Save your token to access later</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-600">→</span>
              <span>Start chatting anonymously</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-600">Your data is ephemeral. Chats are temporary.</p>
      </div>
    </div>
  );
}
