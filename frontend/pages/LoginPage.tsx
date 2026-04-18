import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useLogin } from "../features/auth/hooks";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label, FieldError } from "../components/ui/Label";
import { Card, CardBody } from "../components/ui/Card";
import { getApiErrorMessage } from "../lib/api";
import { toast } from "../stores/toastStore";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Required"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      await login.mutateAsync(values);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (e) {
      toast.error(getApiErrorMessage(e, "Login failed"));
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <Sparkles className="size-4" />
          </div>
          <span className="text-lg font-semibold">PromptForge</span>
        </Link>
        <h1 className="mt-6 text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Sign in to continue building prompts.
        </p>
      </div>

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email" required>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                invalid={!!errors.email}
                className="mt-1.5"
                {...register("email")}
              />
              <FieldError message={errors.email?.message} />
            </div>

            <div>
              <Label htmlFor="password" required>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                invalid={!!errors.password}
                className="mt-1.5"
                {...register("password")}
              />
              <FieldError message={errors.password?.message} />
            </div>

            <Button
              type="submit"
              fullWidth
              loading={login.isPending}
              size="lg"
            >
              Sign in
            </Button>
          </form>
        </CardBody>
      </Card>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        New here?{" "}
        <Link to="/signup" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
          Create an account
        </Link>
      </p>
    </div>
  );
}
