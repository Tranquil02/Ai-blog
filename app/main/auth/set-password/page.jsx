"use client";

export default function SetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[--bg-primary] px-4">
      <div className="w-full max-w-[420px] p-6 bg-white border border-gray-200 rounded-2xl shadow-lg text-center">
        <h1 className="text-lg font-semibold text-gray-900 mb-2">
          Password Management
        </h1>
        <p className="text-sm text-gray-500">
          Admin credentials are managed via environment variables in this
          build. Update `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` to change
          access.
        </p>
      </div>
    </div>
  );
}
