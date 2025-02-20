import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center justify-center min-h-screen ">
          <div>
            <Badge
              variant={"default"}
              className="font-normal pointer-events-none"
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              variant={"outline"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  return user ? (
    <div className="flex flex-col items-center gap-4 ">
      <p> Hey, {user.email}!</p>
      <div className="flex flex-row justify-start gap-2 w-full">
        <form action={signOutAction}>
          <Button
            type="submit"
            variant={"outline"}
            className="text-slate-500 hover:text-warning"
          >
            Sign out
          </Button>
        </form>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/sign-up" className="hover:text-warning">
            Sign up
          </Link>
        </Button>
      </div>
    </div>
  ) : (
    <div className="flex gap-2 ">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in" className="text-slate-400">
          Sign in
        </Link>
      </Button>
      {user && (
        <Button asChild size="sm" variant={"default"}>
          <Link href="/sign-up">Sign up</Link>
        </Button>
      )}
    </div>
  );
}
