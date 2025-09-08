"use client"
import { getSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useTranslation()
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);

      const result = await signIn("credentials", {
        email: data.email.trim(),
        password: data.password,
        redirect: false,
      });

      if (!result) {
        throw new Error(t("pages:login.noResponseError"));
      }

      if (result.error) {
        throw new Error(result.error);
      }

      const userInfo = await getSession();

      if (userInfo?.user?.email) {
        localStorage.setItem("user", JSON.stringify(userInfo.user));

        if ((userInfo.user as any)?.token) {
          localStorage.setItem("token", (userInfo.user as any).token);
        }

        toast({
          title: "Login Successful",
          description: "You have successfully logged in.",
          variant: "default",
        });

        // Redirect based on user role
        const userRole = (userInfo.user as any)?.account_type;
        if (userRole === 'ai_reporter') {
          router.push("/ai-reporter");
        } else {
          router.push("/dashboard");
        }
      } else {
        throw new Error(t("pages:login.userDataError"));
      }
    } catch (error) {
      toast({
        title: t("pages:login.failureTitle"),
        description: error instanceof Error ? error.message : t("pages:login.unexpectedError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <h1 className="text-2xl font-bold font-heading">{t("pages:login.adminPortal")}</h1>
        <p className="text-sm text-gray-600 mt-2">
          {t("pages:login.welcomeMessage")}
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages:login.emailLabel")}</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder={t("pages:login.emailPlaceholder")} 
                      className="bg-gray-50" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages:login.passwordLabel")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("pages:login.passwordPlaceholder")}
                        className="bg-gray-50 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        aria-label={showPassword ? t("pages:login.hidePassword") : t("pages:login.showPassword")}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#0f0921] hover:bg-[#0f0921]/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? t("pages:login.loggingIn") : t("pages:login.loginButton")}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-xs text-center text-muted-foreground flex flex-col">
        <p>{t("pages:login.securityNotice1")}</p>
        <p>
          {t("pages:login.securityNotice2")}{" "}
          <Link href="#" className="underline">
            {t("pages:login.privacyPolicy")}
          </Link>{" "}
          {t("pages:login.securityNotice3")}{" "}
          <Link href="#" className="underline">
            {t("pages:login.termsOfService")}
          </Link>{" "}
          {t("pages:login.securityNotice4")}
        </p>
      </CardFooter>
    </Card>
  );
}
