import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useRegister } from "../features/auth/hooks";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label, FieldError } from "../components/ui/Label";
import { Card, CardBody } from "../components/ui/Card";
import { getApiErrorMessage } from "../lib/api";
import { toast } from "../stores/toastStore";

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(80),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .max(100, "Too long"),
});
type FormValues = z.infer<typeof schema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const reg = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      await reg.mutateAsync(values);
      toast.success("Account created — let's build your first prompt!");
      navigate("/dashboard");
    } catch (e) {
      toast.error(getApiErrorMessage(e, "Sign up failed"));
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
        <h1 className="mt-6 text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Free forever. No credit card.
        </p>
      </div>

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name" required>
                Name
              </Label>
              <Input
                id="name"
                autoComplete="name"
                invalid={!!errors.name}
                className="mt-1.5"
                {...register("name")}
              />
              <FieldError message={errors.name?.message} />
            </div>

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
              <Label htmlFor="password" required help="At least 8 characters.">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                invalid={!!errors.password}
                className="mt-1.5"
                {...register("password")}
              />
              <FieldError message={errors.password?.message} />
            </div>

            <Button
              type="submit"
              fullWidth
              loading={reg.isPending}
              size="lg"
            >
              Create account
            </Button>
          </form>
        </CardBody>
      </Card>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
          Sign in
        </Link>
      </p>
    </div>
  );
}
