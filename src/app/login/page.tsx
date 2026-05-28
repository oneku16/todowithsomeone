import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
            Meer Task
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            Shared plans, softly kept
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Sign in with your private account.
          </p>
        </div>

        <form
          action={loginAction}
          className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-stone-700">
              Username
            </span>
            <input
              name="username"
              autoComplete="username"
              required
              className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm font-medium text-stone-700">
              Password
            </span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200"
            />
          </label>

          {error ? (
            <p className="mt-3 text-sm text-rose-600">{decodeURIComponent(error)}</p>
          ) : null}

          <button
            type="submit"
            className="mt-5 w-full rounded-xl bg-stone-900 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
