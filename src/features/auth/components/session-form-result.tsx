interface SessionStepTwoFormProps {
  token: string;
  persistToken: boolean;
  setPersistToken: (value: boolean) => void;
  onSave: () => void;
  onCopy: () => void;
  error: string;
  copied: boolean;
}

export default function SessionFormResult({
  token,
  persistToken,
  setPersistToken,
  onSave,
  onCopy,
  error,
  copied,
}: SessionStepTwoFormProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-100">EphemChat</h1>
          <p className="mt-1 text-sm text-neutral-500">Session Created</p>
        </div>

        {/* Token Display */}
        <div className="space-y-3">
          <p className="text-xs font-medium tracking-wide text-neutral-400 uppercase">Your Session Token</p>
          <div className="relative rounded border border-neutral-800 bg-neutral-900 p-4">
            <code className="text-xs break-all text-neutral-300">{token}</code>
          </div>
          <p className="text-xs text-neutral-500">
            Save this token if you want to use this account on another device or browser.
          </p>
        </div>

        {/* Copy Button */}
        <button
          onClick={onCopy}
          className={`w-full rounded border px-4 py-2.5 text-sm font-medium transition-colors ${
            copied
              ? "border-emerald-700 bg-emerald-950 text-emerald-200"
              : "border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-800"
          }`}>
          {copied ? "Copied to Clipboard" : "Copy Token"}
        </button>

        {/* Persistence Option */}
        <div className="space-y-3 rounded border border-neutral-800 bg-neutral-900 p-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={persistToken}
              onChange={(e) => setPersistToken(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-700 bg-neutral-800 accent-neutral-600"
            />
            <span className="text-sm text-neutral-300">
              Keep me signed in <span className="text-xs text-neutral-500">(saves in browser)</span>
            </span>
          </label>
          <p className="text-xs text-neutral-500">
            {persistToken
              ? "Your token will be saved locally. Anyone with access to this device can access your account."
              : "Your token will be cleared when you close this tab."}
          </p>
        </div>

        {/* Error Display */}
        {error && <div className="rounded border border-red-900 bg-red-950 px-4 py-2 text-sm text-red-200">{error}</div>}

        {/* Continue Button */}
        <button
          onClick={onSave}
          className="w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm font-medium text-neutral-200 transition-colors hover:border-neutral-600 hover:bg-neutral-800">
          Continue to Chat
        </button>
      </div>
    </div>
  );
}
