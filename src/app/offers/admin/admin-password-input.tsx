"use client";

import { useState } from "react";

export default function AdminPasswordInput() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid gap-2">
      <label htmlFor="password" className="text-xs font-semibold text-flent-brown">
        Password
      </label>
      <div className="relative">
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          required
          autoFocus
          className="h-11 w-full rounded-md border border-flent-pastel-brown bg-white px-3 pr-12 text-sm text-flent-black outline-none focus:border-flent-brown"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          className="absolute inset-y-0 right-2 my-auto h-8 rounded px-2 text-xs font-semibold text-flent-brown hover:text-flent-black"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
